---
name: architect
description: Use when designing Python package or application boundaries. Covers layered architecture, pydantic contracts, and pyproject.toml layout.
---

# Python Architect

## Architectural Principles
- **Layered Separation**: Enforce clean boundaries across `domain` (entities, value objects), `application` (use cases, services), `infrastructure` (DB, HTTP, queue adapters), and `api` (FastAPI/Flask routes or CLI entry points).
- **Dependency Direction**: Outer layers depend on inner layers; never let `domain` import from `infrastructure`.
- **Contract-First Design**: Define `pydantic` schemas and typed interfaces before implementation. Treat data shapes as the primary design artifact.
- **Packaging**: Structure projects with `pyproject.toml` (`[project]`, `[build-system]`, `[tool.mypy]`, `[tool.ruff]`). Use namespace packages only when cross-team sharing genuinely requires it.
- **Genuine Reusability**: Extract shared utilities only when the same logic is needed across at least two distinct domains. Avoid premature abstraction (YAGNI).
