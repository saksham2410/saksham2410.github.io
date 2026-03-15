---
title: "gRPC vs REST: When to Choose What at Scale"
date: "2024-10-03"
---

# gRPC vs REST: When to Choose What at Scale

After years of building services at Google where gRPC is the lingua franca, and working with REST APIs everywhere else, I've developed a nuanced view of when each makes sense. The answer isn't "always gRPC" — it's more interesting than that.

## The Core Differences

**REST** is an architectural style built on HTTP/1.1 semantics: resources identified by URLs, manipulated through standard verbs (GET, POST, PUT, DELETE), with JSON as the de facto payload format.

**gRPC** is a framework built on HTTP/2 with Protocol Buffers (protobuf) as its serialization format. It uses a strict contract (`.proto` files) and supports four communication patterns: unary, server streaming, client streaming, and bidirectional streaming.

## Where gRPC Dominates

### 1. Service-to-Service Communication

When Service A calls Service B internally, you want:
- **Strong typing** — Protobuf schemas are your contract. No more "did that field change from string to int?"
- **Code generation** — Auto-generated clients in any language. No hand-writing HTTP clients
- **Performance** — Protobuf is 5-10x smaller than JSON and 10-100x faster to serialize/deserialize

At Google, every internal service communicates via gRPC (or its predecessor, Stubby). The benefits compound: when you have 10,000 services, strong contracts aren't a nice-to-have — they're essential.

### 2. Streaming

REST has no native streaming support. You can hack it with Server-Sent Events or WebSockets, but it's bolted on. gRPC streaming is first-class:

```protobuf
service Analytics {
  // Server streams metrics as they arrive
  rpc StreamMetrics(MetricsRequest) returns (stream Metric);

  // Client streams log entries
  rpc IngestLogs(stream LogEntry) returns (IngestResponse);

  // Bidirectional: real-time chat
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}
```

For real-time data feeds, telemetry pipelines, or any long-lived connection, gRPC streaming is vastly superior.

### 3. Low-Latency Requirements

HTTP/2 multiplexing means multiple gRPC calls share a single TCP connection with no head-of-line blocking. Combined with protobuf's minimal serialization overhead, gRPC typically achieves **2-10x lower latency** than REST+JSON for equivalent payloads.

For services on the critical path where every millisecond counts (ad serving, real-time bidding, game servers), this matters enormously.

### 4. Polyglot Environments

A single `.proto` file generates clients and servers in Go, Java, Python, C++, Rust, and more. The contract is language-agnostic and guaranteed to be compatible.

## Where REST Still Wins

### 1. Public-Facing APIs

Your users have `curl`. They have Postman. They understand `GET /users/123`. REST APIs are universally understood and require zero setup to test.

Try telling a frontend developer to install the protobuf compiler and generate client stubs to test an endpoint. Good luck.

### 2. Browser Clients

gRPC doesn't work natively in browsers. gRPC-Web exists but adds a proxy layer (Envoy) and only supports unary and server-streaming — no client or bidirectional streaming. If your primary client is a web app, REST (or GraphQL) is the pragmatic choice.

### 3. Cacheability

HTTP caching is a superpower. CDNs, reverse proxies, and browser caches all understand REST semantics. A `GET /products/42` with proper `Cache-Control` headers can be served from a CDN edge node 50ms away instead of your origin server 200ms away.

gRPC's POST-based transport makes caching non-trivial. You can do it, but you lose the entire HTTP caching ecosystem.

### 4. Simplicity

For a CRUD API with 5 endpoints, REST is simpler. No proto files, no code generation, no build step. Just define your routes and go.

## The Hybrid Approach

Most large systems use both:

```
[Browser] --REST/GraphQL--> [API Gateway] --gRPC--> [Internal Services]
                                                      |
                                                      +-gRPC-> [Service B]
                                                      +-gRPC-> [Service C]
```

The API gateway translates between REST (external) and gRPC (internal). Tools like `grpc-gateway` can auto-generate a REST API from your proto definitions, giving you the best of both worlds.

## Performance Numbers

From a benchmark I ran with identical services (Go, 1KB payload, same hardware):

| Metric | REST+JSON | gRPC+Protobuf |
|--------|-----------|---------------|
| Serialization | 12 μs | 1.2 μs |
| Deserialization | 15 μs | 1.5 μs |
| Payload size | 1,024 B | 312 B |
| p50 latency | 2.1 ms | 0.8 ms |
| p99 latency | 8.3 ms | 2.1 ms |
| Throughput | 12K rps | 38K rps |

These numbers scale with payload size — the larger the message, the bigger gRPC's advantage.

## My Decision Framework

Use **gRPC** when:
- Internal service-to-service calls
- You need streaming
- Performance is critical
- You have a polyglot microservices architecture
- You want strong contracts between teams

Use **REST** when:
- Public APIs consumed by third parties
- Browser is the primary client
- You want HTTP caching
- Your team is small and velocity matters more than performance
- You're building a simple CRUD service

Use **both** when:
- You're building a large-scale system with both internal and external consumers

The best API isn't the one with the fanciest technology — it's the one that makes your system reliable, your developers productive, and your users happy.
