---
name: rust-ownership
description: >
  Load when writing or reviewing Rust code. Covers ownership, borrowing, lifetimes,
  shared-state concurrency with Arc/Mutex, and Send + Sync safety.
---

# Rust Ownership & Borrowing

## Core Rules
- A value has exactly one owner at a time; ownership transfers on move.
- Borrow immutably (`&T`) as many times as needed, or mutably (`&mut T`) exactly once — never both simultaneously.
- References must never outlive the value they point to; the compiler enforces this via lifetimes.

## Lifetime Annotations
- Add explicit lifetime annotations (`'a`) only when the compiler cannot infer them — let elision work first.
- For structs that hold references, annotate struct lifetime parameters and bound them on the relevant fields.
- Prefer owned types (`String`, `Vec<T>`) over references in public APIs to avoid lifetime propagation into callers.

## Shared State
- Use `Arc<Mutex<T>>` for shared mutable state across threads; use `Arc<RwLock<T>>` when reads dominate.
- Lock mutexes for the shortest scope possible; never hold a lock across an `.await` point.
- Prefer message-passing (`tokio::sync::mpsc`, `std::sync::mpsc`) over shared state when tasks are naturally producer/consumer.

## Send & Sync
- Ensure types shared across thread boundaries implement `Send + Sync`; the compiler enforces this.
- Avoid `Rc<T>` and `Cell<T>` in async or multi-threaded contexts; use `Arc` and `Mutex` instead.
- Use `#[derive(Clone)]` sparingly on types that are expensive to clone; document where clones occur.

## Common Pitfalls
- Never use `unwrap()` or `expect()` in production paths — propagate errors with `?` instead.
- Avoid `clone()` as a workaround for borrow-checker conflicts; restructure ownership or use a reference instead.
- Do not hold a `MutexGuard` across an `await` point — drop it explicitly before awaiting.

## Review Checklist
- [ ] No `unwrap()` / `expect()` in non-test production code.
- [ ] No `clone()` used to paper over borrow-checker issues.
- [ ] Explicit lifetime annotations present only where elision fails.
- [ ] `Mutex` guards released before any `.await` points.
- [ ] `Arc<Mutex<T>>` used for all cross-thread mutable state.
