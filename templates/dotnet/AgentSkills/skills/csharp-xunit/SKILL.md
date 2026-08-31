---
name: csharp-xunit
description: Best practices for xUnit testing, data-driven theories, mocking, fixtures, and assertions.
---

# xUnit Best Practices

Guidelines for writing effective, isolated, and maintainable unit and integration tests with xUnit.

## Project Setup & Conventions
- Place tests in a dedicated test project named `[ProjectName].Tests`.
- Reference `Microsoft.NET.Test.Sdk`, `xunit`, and `xunit.runner.visualstudio`.
- Match test class names to the class under test (e.g., `OrderServiceTests` for `OrderService`).
- Execute tests via standard CLI: `dotnet test`.

## Test Structure & Naming
- Follow the **Arrange-Act-Assert (AAA)** pattern.
- Use the standard naming convention: `MethodName_Scenario_ExpectedBehavior`.
- Use constructors for test initialization and `IDisposable.Dispose()` for teardown.
- Use `IClassFixture<T>` for shared context across tests in a single class.
- Use `ICollectionFixture<T>` for shared context across multiple test classes.

## Fact vs. Theory Tests
- **`[Fact]`**: For single-condition tests verifying one specific behavior.
- **`[Theory]`**: For data-driven tests testing multiple inputs and edge cases.
  - `[InlineData(arg1, arg2)]`: For simple scalar test cases.
  - `[MemberData(nameof(TestDataMethod))]`: For complex or generated test objects.
  - `[ClassData(typeof(CustomTestDataClass))]`: For reusable external test datasets.

## Assertions
- Use specific assertions expressing intent:
  - Values: `Assert.Equal(expected, actual)`, `Assert.NotEqual(...)`
  - References: `Assert.Same(expected, actual)`
  - Conditions: `Assert.True(condition)`, `Assert.False(condition)`
  - Collections: `Assert.Contains(item, list)`, `Assert.DoesNotContain(...)`
  - Exceptions: `Assert.Throws<T>(() => ...)` or `await Assert.ThrowsAsync<T>(() => ...)`
- Alternatively, use `FluentAssertions` where it improves assertion readability.

## Isolation & Mocking
- Mock external dependencies and I/O boundaries using Moq or NSubstitute.
- Code against interfaces to enable clean mock substitution.
- Keep tests isolated, independent, and idempotent (no reliance on execution order or external state).