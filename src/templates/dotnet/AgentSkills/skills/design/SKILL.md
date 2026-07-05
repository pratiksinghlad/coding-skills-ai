---
name: design
description: >
  Load when designing, architecting, or implementing patterns in C#.
  Covers project folder structure (vertical slice), SOLID, KISS, YAGNI,
  DRY, composition, Singleton, and Factory.
---

# Design Principles and Patterns

## Project Structure

Organise by **feature (vertical slice)**, not by technical layer.
Each feature folder owns everything needed for its use case: command, handler, DTO, validator, and endpoint.
This keeps changes local, avoids cross-cutting layers, and scales without requiring global refactors.

```text
src/
├── Features/
│   ├── Products/
│   │   ├── CreateProductCommand.cs
│   │   ├── CreateProductHandler.cs
│   │   ├── ProductDto.cs
│   │   ├── ProductValidator.cs
│   │   └── ProductEndpoints.cs
│   ├── Orders/
│   │   ├── CreateOrderCommand.cs
│   │   ├── CreateOrderHandler.cs
│   │   ├── OrderDto.cs
│   │   ├── OrderValidator.cs
│   │   └── OrderEndpoints.cs
│   └── ...
├── Shared/
│   ├── Middleware/
│   └── Utilities/
└── Program.cs
```

**Rules:**
- One folder per feature — never split a feature across `Commands/`, `Queries/`, `Controllers/` top-level layers.
- When a feature grows, split it into sub-features within the same `Features/<Feature>/` directory before creating a new top-level folder.
- Shared cross-cutting code (middleware, utilities, base types) lives in `Shared/`, not duplicated per feature.
- `Program.cs` wires up DI, middleware, and endpoint registration only — no business logic.

## SOLID

| | Principle | In Practice |
|---|---|---|
| S | Single Responsibility | One class, one reason to change |
| O | Open / Closed | Open to extension, closed to modification |
| L | Liskov Substitution | Subtypes must work wherever the base type works |
| I | Interface Segregation | Small, focused interfaces over large, general ones |
| D | Dependency Inversion | Depend on abstractions, not concrete implementations |

## KISS

Prefer the obvious solution. If a junior engineer cannot understand it in 5 minutes, simplify it.

## YAGNI

Do not build something until it is needed. Solve today's requirement, not tomorrow's guess.

```csharp
// Bad: built "just in case" when only one format exists.
public interface IExporter { }
public class ExporterFactory { }

// Good: solve what exists now.
public string ExportToCsv(Report report) { }
```

## DRY

Keep one source of truth per piece of knowledge: logic, configuration, and data schemas.

## Composition Over Inheritance

Use inheritance only for true "is-a" relationships. Prefer interfaces and delegation.

## Pattern: Singleton

Use when exactly one instance must coordinate shared state. Avoid when it creates hidden global state.

```csharp
public sealed class AppConfig
{
    private static readonly Lazy<AppConfig> InstanceHolder =
        new(() => new AppConfig());

    public static AppConfig Instance => InstanceHolder.Value;

    private AppConfig()
    {
    }
}
```

## Pattern: Factory

Use when creation is complex, varies by type, or must be decoupled from consumers.

```csharp
// Bad
var handler = type == "email" ? new EmailHandler() : new SmsHandler();

// Good
var handler = NotificationFactory.Create(type);
```
