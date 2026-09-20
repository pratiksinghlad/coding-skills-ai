---
name: standards
description: Core code quality, simplicity, complexity limits, naming, and structural conventions.
---

# Code Standards

## Complexity & Structure
- **Function Size**: Maximum 50 lines per function.
- **Shallow Nesting**: Maximum 2 levels of nesting; prefer early returns to flatten control flow.
- **Clean Signatures**: Maximum 4 parameters per function; use an options object or record for complex signatures.

## Design & Clean Code
- **Simplicity First (KISS / YAGNI)**: Favor simple, clear, maintainable solutions over clever abstractions. Do not add unrequested features.
- **SOLID / DRY**: Single-responsibility components; eliminate duplicated logic; prefer clear, direct implementations over speculative abstractions (YAGNI).
- **Less is more**: Avoid over-engineering; prefer fewer moving parts and simpler designs.
- **Consistent Style**: Follow the repository's style guide; use linters and formatters to enforce consistency.
- **Configuration & Defaults**: Provide sensible defaults and configuration options; avoid hardcoding values.
- **separation of Concerns**: Keep business logic, data access, and presentation layers distinct; avoid mixing responsibilities.
- **Modular Design**: Break down large components into smaller, reusable modules; prefer composition over inheritance.
- **Dependency Management**: Minimize external dependencies; prefer standard libraries and well-maintained packages; avoid unnecessary bloat.
- **self-Documenting Code**: Write code that is clear and understandable without excessive comments; use meaningful names and expressive constructs.
- **security & Privacy**: Follow best practices for secure coding; validate inputs, sanitize outputs, and protect sensitive data.
- **Naming & Clarity**: Use descriptive, domain-meaningful names for classes, functions, and variables.
- **No Magic Literals**: Replace magic numbers and strings with named constants or enums.
- **Contracts & Schemas**: Design explicit, human- and machine-readable data contracts, schemas, and self-describing APIs.
- **Intentional Comments**: Comment only where non-obvious rationale is required, never restate what the code itself expresses. Comments should explain "why" not "what". CODE SHOULD BE SELF-DESCRIBING.

## Concurrency & Safety
- **Async Safety**: Use idiomatic non-blocking `async`/`await`; ensure operations are free of race conditions and deadlocks.
- **Cancellation**: Implement cancellation tokens or abort controllers for async and I/O boundaries.

## Errors & Logging
- **Idiomatic Errors**: Handle errors consistently with repository patterns; provide actionable context (what failed, where, identifiers).
- **No Silent Failures**: Never swallow exceptions silently.
- **Structured Logging**: Use structured logging entries rather than raw string concatenation.
