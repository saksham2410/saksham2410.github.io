---
title: "Optimizing LLM Inference: Quantization, KV Cache, and Beyond"
date: "2025-07-19"
---

# Optimizing LLM Inference: Quantization, KV Cache, and Beyond

Running a 70B parameter language model in production isn't just a "throw GPUs at it" problem. The difference between naive inference and optimized inference is often 10-50x in throughput, with equivalent quality. Here's what matters.

## The Inference Pipeline

LLM inference has two distinct phases:

**Prefill (Prompt Processing):** Process all input tokens in parallel. This is compute-bound — you're doing massive matrix multiplications across the entire prompt.

**Decode (Token Generation):** Generate tokens one at a time, autoregressively. Each step reads the KV cache for all previous tokens but only computes attention for one new token. This is memory-bandwidth-bound.

The critical insight: prefill is GPU-compute-limited, decode is GPU-memory-bandwidth-limited. Optimizing one doesn't help the other.

## Quantization: Fewer Bits, Same Quality

A 70B model in fp16 requires 140GB of GPU memory. That's two A100-80GB GPUs just for weights, before accounting for KV cache and activations.

### Weight-Only Quantization

Replace fp16 weights with lower-precision representations:

- **INT8 (W8A16)**: 8-bit weights, 16-bit activations. Negligible quality loss. Halves memory. Supported by most frameworks.
- **INT4 (W4A16)**: 4-bit weights, 16-bit activations. Minimal quality loss with careful calibration. Quarter the memory.
- **GPTQ**: Post-training quantization that minimizes the layer-wise quantization error. Calibrate on a small dataset, quantize, done.
- **AWQ (Activation-aware Weight Quantization)**: Identifies "salient" weight channels (those that interact with large activations) and preserves their precision. Better quality than GPTQ at the same bit-width.

### FP8 Training and Inference

NVIDIA H100 GPUs natively support FP8 (e4m3 for forward pass, e5m2 for gradients). FP8 inference gives ~2x throughput over FP16 with virtually no quality loss, no calibration needed.

### GGUF and llama.cpp

For CPU and consumer GPU inference, llama.cpp's GGUF format supports aggressive quantization: Q4_K_M, Q5_K_M, Q3_K_S, even Q2_K. The "K" variants use k-quant, which allocates bits non-uniformly — more bits for important layers, fewer for redundant ones.

A 70B model in Q4_K_M runs on a single 48GB GPU or even on a Mac with 64GB unified memory. Quality is surprisingly good.

## KV Cache: The Hidden Memory Hog

During autoregressive decoding, we cache the key and value tensors for all previous tokens across all layers. For a 70B model:

```
KV cache per token = 2 * num_layers * num_heads * head_dim * 2 bytes (fp16)
                   = 2 * 80 * 64 * 128 * 2
                   = 2.6 MB per token
```

For a batch of 32 sequences, each 4096 tokens: `32 * 4096 * 2.6MB = 327 GB`. That's more than the model weights!

### KV Cache Quantization

Quantize the KV cache to INT8 or INT4. This halves or quarters KV cache memory with minimal quality impact. vLLM and TensorRT-LLM both support this.

### Grouped-Query Attention (GQA)

Instead of separate KV pairs per head, share them across groups. LLaMA 2 70B uses 8 KV heads for 64 query heads — an 8x reduction in KV cache size.

### PagedAttention (vLLM)

The key insight: KV cache memory is wasted due to fragmentation. Like OS virtual memory, PagedAttention allocates KV cache in fixed-size pages and maps logical blocks to physical blocks on-demand. This eliminates fragmentation and enables:

- **Memory sharing**: Multiple sequences sharing a common prefix share KV cache pages (copy-on-write)
- **Dynamic allocation**: No need to pre-allocate maximum sequence length
- **Near-zero waste**: Memory utilization approaches 100%

Result: 2-4x more concurrent sequences per GPU.

### Sliding Window Attention

Mistral uses a sliding window of 4096 tokens. Beyond that window, tokens are evicted from the KV cache. This caps memory usage regardless of sequence length, at the cost of losing long-range attention.

## Batching Strategies

### Static Batching

Group N requests, pad to the longest sequence, process together. Problem: short sequences waste compute on padding, and all sequences must finish before the batch is complete.

### Continuous Batching

Also called "iteration-level batching." As soon as a sequence finishes generating, a new request takes its slot. No padding waste, no waiting. This alone can improve throughput 5-10x over static batching.

### Speculative Decoding

Use a small "draft" model (e.g., 1B params) to generate K candidate tokens, then verify all K tokens in a single forward pass of the large model. If the draft model matches, you get K tokens for the cost of 1 large-model forward pass.

```
Draft model:  generates tokens [A, B, C, D, E] (fast, ~5ms)
Large model:  verifies in parallel              (slow, ~50ms)
Result:       accepts [A, B, C], rejects [D]    → 3 tokens in 55ms instead of 150ms
```

Acceptance rates of 70-90% are common when the draft model is well-matched.

### Medusa and Eagle

Instead of a separate draft model, add additional prediction heads to the large model itself. Each head predicts future tokens in parallel. Medusa-2 achieves 2-3x speedup with no quality loss.

## Serving Infrastructure

### Model Parallelism

For models that don't fit on one GPU:

- **Tensor Parallelism (TP)**: Split individual layers across GPUs. Requires fast interconnect (NVLink). Use TP=4 or TP=8 within a node.
- **Pipeline Parallelism (PP)**: Assign different layers to different GPUs. Works across nodes. Higher latency but lower bandwidth requirement.

### Disaggregated Serving

Separate prefill and decode onto different hardware:
- Prefill: Compute-optimized instances with fewer, faster GPUs
- Decode: Memory-bandwidth-optimized instances

This lets you independently scale each phase based on workload characteristics.

## Putting It All Together

A modern LLM serving stack combines:

1. **AWQ INT4 quantization** — 4x memory reduction
2. **GQA** — 8x KV cache reduction (architecture-dependent)
3. **PagedAttention** — Near-zero KV cache fragmentation
4. **Continuous batching** — Maximum throughput
5. **Speculative decoding** — 2-3x latency reduction
6. **Tensor parallelism** — Scale to larger models

The result: what once required 8x A100-80GB GPUs can often be served from 2x A100-40GB or even a single H100, at higher throughput and lower latency.

The art of LLM serving isn't just knowing these techniques — it's knowing which ones matter for your specific model, hardware, and latency/throughput requirements.
