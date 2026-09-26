---
name: performance
description: Use when optimizing Python runtime or memory use. Covers profiling, generators, asyncio concurrency, and connection pooling.
---

# Python Performance

## Profiling First
- Measure before optimizing: use `cProfile`/`profile` for CPU and `memray` or `tracemalloc` for memory.
- Profile realistic workloads, not microbenchmarks, to find true hot paths.

## Memory Efficiency
- Prefer generators and iterators (`yield`) over materializing full lists in memory for large data sets.
- Use `__slots__` on classes with many instances to eliminate per-instance `__dict__` overhead.
- Use `functools.lru_cache` or `functools.cache` for pure, referentially transparent functions called repeatedly with the same arguments.

## Async Concurrency
- Use `asyncio.gather(*tasks)` or `asyncio.TaskGroup` for I/O-bound fan-out; avoid sequential `await` in a loop when tasks are independent.
- Use connection pools (e.g. `asyncpg` pool, `httpx.AsyncClient`) — never create a new connection per request.
- Offload CPU-bound work to a `ProcessPoolExecutor` via `loop.run_in_executor`; do not block the event loop.

## Data & Algorithm Choices
- Use built-in types (`list`, `dict`, `set`) over third-party equivalents for simple cases; they are implemented in C.
- Use `collections.deque` for queue workloads; avoid `list.pop(0)` (O(n)).
- Avoid repeated string concatenation in loops; use `"".join(parts)` instead.
- Prefer comprehensions over `map`/`filter` with lambdas for readability and slight speed advantages.
