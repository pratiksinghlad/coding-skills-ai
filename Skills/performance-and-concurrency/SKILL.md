---
name: performance-and-concurrency
description: Investigate, prevent, and fix performance issues, leaks, races, and deadlocks across application stacks. Use when profiling slow paths, reducing allocations, debugging memory growth, reviewing parallel execution, or making concurrency-safe design changes.
---

# Performance And Concurrency

## Overview

Use this skill when a change must stay correct under load, not just in unit tests. Prefer measuring real bottlenecks and clarifying ownership of shared state before rewriting code for "performance."

## Workflow

1. Reproduce the problem shape first: latency spike, throughput drop, memory growth, CPU saturation, deadlock, or race.
2. Identify whether the dominant cost is I/O, CPU, locking, allocation, serialization, or query shape.
3. Change one lever at a time and preserve observability so the result can be compared.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Performance Rules

- Measure before optimizing and record what metric improved.
- Remove accidental work before adding caches or concurrency.
- Favor bounded queues, backpressure, and clear ownership over unbounded parallelism.
- Keep hot paths allocation-light only when profiling proves it matters.

## Concurrency Rules

- Minimize shared mutable state; prefer message passing or ownership transfer when possible.
- Define lock order when multiple locks exist, or redesign to avoid nested locks.
- Never mix blocking waits into async flows without proving the scheduler impact.
- Make cancellation, timeouts, and retries part of the design instead of afterthoughts.

## Smells To Catch

- Parallel work that competes for the same bottleneck.
- Deadlocks caused by lock inversion or sync-over-async calls.
- Memory leaks from event handlers, static caches, global registries, or long-lived closures.
- "Optimizations" that erase readability without a measured win.

## Review Checklist

- What metric got better, and how do we know?
- Could this change starve threads, lock up a scheduler, or grow memory over time?
- Is the concurrency model documented by the code structure itself?
- Are failure, timeout, and cancellation paths still correct under stress?
