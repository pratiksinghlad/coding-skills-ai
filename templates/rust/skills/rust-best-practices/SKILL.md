---
name: rust-best-practices
description: >
  Load when writing, reviewing, refactoring, or optimizing Rust code.
  Covers naming conventions, clippy/rustfmt enforcement, error handling with
  thiserror/anyhow, structured logging with tracing, and Cargo workspace layout.
---

# Rust Best Practices

## Naming Conventions (Rust API Guidelines)
- **Types & Traits**: `PascalCase` (`UserRepository`, `Deserialize`)
- **Functions, methods, variables, modules**: `snake_case` (`get_user`, `user_service`)
- **Constants & statics**: `UPPER_SNAKE_CASE` (`MAX_CONNECTIONS`, `DEFAULT_TIMEOUT`)
- **Lifetime parameters**: short lowercase single letters (`'a`, `'db`)
- **Crates**: `snake_case` for library crates, `kebab-case` in `Cargo.toml` names

## Tooling Discipline
- **Format**: `cargo fmt` — enforce in CI with `cargo fmt --check`.
- **Lint**: `cargo clippy -- -D warnings` — all warnings are errors in CI; suppress individually only with a comment explaining the justification.
- **Audit**: `cargo audit` — run in CI to catch known vulnerabilities in dependencies.
- **Build**: `cargo check` for fast feedback; `cargo build --release` for benchmarks and deployment.

## Error Handling
- Use `thiserror` to define typed, domain-specific errors for library crates.
- Use `anyhow` for application-level error aggregation and context chaining (`context()`, `with_context()`).
- Never use `unwrap()` or `expect()` in production paths; propagate with `?`.
- Return `Result<T, E>` from all fallible functions; reserve `panic!` for truly unrecoverable programmer errors.

## Logging & Observability
- Use `tracing` for structured, async-aware logging: `tracing::info!`, `tracing::error!`, `tracing::instrument`.
- Attach contextual fields with `#[tracing::instrument(fields(user_id = %id))]`.
- Initialize the subscriber once at the application entry point (`tracing_subscriber::fmt::init()`).
- Never log secrets, tokens, passwords, or sensitive personal data.

## Dependency Management
- Minimize external dependencies; evaluate the maintenance status and license before adding a new crate.
- Add dev-only dependencies under `[dev-dependencies]` in `Cargo.toml`.
- Use feature flags to keep the dependency graph lean (`default-features = false`).

## Review Checklist
- [ ] `cargo fmt --check` passes.
- [ ] `cargo clippy -- -D warnings` passes with zero warnings.
- [ ] No `unwrap()` / `expect()` in non-test production code.
- [ ] `thiserror` used for library errors; `anyhow` for application errors.
- [ ] Structured `tracing` logging used; no `println!` in production.
- [ ] `cargo audit` passes; no known vulnerabilities.
- [ ] All public API items documented with `///` doc comments.
