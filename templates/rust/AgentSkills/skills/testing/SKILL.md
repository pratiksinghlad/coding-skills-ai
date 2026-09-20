---
name: testing
description: Rust unit, async, integration, and property-based testing with cargo test, tokio::test, and proptest.
---

# Rust Testing

## Testing Principles
- Test observable behavior through public interfaces, not internal implementation details.
- Follow the **Arrange-Act-Assert (AAA)** pattern in every test.
- Keep tests isolated, deterministic, and independent of execution order or external state.

## Unit Tests
- Place unit tests in the same file as the code under test inside a `#[cfg(test)]` module:
  ```rust
  #[cfg(test)]
  mod tests {
      use super::*;

      #[test]
      fn create_user_valid_input_returns_ok() {
          // Arrange / Act / Assert
      }
  }
  ```
- Use descriptive names: `fn <function>_<scenario>_<expected>`.

## Async Tests
- Use `#[tokio::test]` for async test functions:
  ```rust
  #[tokio::test]
  async fn fetch_user_not_found_returns_error() { ... }
  ```
- Mock async I/O boundaries with `mockall` (`#[automock]`) — never hit real services in unit tests.

## Integration Tests
- Place integration tests in the top-level `tests/` directory; each file is a separate test binary.
- Use `common/mod.rs` (or `common.rs`) under `tests/` for shared test helpers and fixtures.
- Run with `cargo test --test <name>`.

## Property-Based Testing
- Use `proptest` for algorithmic and parsing logic where exhaustive edge-case enumeration is impractical.
  ```rust
  proptest! {
      #[test]
      fn parse_roundtrip(s in "\\PC*") { ... }
  }
  ```

## Mocking
- Use `mockall` to generate mocks for traits: annotate the trait with `#[automock]` and import `MockMyTrait` in tests.
- Verify expectations explicitly with `.expect(n)` or `.times(n)` on mock methods.

## Running Tests
```bash
cargo test                    # all tests
cargo test --lib              # unit tests only
cargo test --test integration  # integration tests only
cargo test -- --nocapture     # show stdout during tests
```
