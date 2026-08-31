---
name: performance
description: .NET memory allocation reduction, Span/ReadOnlySpan, EF Core query tuning, and async efficiency.
---

# .NET Performance

## Memory & Allocation Optimization
- Minimize heap allocations in hot paths using `ReadOnlySpan<T>`, `Span<T>`, and `Memory<T>`.
- Use `ValueTask<T>` for asynchronous methods that frequently complete synchronously.
- Avoid boxing value types and eliminate unnecessary LINQ allocations inside tight loops.
- Use `ArrayPool<T>` or `StringBuilder` for buffer reuse in repetitive or large text/byte operations.

## Database & I/O Efficiency
- Always use `.AsNoTracking()` for read-only EF Core queries to eliminate change tracking overhead.
- Use explicit projection (`.Select(x => new ... )`) to fetch only necessary database columns into DTOs.
- Stream large result sets using `IAsyncEnumerable<T>` instead of buffering entire collections in memory.
- Avoid N+1 queries by using explicit joins, `.Include()`, or split queries where cartesian explosion is a risk.