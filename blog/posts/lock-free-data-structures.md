---
title: "Lock-Free Data Structures in Modern C++"
date: "2025-04-07"
---

# Lock-Free Data Structures in Modern C++

Mutexes are the go-to synchronization primitive, and for good reason — they're correct, well-understood, and usually fast enough. But "usually" isn't "always." In hot paths where contention is high and latency budgets are tight, lock-free data structures can be transformative.

## What Does "Lock-Free" Mean?

A data structure is **lock-free** if at least one thread makes progress in a finite number of steps, regardless of what other threads are doing. This is stronger than "doesn't use mutexes" — a spin-lock loop is mutex-free but not lock-free.

The hierarchy:
- **Blocking** (mutexes): A thread holding the lock can block all others
- **Lock-free**: At least one thread always makes progress
- **Wait-free**: Every thread makes progress in bounded steps

Wait-free is the gold standard but extremely hard to achieve in practice. Lock-free is the sweet spot.

## The Foundation: Compare-And-Swap

Almost every lock-free algorithm is built on CAS (Compare-And-Swap):

```cpp
// Pseudocode for CAS
bool CAS(addr, expected, desired) {
    if (*addr == expected) {
        *addr = desired;
        return true;
    }
    return false;
}
```

In C++, this is `std::atomic<T>::compare_exchange_weak/strong`. The hardware guarantees this is atomic — on x86, it's a single `CMPXCHG` instruction.

The pattern: read the current value, compute the new value, CAS it in. If CAS fails (another thread modified it), retry.

## Lock-Free Stack

A lock-free stack (Treiber stack) is the simplest useful lock-free structure:

```cpp
template<typename T>
class LockFreeStack {
    struct Node {
        T data;
        Node* next;
        Node(T val) : data(std::move(val)), next(nullptr) {}
    };

    std::atomic<Node*> head{nullptr};

public:
    void push(T value) {
        Node* new_node = new Node(std::move(value));
        new_node->next = head.load(std::memory_order_relaxed);
        while (!head.compare_exchange_weak(
            new_node->next, new_node,
            std::memory_order_release,
            std::memory_order_relaxed)) {
            // CAS failed, new_node->next was updated to current head
            // Loop retries automatically
        }
    }

    std::optional<T> pop() {
        Node* old_head = head.load(std::memory_order_relaxed);
        while (old_head &&
               !head.compare_exchange_weak(
                   old_head, old_head->next,
                   std::memory_order_acquire,
                   std::memory_order_relaxed)) {
            // CAS failed, old_head updated to current head
        }
        if (!old_head) return std::nullopt;
        T value = std::move(old_head->data);
        // WARNING: Can't delete old_head here! (ABA problem)
        return value;
    }
};
```

Simple and elegant. But there's a trap.

## The ABA Problem

Consider this sequence:

1. Thread A reads `head = A -> B -> C`
2. Thread A is preempted
3. Thread B pops A, pops B, pushes A back
4. Stack is now `A -> C`
5. Thread A resumes, CAS succeeds (head is still A) but `A->next` is now C, not B

Thread A's CAS "succeeds" but corrupts the stack. The value *looked* the same (A) but the state changed underneath.

Solutions:

### Tagged Pointers
Attach a monotonically increasing counter to each pointer:

```cpp
struct TaggedPtr {
    Node* ptr;
    uint64_t tag;
};
std::atomic<TaggedPtr> head;
```

Every modification increments the tag. CAS now checks both pointer and tag, defeating ABA. On x86-64, you can pack pointer + tag into 128 bits and use `CMPXCHG16B`.

### Hazard Pointers
Each thread publishes the pointers it's currently accessing. Other threads check these before freeing memory. If a pointer is hazardous, defer deletion.

```cpp
// Simplified concept
thread_local Node* hazard_ptr = nullptr;

std::optional<T> pop() {
    Node* old_head;
    do {
        old_head = head.load();
        hazard_ptr = old_head;  // Publish: "I'm using this"
        if (head.load() != old_head) continue;  // Double-check
    } while (old_head &&
             !head.compare_exchange_weak(old_head, old_head->next));

    hazard_ptr = nullptr;  // No longer using it
    // Safe to retire old_head (will be freed when no hazard pointers reference it)
    retire(old_head);
    return old_head ? std::optional(old_head->data) : std::nullopt;
}
```

### Epoch-Based Reclamation
Divide time into epochs. Threads enter and exit epochs. Memory freed in epoch N is only reclaimed when all threads have moved past epoch N+2. This is what crossbeam (Rust) uses and it's extremely efficient.

## Lock-Free Queue (Michael-Scott Queue)

The Michael-Scott queue is the gold standard for lock-free FIFO queues:

```cpp
template<typename T>
class LockFreeQueue {
    struct Node {
        T data;
        std::atomic<Node*> next{nullptr};
        Node() = default;
        Node(T val) : data(std::move(val)) {}
    };

    std::atomic<Node*> head;
    std::atomic<Node*> tail;

public:
    LockFreeQueue() {
        Node* sentinel = new Node();
        head.store(sentinel);
        tail.store(sentinel);
    }

    void enqueue(T value) {
        Node* new_node = new Node(std::move(value));
        while (true) {
            Node* last = tail.load();
            Node* next = last->next.load();
            if (last == tail.load()) {
                if (next == nullptr) {
                    if (last->next.compare_exchange_weak(next, new_node)) {
                        tail.compare_exchange_weak(last, new_node);
                        return;
                    }
                } else {
                    // Tail is behind, help advance it
                    tail.compare_exchange_weak(last, next);
                }
            }
        }
    }
};
```

The key insight is **helping**: if a thread notices the tail pointer is behind, it advances it. This cooperative approach is what makes lock-free algorithms lock-free — no thread can permanently block progress.

## Memory Ordering

C++ provides six memory orderings. For lock-free code, you primarily need:

- `memory_order_relaxed` — No ordering guarantees, just atomicity. Use for counters and non-dependent reads.
- `memory_order_acquire` — Reads after this see writes before the paired release. Use when reading shared state.
- `memory_order_release` — Writes before this are visible after the paired acquire. Use when publishing shared state.
- `memory_order_seq_cst` — Total ordering across all threads. The default, and the most expensive.

Getting memory ordering wrong doesn't cause crashes — it causes subtle, near-impossible-to-reproduce bugs where threads see stale data. When in doubt, use `seq_cst` and optimize later with benchmarks.

## When to Use Lock-Free

Use lock-free when:
- You have a **measured** contention bottleneck
- The critical section is very small (a few pointer swaps)
- You need progress guarantees (real-time systems, signal handlers)
- You've profiled and mutexes are the bottleneck

Don't use lock-free when:
- "It might be faster" (benchmark first)
- The critical section does I/O or allocations
- Correctness is hard to verify (most of the time)
- `std::mutex` is fast enough (it usually is)

Lock-free programming is one of the most intellectually demanding areas of systems engineering. Every line of code has non-obvious interactions with hardware memory models, compiler optimizations, and concurrent execution. Respect the complexity, lean on proven algorithms, and always, always benchmark.
