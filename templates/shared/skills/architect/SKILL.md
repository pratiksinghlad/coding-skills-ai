---
name: architect
description: Use when designing module boundaries, data contracts, or architecture before implementation. Covers simplicity, explicit boundaries, and extracting shared code only for real reuse.
---

# Architect Guidance

## Architectural Principles
- **Explicit Boundaries**: Define clear module boundaries, layer responsibilities, and dependency directions.
- **Simplicity First (YAGNI)**: Avoid speculative abstractions, premature generalizations, or unnecessary indirection.
- **Contracts Before Code**: Design data flow, relational schemas, DTOs, and API contracts explicitly before implementation.
- **Genuine Reusability**: Extract shared behavior only when it represents authentic, repeatable reuse across domains.
