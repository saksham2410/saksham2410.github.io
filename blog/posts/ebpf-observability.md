---
title: "eBPF for Production Observability: A Practical Guide"
date: "2025-10-02"
---

# eBPF for Production Observability: A Practical Guide

eBPF (extended Berkeley Packet Filter) is the most significant Linux kernel technology of the past decade. It lets you run sandboxed programs inside the kernel without modifying kernel source code or loading kernel modules. For observability, this means you can instrument *everything* — network packets, system calls, function calls, scheduler events — with near-zero overhead.

## What Makes eBPF Special

Traditional observability has three options:

1. **Application instrumentation** — Add metrics/tracing to your code. High fidelity but requires code changes and misses system-level events.
2. **Kernel modules** — Full access to kernel internals. Dangerous: a bug crashes the kernel.
3. **Static tracepoints** — Pre-defined kernel instrumentation points. Limited to what kernel developers anticipated.

eBPF gives you option 2's power with option 1's safety. The eBPF verifier statically analyzes your program before loading:

- No infinite loops (bounded loop count)
- No invalid memory access
- No sleeping or blocking
- Stack size limited to 512 bytes
- Program size limited (1M instructions since Linux 5.2)

If the verifier rejects your program, it doesn't load. If it accepts, it's guaranteed safe.

## eBPF Architecture

An eBPF program is:

1. **Written** in C (or Rust, via Aya) and compiled to eBPF bytecode
2. **Loaded** into the kernel via the `bpf()` syscall
3. **Verified** by the in-kernel verifier
4. **JIT-compiled** to native machine code (x86, ARM, etc.)
5. **Attached** to a hook point (kprobe, tracepoint, XDP, etc.)
6. **Communicates** with userspace via maps (hash maps, ring buffers, arrays)

```
User Space          Kernel Space
───────────         ────────────
bpf() syscall  →   Verifier
                    → JIT Compiler
                    → Attach to hook
                        ↓
Userspace app ← Ring Buffer ← eBPF Program
                    (maps)     (runs at hook)
```

## Hook Points for Observability

### kprobes / kretprobes
Attach to any kernel function entry/return. Want to trace every `tcp_connect()` call?

```c
SEC("kprobe/tcp_connect")
int trace_tcp_connect(struct pt_regs *ctx) {
    struct sock *sk = (struct sock *)PT_REGS_PARM1(ctx);
    u32 pid = bpf_get_current_pid_tgid() >> 32;

    struct event e = {};
    e.pid = pid;
    bpf_get_current_comm(&e.comm, sizeof(e.comm));
    e.daddr = sk->__sk_common.skc_daddr;
    e.dport = sk->__sk_common.skc_dport;

    bpf_ringbuf_output(&events, &e, sizeof(e), 0);
    return 0;
}
```

Now you can see every outbound TCP connection with the PID, process name, destination IP, and port — without modifying any application.

### Tracepoints
Stable kernel instrumentation points. Unlike kprobes (which attach to specific function names that can change between kernel versions), tracepoints have stable APIs:

```c
SEC("tracepoint/sched/sched_process_exec")
int trace_exec(struct trace_event_raw_sched_process_exec *ctx) {
    // Fires every time a process calls exec()
}
```

### uprobes
Same as kprobes but for userspace functions. Trace any function in any binary without recompilation:

```c
SEC("uprobe//usr/bin/openssl:SSL_write")
int trace_ssl_write(struct pt_regs *ctx) {
    // Capture unencrypted data before SSL encryption
    // Yes, this is how SSL inspection tools work
}
```

### XDP (eXpress Data Path)
Runs at the network driver level, before the kernel network stack. Processes packets at line rate (10+ Mpps per core). Use for DDoS mitigation, load balancing, or packet filtering.

### Perf Events
Attach to hardware performance counters: cache misses, branch mispredictions, CPU cycles. Profile your application at the hardware level with negligible overhead.

## Building an Observability Stack with eBPF

### Layer 1: Network Observability

**Cilium** provides eBPF-based networking for Kubernetes. Its Hubble component gives you:

- Service-to-service traffic flow maps
- DNS query monitoring
- HTTP/gRPC request/response metrics
- TCP connection tracking
- Network policy enforcement visibility

All without sidecars, all without application changes, all at kernel speed.

### Layer 2: System Call Tracing

Trace system calls to understand I/O patterns:

```c
SEC("tracepoint/syscalls/sys_enter_write")
int trace_write(struct trace_event_raw_sys_enter *ctx) {
    int fd = (int)ctx->args[0];
    size_t count = (size_t)ctx->args[2];

    // Track write sizes per process per file descriptor
    struct key_t key = {
        .pid = bpf_get_current_pid_tgid() >> 32,
        .fd = fd
    };

    struct val_t *val = bpf_map_lookup_elem(&write_stats, &key);
    if (val) {
        val->bytes += count;
        val->calls += 1;
    }
    return 0;
}
```

This reveals which processes are doing small, frequent writes (potential I/O bottleneck) vs. large batch writes.

### Layer 3: Application Profiling

**Continuous profiling** with eBPF captures stack traces at regular intervals:

```c
SEC("perf_event")
int profile(struct bpf_perf_event_data *ctx) {
    u32 pid = bpf_get_current_pid_tgid() >> 32;

    struct stack_key key = {};
    key.pid = pid;
    key.kernel_stack = bpf_get_stackid(ctx, &stacks, 0);
    key.user_stack = bpf_get_stackid(ctx, &stacks, BPF_F_USER_STACK);

    u64 *count = bpf_map_lookup_elem(&counts, &key);
    if (count) (*count)++;
    else { u64 one = 1; bpf_map_update_elem(&counts, &key, &one, BPF_ANY); }

    return 0;
}
```

Tools like **Pyroscope** and **Parca** build on this for production-grade continuous profiling with flame graph visualization.

### Layer 4: Security Observability

**Tetragon** (from Cilium) uses eBPF for runtime security:

- File access monitoring (who opened `/etc/passwd`?)
- Network connection tracking (unexpected outbound connections)
- Process execution logging (what spawned that shell?)
- Capability usage monitoring

## Production Tips

**1. Use CO-RE (Compile Once, Run Everywhere).** CO-RE uses BTF (BPF Type Format) to relocate field offsets at load time. Your eBPF program compiled on kernel 5.15 runs on kernel 6.1 without recompilation.

**2. Watch your map sizes.** eBPF maps consume kernel memory. A hash map with 1M entries and 64-byte values uses ~64MB of pinned kernel memory. Set reasonable limits.

**3. Use ring buffers, not perf buffers.** Ring buffers (since Linux 5.8) are more efficient: one buffer shared across all CPUs vs. per-CPU buffers.

**4. Be careful with string comparison.** eBPF doesn't have `strcmp`. Use `bpf_probe_read_str` + bounded loops or fixed-size comparisons.

**5. Test with `bpf_printk` first.** The eBPF equivalent of `printf` debugging. Read output from `/sys/kernel/debug/tracing/trace_pipe`.

## The eBPF Ecosystem

- **bcc** — Python + C toolkit, great for one-off tools
- **libbpf** — C library for production eBPF programs
- **cilium/ebpf** — Go library, excellent for building Go services with eBPF
- **Aya** — Rust eBPF library, the future for type-safe eBPF development
- **bpftool** — CLI for inspecting loaded eBPF programs and maps

eBPF is redefining what's possible in production observability. The ability to ask arbitrary questions about your system's behavior — without modifying code, without performance overhead, without risk — is a superpower that every infrastructure engineer should have in their toolkit.
