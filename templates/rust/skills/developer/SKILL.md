---
name: developer
description: Use when implementing Rust features. Covers ownership, Result error handling, clippy, rustfmt, and tokio async.
---

# Rust Developer

## Implementation Principles
- **Ownership First**: Design types and function signatures to express ownership intent clearly. Prefer borrowing (`&T`, `&mut T`) over cloning in hot paths; clone only when ownership transfer is genuinely required.
- **Idiomatic Error Handling**: Use `Result<T, E>` and propagate errors with `?`. Never `unwrap()` or `expect()` in production code paths — reserve them for tests and infallible cases with a comment explaining why.
- **Zero-Cost Abstractions**: Prefer traits over dynamic dispatch (`Box<dyn Trait>`) unless runtime polymorphism is a firm requirement. Use generics for static dispatch.
- **Complexity Limits**: Keep functions under 50 lines; maximum 2 levels of nesting; use early `return` or `?` to flatten control flow.
- **No Magic Literals**: Replace all magic numbers and strings with named constants (`const`) or `enum` variants.

## Tooling Discipline
- Format every file with `rustfmt` before committing (`cargo fmt`).
- Fix all `clippy` warnings before committing (`cargo clippy -- -D warnings`).
- Use `cargo check` as the fast feedback loop during development.

## Async & Concurrency
- Use `tokio` as the async runtime for all I/O-bound work.
- Annotate async entry points and test functions with `#[tokio::main]` and `#[tokio::test]`.
- Use `tokio::spawn` for independent concurrent tasks; use `tokio::join!` or `tokio::try_join!` to await multiple tasks.
- Protect shared mutable state with `Arc<Mutex<T>>` or `Arc<RwLock<T>>`; prefer message-passing (`tokio::sync::mpsc`) over shared state where possible.
