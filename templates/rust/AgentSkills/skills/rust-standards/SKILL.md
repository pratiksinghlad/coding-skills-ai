---
name: rust-standards
description: >
  Load on every Rust change. AI agents use this when writing, reviewing,
  refactoring, or optimizing Rust for standards, ownership, and implementation:
  API naming, rustfmt, clippy, thiserror, anyhow, tracing, Cargo layout,
  borrowing, lifetimes, Arc/Mutex, and Send + Sync.
compatibility: Requires a stable Rust toolchain and Cargo. Format and lint use rustfmt and clippy. thiserror for library errors, anyhow for applications, tracing for logs.
---

# Rust Standards

AI agents load this file on every Rust edit, with shared principles and standards. Apply these rules while writing.

## Naming
- Types and traits: `PascalCase`. Functions, methods, variables, modules: `snake_case`.
- Constants and statics: `UPPER_SNAKE_CASE`. Lifetimes: a short lowercase name (`'a`).
- Library crate names: `snake_case`. Package names in `Cargo.toml`: `kebab-case`.
- Document public items with `///`.

## Ownership
- One owner at a time. Many shared borrows (`&T`) or one mutable borrow (`&mut T`), never both.
- Add a lifetime only when elision cannot see it. Prefer owned `String` and `Vec` in public APIs.
- `Arc<Mutex<T>>` for shared mutable state. `Arc<RwLock<T>>` when reads dominate. Drop the guard before `.await`.
- Prefer a channel when the work is producer and consumer. No `Rc` or `Cell` across threads.
- Do not `clone()` to silence the borrow checker. Restructure the ownership.

## Errors, logging, dependencies
- Libraries: `thiserror`. Applications: `anyhow` with `context`.
- No `unwrap()` or `expect()` on a production path. Return `Result` and use `?`. Reserve `panic!` for a programmer bug.
- Log with `tracing`. Attach fields with `#[tracing::instrument]`. No `println!` in production. Never log secrets.
- Add a crate only when the standard library does not cover the job. Dev-only crates go in `[dev-dependencies]`.
- Set `default-features = false` when the crate supports it.

## Review Checklist
- [ ] `cargo fmt --check` and `cargo clippy -- -D warnings` are clean.
- [ ] No `unwrap()`, `expect()`, or borrow-checker `clone()` in production code.
- [ ] Lifetimes appear only where elision fails. Guards drop before `.await`.
- [ ] Library errors use `thiserror`. Application errors use `anyhow`.
- [ ] `tracing` is used. Logs contain no secrets. Public items have `///` docs.
- [ ] `cargo audit` reports no known vulnerabilities.

## Verify
After Rust edits, run format, clippy, and the framework build. Fix what they report:

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo build
```

Add or run tests only when the user asks. Then load the `testing` skill and run `cargo test`.
