---
name: dotnet-standards
description: >
  Load on every C# or .NET change. AI agents use this when writing, reviewing,
  refactoring, or optimizing C# for standards and implementation: project
  conventions, CQRS, EF Core, DI lifetimes, async, logging, validation, and maintainability.
compatibility: Requires the .NET SDK declared by the repository (Directory.Build.props, default net10.0). Build with dotnet build.
---

# C# and .NET Standards

AI agents load this file on every C# or .NET edit, with shared principles and standards. Apply these rules while writing.

## Repository Defaults & Structure
- Follow target framework and language versions in `Directory.Build.props` (default `net10.0`, `LangVersion` `latest`).
- Add XML documentation comments for public and shared API surfaces.
- Organize code by feature or domain slices. Place controllers, handlers, validators, repositories, and DTOs in that slice.
- Prefer clear, direct code over speculative patterns (YAGNI).

## CQRS & Architecture
- **Commands**: Mutate state. Return void, an identifier, or a minimal result.
- **Queries**: Read state only.
- **Thin endpoints**: Validate transport concerns and dispatch to a handler.
- **Domain logic**: Keep rules in domain entities or domain services.
- **Immutability**: Use `record` for commands, queries, and DTOs. Mark classes `sealed` unless inheritance is designed.
- **Interfaces**: Define an interface for a boundary that needs a test double, more than one implementation, or an out-of-process call.

## Dependency Injection & Lifetimes
- Use constructor injection or a primary constructor for required dependencies.
- Register the narrowest lifetime: `Singleton` for stateless thread-safe services, `Scoped` for a request and for `DbContext`, `Transient` for a lightweight stateless operation.
- Do not resolve services from `IServiceProvider`, and do not add static global state.

## Async & I/O
- Use `async`/`await` for I/O, database, network, and file work.
- Do not block with `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()`.
- Accept and pass `CancellationToken` through handlers, EF Core, and outbound HTTP.
- `async void` only for a top-level event handler.

## EF Core & Data Access
- Avoid N+1 queries with a projection, `.Include()`, or a separate query.
- Use `.AsNoTracking()` for a read-only query.
- Select the columns the caller needs. Do not load a full tracked entity for a DTO.
- Paginate, filter, and sort on the server.
- Prefer `AnyAsync()` to test existence. Use `ExecuteUpdateAsync` and `ExecuteDeleteAsync` for bulk changes.

## Logging, HTTP, validation
- Log with a message template and named properties. Do not log secrets, passwords, connection strings, or PII.
- Propagate the correlation id. Do not log inside a tight loop.
- Use `IHttpClientFactory`, an explicit timeout, and the caller's `CancellationToken`. Retry transient failures with a bounded backoff.
- Validate inbound payloads with FluentValidation or data annotations. Do not concatenate user input into SQL, a shell command, or a file path.

## Review Checklist
- [ ] Read-only EF Core queries use `.AsNoTracking()`. No N+1 queries.
- [ ] Callers receive a DTO projection, not a tracked entity graph.
- [ ] Async methods take a `CancellationToken` and do not block.
- [ ] `DbContext` is `Scoped`.
- [ ] Logs are structured and contain no secrets.
- [ ] Input is validated at the boundary.
- [ ] `dotnet build` is clean.

## Verify
After C# edits, run the framework build and fix what it reports:

```bash
dotnet build
```

Add or run tests only when the user asks. Then load `csharp-xunit` and run `dotnet test`.
