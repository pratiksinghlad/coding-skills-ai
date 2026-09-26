---
name: architect
description: Use when designing a Rust workspace or crate boundaries. Covers visibility, traits, and dependency direction between crates.
---

# Rust Architect

## Architectural Principles
- **Workspace Layout**: Use a Cargo workspace (`[workspace]` in root `Cargo.toml`) to separate concerns: e.g. `crates/domain`, `crates/api`, `crates/infra`, `crates/cli`. Each crate has one responsibility.
- **Visibility Minimization**: Default to `pub(crate)` for intra-workspace sharing; expose items as `pub` only when they form the deliberate public API of the crate.
- **Trait-Based Design**: Define behavior through traits; depend on trait abstractions (not concrete types) at crate boundaries to enable testing and future substitution without coupling.
- **Contract-First**: Define data types (`struct`, `enum`) and trait interfaces before implementing business logic. Types are the primary design artifact.
- **Dependency Direction**: Application crates depend on domain crates; infrastructure crates depend on application traits; no domain crate imports from infrastructure.
- **Genuine Reusability**: Extract shared code into a library crate only when two or more crates genuinely share the same logic. Avoid premature abstraction (YAGNI).
