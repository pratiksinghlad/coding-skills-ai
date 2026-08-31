---
name: dotnet-best-practices
description: >
  Load when writing, reviewing, refactoring, or optimizing .NET/C# code.
  Covers project conventions, CQRS, EF Core, async, testing, performance,
  logging, security, and maintainability.
---

# .NET/C# Best Practices

Use this skill to keep .NET/C# changes simple, maintainable, testable, and aligned with repository conventions.

## Repository Defaults & Structure
- Follow target framework and language versions in `Directory.Build.props` (default `net10.0`, `LangVersion` `latest`).
- Add XML documentation comments for public/shared API surfaces.
- Organize code by feature or domain slices; place controllers, handlers, validators, repositories, and DTOs predictably.
- Prefer clear, direct code over complex or speculative patterns (YAGNI).

## CQRS & Architecture
- **Commands**: Mutate state; return void, an identifier, or a minimal result.
- **Queries**: Read state only; never mutate data.
- **Thin Endpoints**: Keep controllers and minimal API endpoints thin; validate transport concerns and dispatch via mediator handlers.
- **Domain Logic**: Encapsulate domain rules in domain entities or domain services, never in transport handlers.
- **Immutability**: Use `record` for commands, queries, and DTOs; mark classes `sealed` unless inheritance is intentionally designed.
- **Interfaces**: Define interfaces for boundaries requiring testing, multiple implementations, or out-of-process integration.

## Dependency Injection & Lifetimes
- Use constructor injection or primary constructors for required dependencies.
- Register services with the narrowest appropriate lifetime:
  - `Singleton`: Stateless, thread-safe services.
  - `Scoped`: Request-bound services and EF Core `DbContext`.
  - `Transient`: Lightweight, stateless operations.
- Avoid resolving services manually via `IServiceProvider` or introducing static global state.

## Async & I/O
- Use `async`/`await` for all I/O, database, network, and file operations.
- Never block async code using `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()`.
- Accept and propagate `CancellationToken` through all handler, EF Core, and outbound HTTP calls.
- Avoid `async void` except for top-level event handlers.

## EF Core & Data Access
- Avoid N+1 queries by using explicit projections, `.Include()`, or separate optimized queries.
- Use `.AsNoTracking()` for all read-only queries.
- Select only needed columns into DTOs instead of loading full tracked entities.
- Implement server-side pagination, filtering, and sorting; never filter unbounded sets in memory.
- Prefer `AnyAsync()` over `CountAsync()` when testing for existence.
- Use `ExecuteUpdateAsync` and `ExecuteDeleteAsync` for bulk operations where appropriate.

## Logging & Observability
- Use structured logging with message templates and named properties (`LogInformation("Order {OrderId} processed", id)`).
- Avoid logging inside tight loops or hot execution paths.
- Propagate correlation/request IDs across service and HTTP boundaries.
- Never log secrets, passwords, connection strings, or sensitive personal data (PII).

## HTTP & Resilient Integration
- Use `IHttpClientFactory` for outbound HTTP calls.
- Set explicit timeouts and pass cancellation tokens to all HTTP calls.
- Use bounded retries with exponential backoff for transient failures; avoid unbounded retry storms.
- Batch outbound requests rather than making external calls inside tight loops.

## Security & Validation
- Validate all incoming request payloads using FluentValidation or Data Annotations.
- Never concatenate raw user input into SQL queries, shell commands, or file paths.
- Follow the principle of least privilege for database connections and external service credentials.

## Testing Standards
- Use xUnit for unit and integration testing.
- Structure tests using Arrange-Act-Assert (AAA).
- Test happy paths, edge cases, validation failures, and cancellation flows.
- Keep tests isolated, deterministic, and idempotent.

## Review Checklist
- [ ] No N+1 queries; read-only EF Core queries use `.AsNoTracking()`.
- [ ] DTO projections used; no full entity graphs exposed to callers.
- [ ] Async methods propagate `CancellationToken` without blocking.
- [ ] DI lifetimes correctly configured (`Scoped` for DbContext).
- [ ] Structured logging used without leaking sensitive data or secrets.
- [ ] Input validation applied at boundaries.
- [ ] Tests pass and cover edge cases.
