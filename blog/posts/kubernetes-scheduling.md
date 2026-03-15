---
title: "Deep Dive into Kubernetes Scheduling Algorithms"
date: "2024-12-11"
---

# Deep Dive into Kubernetes Scheduling Algorithms

Kubernetes scheduling looks simple from the outside: you declare a Pod, and it appears on a node. Behind this simplicity lies a sophisticated scheduling pipeline that considers resource requests, node affinity, topology constraints, and dozens of other factors. Understanding it deeply changes how you design workloads.

## The Scheduling Pipeline

The kube-scheduler processes one pod at a time through a two-phase pipeline:

### Phase 1: Filtering (Predicates)

Filtering eliminates nodes that *cannot* run the pod. If your pod requests 4 CPU cores and a node only has 2 available, that node is out. Common filters:

- **NodeResourcesFit** — Does the node have enough CPU, memory, and ephemeral storage?
- **NodeAffinity** — Does the node match the pod's `nodeAffinity` rules?
- **PodTopologySpread** — Would placing the pod here violate topology spread constraints?
- **TaintToleration** — Does the pod tolerate the node's taints?
- **InterPodAffinity** — Are required co-located pods already here?

After filtering, you have a set of *feasible* nodes. If this set is empty, the pod is unschedulable.

### Phase 2: Scoring (Priorities)

Scoring ranks the feasible nodes. Each scoring plugin assigns a score (0-100), and the scheduler sums weighted scores across all plugins.

Key scoring functions:

**LeastRequestedPriority** — Prefers nodes with the most available resources. This spreads pods across the cluster.

```
score = (capacity - requested) / capacity * 100
```

**BalancedResourceAllocation** — Prefers nodes where CPU and memory utilization ratios are similar. A node using 90% CPU and 10% memory is worse than one using 50% of each.

**ImageLocality** — Prefers nodes that already have the container image cached. Pulling a 2GB ML model image takes minutes; using a cached copy takes seconds.

**InterPodAffinityPriority** — Prefer nodes that satisfy pod affinity preferences (soft affinity).

The node with the highest total score wins. Ties are broken randomly.

## Scheduling Framework: Plugins All The Way Down

Since Kubernetes 1.19, the scheduler is built as a **plugin framework**. Every scheduling decision is made by plugins that hook into extension points:

```
QueueSort -> PreFilter -> Filter -> PostFilter ->
PreScore -> Score -> Reserve -> Permit ->
PreBind -> Bind -> PostBind
```

This is powerful because you can:
- Write custom plugins for domain-specific scheduling
- Disable built-in plugins you don't need
- Add new extension points for specialized behavior

## Real-World Scheduling Patterns

### GPU Scheduling

GPU workloads are special. You can't share GPUs the way you share CPU (though GPU time-slicing and MIG are changing this). The `nvidia-device-plugin` exposes GPUs as extended resources:

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
```

The scheduler treats GPUs as opaque integer resources — it knows a node has 4 GPUs and a pod wants 1, but it doesn't understand GPU topology. For ML training jobs that need NVLink connectivity between GPUs, you need topology-aware scheduling — either through custom plugins or tools like Volcano.

### Bin Packing vs. Spreading

The default scheduler spreads pods across nodes (LeastRequestedPriority). This maximizes resilience but wastes resources — you might have 20 nodes each at 30% utilization instead of 6 nodes at 100%.

For cost optimization, flip to **MostRequestedPriority** (bin packing). Pack nodes tight, then scale down empty nodes with the cluster autoscaler.

```yaml
# Scheduler profile for bin-packing
profiles:
  - schedulerName: bin-packer
    plugins:
      score:
        disabled:
          - name: NodeResourcesLeastAllocated
        enabled:
          - name: NodeResourcesMostAllocated
            weight: 1
```

### Topology Spread Constraints

Spread your replicas across failure domains:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: web
```

This ensures your web pods are evenly distributed across availability zones. `maxSkew: 1` means the difference between the most-populated and least-populated zone is at most 1 pod.

### Preemption

When a high-priority pod can't be scheduled, the scheduler looks for lower-priority pods it can evict:

1. For each node, calculate which low-priority pods would need eviction
2. Pick the node that requires the fewest evictions
3. Evict those pods (giving them graceful termination time)
4. Schedule the high-priority pod

Priority classes are powerful but dangerous. A misconfigured high-priority deployment can cascade-evict critical system components. Always test priority interactions.

## Performance at Scale

The default scheduler processes ~100 pods/second on a 5000-node cluster. For larger clusters or specialized workloads, consider:

- **Scheduling profiles** — Run multiple scheduler instances with different configurations
- **Scheduler extenders** — HTTP webhooks for custom filtering/scoring (higher latency than plugins)
- **Gang scheduling** — For ML jobs that need all-or-nothing scheduling (use Volcano or kueue)

## Lessons Learned

1. **Always set resource requests.** Pods without requests get `BestEffort` QoS and are first to be evicted under memory pressure.

2. **Don't over-commit.** If your actual usage is 10x your requests, the scheduler's decisions are based on fiction.

3. **Use Pod Disruption Budgets.** They prevent voluntary evictions from taking down your service.

4. **Monitor scheduling latency.** A scheduling latency spike often indicates resource fragmentation or overly complex affinity rules.

The Kubernetes scheduler is one of the most sophisticated pieces of cluster management software ever built. Understanding it deeply lets you design workloads that are both resilient and efficient.
