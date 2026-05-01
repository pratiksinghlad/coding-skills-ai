---
name: rust-engineering
description: Build, review, and optimize Rust applications and libraries. Use when working on ownership and borrowing issues, async Rust, traits, lifetimes, error handling, performance, memory safety, concurrency, FFI boundaries, or production-grade tooling in Rust projects.
---

# Rust Engineering

## Overview

Use this skill to keep Rust code idiomatic, measurable, and safe at the boundaries where "just make the compiler happy" often turns into fragile design. Prefer simple ownership models and explicit error propagation before reaching for clever lifetime gymnastics.

## Workflow

1. Identify whether the work is library design, async service code, systems code, CLI tooling, or FFI.
2. Let types and ownership model the domain first; do not patch borrow errors with clones until you understand the cost.
3. Keep unsafe, FFI, and shared-state concurrency in tiny, well-tested seams.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Core Rules

- Prefer clear ownership transfer over deeply nested shared references.
- Use `Result` and domain errors deliberately; avoid `.unwrap()` and `.expect()` outside tests, prototypes, and clearly justified startup failures.
- Keep traits focused and resist abstraction until the second real use case shows up.
- Use iterators and pattern matching for clarity, but do not force combinator chains past readability.
- Reach for `Arc`, `Mutex`, `RwLock`, and channels only when the concurrency model is truly shared-state or message-passing.

## Performance Rules

- Profile before micro-optimizing allocations or inlining decisions.
- Borrow instead of clone on hot paths when it keeps the API understandable.
- Prefer stack-friendly data layouts and bounded buffering when throughput matters.
- Be explicit about blocking vs async work in Tokio or async-std services.

## Smells To Catch

- Hidden blocking inside async executors.
- `clone()` used to silence borrowing problems without understanding ownership.
- Large public APIs exposing unnecessary lifetimes.
- Unsafe blocks with no narrow safety comment or test coverage.
- Error handling that loses actionable context at subsystem boundaries.

## Review Checklist

- Does the design make ownership obvious to the next reader?
- Are concurrency primitives matching the actual communication pattern?
- Is unsafe code isolated, documented, and tested?
- Will this still be debuggable when run with production data volume or workload?
