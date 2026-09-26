---
name: developer
description: Use when implementing .NET or C# features. Covers ASP.NET Core endpoints, records, async cancellation, EF Core queries, and MediatR-style handlers.
---

# .NET Developer

## Implementation Principles
- **Modern C# Idioms**: Use `record` for immutable DTOs/commands/queries, `sealed` classes by default, and primary constructors where appropriate.
- **Clean Endpoints**: Keep controllers thin; handle validation and dispatch requests through mediator handlers.
- **Async & Cancellation**: Use non-blocking `async`/`await` throughout; propagate `CancellationToken` to all EF Core, HTTP, and async calls.
- **Query Efficiency**: Always use `.AsNoTracking()` for read-only queries, project explicitly to DTOs, and prevent N+1 query patterns.
- **Complexity Limits**: Keep methods under 50 lines, avoid blocking calls (`.Result`, `.Wait()`), and eliminate magic numbers/strings.
