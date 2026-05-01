---
name: csharp-async
description: Design, review, and debug asynchronous C# and .NET code. Use when working with Task, ValueTask, async streams, CancellationToken, background services, fan-out/fan-in flows, UI-thread deadlocks, thread-pool starvation, or async performance regressions.
---

# C# Async Programming Best Practices

## Overview

Use this skill to keep asynchronous .NET code correct under load, cancellation-aware, and easy to reason about. Prefer fixing the root cause of blocking, context capture, and fire-and-forget behavior instead of masking symptoms with retries or extra `Task.Run`.

## Workflow

1. Map the async boundary first: request handler, background worker, event callback, UI action, or library API.
2. Trace the full call chain before editing so you know where blocking, cancellation loss, or context capture starts.
3. Preserve the dominant style of the codebase unless it is the source of the bug.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after changes to catch broken builds and tests quickly.

## Core Rules

- Suffix asynchronous methods with `Async` unless the framework requires a fixed name.
- Return `Task` or `Task<T>` by default. Reach for `ValueTask` only when profiling or hot-path design justifies the trade-off.
- Accept `CancellationToken` on I/O, long-running, and fan-out operations; pass it through instead of recreating it.
- Await tasks instead of using `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()`.
- Reserve `async void` for UI or event-handler signatures that require it.
- Use `ConfigureAwait(false)` in reusable library code; do not sprinkle it blindly across ASP.NET Core request code.

## Concurrency Guidance

- Use `Task.WhenAll` for independent work that should complete together.
- Use `Task.WhenAny` for timeouts, hedging, or “first responder wins” flows.
- Throttle external fan-out with `SemaphoreSlim`, channels, or bounded worker patterns instead of creating unbounded task storms.
- Prefer `IAsyncEnumerable<T>` for streaming large sequences or pipelined work.
- Do not wrap naturally asynchronous I/O in `Task.Run`.

## Failure Patterns To Catch

- Deadlocks caused by sync-over-async calls in UI code, older ASP.NET, or test setup.
- Thread-pool starvation caused by blocking waits inside hot request paths.
- Lost exceptions from fire-and-forget tasks with no supervision or logging.
- Cancellation tokens that stop at one layer and never reach the actual I/O call.
- Async methods that allocate state machines even though they can return an existing task directly.

## Review Checklist

- Does the method expose the right async surface area and cancellation behavior?
- Are parallel operations truly independent, or do they race on shared mutable state?
- Is exception handling preserving stack traces and surfacing failures at the right boundary?
- Will the code behave the same under test, local development, and production load?
