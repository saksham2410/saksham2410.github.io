---
title: "Building an Async Runtime in Rust from Scratch"
date: "2026-01-14"
---

# Building an Async Runtime in Rust from Scratch

Rust's async/await is zero-cost — the compiler transforms async functions into state machines, and there's no runtime overhead unless you're actually waiting. But someone has to *drive* those state machines. That's the async runtime. Let's build one from scratch to understand how Tokio and async-std work under the hood.

## Futures: The Foundation

A Rust future is a trait with one method:

```rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}

enum Poll<T> {
    Ready(T),
    Pending,
}
```

When you `poll()` a future:
- `Ready(value)` means it's done
- `Pending` means it's not done yet — but it's registered a waker to be notified when progress is possible

The **waker** is the crucial piece. It's a callback that says "hey, poll me again — I might be ready now."

## The Simplest Possible Runtime

A runtime needs to do three things:
1. Accept futures to execute
2. Poll them
3. When they return `Pending`, wait for the waker to fire, then poll again

Here's a minimal single-threaded runtime:

```rust
use std::collections::VecDeque;
use std::future::Future;
use std::pin::Pin;
use std::sync::{Arc, Mutex};
use std::task::{Context, Poll, Wake, Waker};

type BoxFuture = Pin<Box<dyn Future<Output = ()> + Send>>;

struct Task {
    future: Mutex<BoxFuture>,
}

impl Wake for Task {
    fn wake(self: Arc<Self>) {
        // Re-enqueue the task for polling
        QUEUE.with(|q| q.borrow_mut().push_back(self));
    }
}

thread_local! {
    static QUEUE: std::cell::RefCell<VecDeque<Arc<Task>>> =
        std::cell::RefCell::new(VecDeque::new());
}

fn spawn(future: impl Future<Output = ()> + Send + 'static) {
    let task = Arc::new(Task {
        future: Mutex::new(Box::pin(future)),
    });
    QUEUE.with(|q| q.borrow_mut().push_back(task));
}

fn block_on(future: impl Future<Output = ()> + Send + 'static) {
    spawn(future);

    QUEUE.with(|q| {
        loop {
            let task = q.borrow_mut().pop_front();
            match task {
                Some(task) => {
                    let waker = Waker::from(task.clone());
                    let mut cx = Context::from_waker(&waker);
                    let mut future = task.future.lock().unwrap();
                    let _ = future.as_mut().poll(&mut cx);
                }
                None => break, // No more tasks
            }
        }
    });
}
```

This works! But it busy-loops and can only run on one thread. Let's fix both.

## Adding I/O: Integrating with epoll

Real async work involves I/O — reading from sockets, files, timers. The OS provides mechanisms to wait for I/O without spinning: `epoll` (Linux), `kqueue` (macOS/BSD), `io_uring` (modern Linux).

We'll use epoll:

```rust
use std::os::unix::io::RawFd;

struct Reactor {
    epoll_fd: RawFd,
    wakers: Mutex<HashMap<u64, Waker>>,
    next_token: AtomicU64,
}

impl Reactor {
    fn new() -> Self {
        let epoll_fd = unsafe { libc::epoll_create1(0) };
        Self {
            epoll_fd,
            wakers: Mutex::new(HashMap::new()),
            next_token: AtomicU64::new(0),
        }
    }

    fn register(&self, fd: RawFd, waker: Waker) -> u64 {
        let token = self.next_token.fetch_add(1, Ordering::Relaxed);
        self.wakers.lock().unwrap().insert(token, waker);

        let mut event = libc::epoll_event {
            events: (libc::EPOLLIN | libc::EPOLLOUT | libc::EPOLLET) as u32,
            u64: token,
        };
        unsafe {
            libc::epoll_ctl(self.epoll_fd, libc::EPOLL_CTL_ADD, fd, &mut event);
        }
        token
    }

    fn wait(&self) {
        let mut events = vec![libc::epoll_event { events: 0, u64: 0 }; 64];
        let n = unsafe {
            libc::epoll_wait(self.epoll_fd, events.as_mut_ptr(), 64, 100) // 100ms timeout
        };
        for i in 0..n as usize {
            let token = events[i].u64;
            if let Some(waker) = self.wakers.lock().unwrap().remove(&token) {
                waker.wake();
            }
        }
    }
}
```

Now our runtime can actually wait for I/O instead of busy-looping.

## Multi-Threaded Work Stealing

A production runtime needs multiple threads. The best approach is **work stealing**: each thread has its own task queue, and idle threads steal tasks from busy threads.

```rust
struct Worker {
    local_queue: VecDeque<Arc<Task>>,
    steal_from: Vec<Arc<Mutex<VecDeque<Arc<Task>>>>>,
}

impl Worker {
    fn run(&mut self) {
        loop {
            // 1. Try local queue
            if let Some(task) = self.local_queue.pop_front() {
                self.poll_task(task);
                continue;
            }

            // 2. Try stealing from other workers
            for other in &self.steal_from {
                if let Some(task) = other.lock().unwrap().pop_back() {
                    self.poll_task(task);
                    continue;
                }
            }

            // 3. No work available, park the thread
            std::thread::park();
        }
    }
}
```

Tokio's actual implementation uses a lock-free deque (crossbeam's) and more sophisticated stealing strategies, but the principle is the same.

## Timer Implementation

Timers are essential for timeouts and periodic tasks. A timer wheel is the classic approach:

```rust
struct TimerWheel {
    slots: Vec<Vec<(Instant, Waker)>>,
    current_slot: usize,
    resolution: Duration, // e.g., 1ms per slot
}

impl TimerWheel {
    fn register(&mut self, deadline: Instant, waker: Waker) {
        let ticks = (deadline - Instant::now()).as_millis() as usize
            / self.resolution.as_millis() as usize;
        let slot = (self.current_slot + ticks) % self.slots.len();
        self.slots[slot].push((deadline, waker));
    }

    fn advance(&mut self) {
        self.current_slot = (self.current_slot + 1) % self.slots.len();
        let expired: Vec<_> = self.slots[self.current_slot]
            .drain(..)
            .filter(|(deadline, _)| *deadline <= Instant::now())
            .collect();
        for (_, waker) in expired {
            waker.wake();
        }
    }
}
```

Tokio uses a hierarchical timer wheel for efficiency across different time scales.

## Putting It Together

Our runtime's main loop becomes:

```rust
fn runtime_thread(worker: &mut Worker, reactor: &Reactor) {
    loop {
        // 1. Poll ready tasks
        while let Some(task) = worker.next_task() {
            worker.poll_task(task);
        }

        // 2. Check for I/O events
        reactor.wait(); // This wakes tasks via wakers

        // 3. Advance timers
        TIMER_WHEEL.lock().unwrap().advance();

        // 4. If still no work, park
        if worker.local_queue.is_empty() {
            std::thread::park_timeout(Duration::from_millis(1));
        }
    }
}
```

## Lessons from Building This

**1. Pin is annoying but necessary.** Self-referential futures (which async/await generates) must not be moved in memory. `Pin` enforces this at the type level. You'll fight the borrow checker here.

**2. Wakers must be thread-safe.** A waker can be called from any thread (e.g., an I/O thread notifying a compute thread). `Arc`-based wakers are the standard approach.

**3. io_uring changes everything.** epoll requires one syscall per I/O operation. io_uring batches submissions and completions in shared ring buffers, eliminating most syscalls. Tokio's `tokio-uring` crate leverages this for significantly higher throughput.

**4. Structured concurrency matters.** Spawning tasks that outlive their parent scope causes bugs. Tokio's `JoinSet` and libraries like `async-scoped` enforce structured lifetimes.

**5. Don't build your own runtime.** This exercise is for understanding. In production, use Tokio. It has years of battle-testing, excellent performance, and a massive ecosystem.

Understanding how the runtime works makes you a better async Rust developer. When you see a deadlock, you'll understand it's because you're blocking the runtime thread. When you see poor performance, you'll know to check task granularity and I/O batching. The abstraction is zero-cost, but only if you understand what's underneath.
