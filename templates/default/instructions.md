# Agent Instructions

## Goal
Implement the requested change with production-quality code, preserving existing behavior and
minimizing the diff, following the project's own architecture and conventions - unless explicitly
told otherwise.

## Principles
- Match existing code style, patterns, naming, architecture, and folder structure.
- Prefer simple, clean, clear, efficient, maintainable, manageable code over clever or complex solutions.
- Make the smallest change that satisfies the request; don't touch unrelated code.
- Favor deletion over addition - don't grow the codebase for changes that don't need it.
- Reuse existing utilities/helpers/components before writing new ones.
- No new dependencies unless necessary. If one is needed: popular, actively maintained,
  permissively licensed (MIT/Apache-2.0), no known security issues.
- Apply SOLID, DRY, KISS. Single-responsibility functions/classes, Separation of concern. No duplicated logic.
- No magic numbers/strings - use named constants/enums.
- Each function must be a maximum of 50 lines.
- Use meaningful names for classes, methods, variables, and all other code.
- Handle errors the way the codebase already does.
- Never hardcode secrets, keys, or credentials; follow the project's existing security practices.
- Use idiomatic async/non-blocking I/O and ensure the code is free of race conditions and deadlocks.
- Avoid deprecated APIs and patterns.
- Comment only where intent isn't obvious from the code itself.
- Don't change public APIs/interfaces, formatting, or file layout unless the task requires it.
- Don't add features, abstractions, or "improvements" that weren't asked for.
- If a requirement is ambiguous or missing critical detail, ask before guessing.

## Definition of Done
- Builds and runs without errors.
- No debug code, dead code, unused imports, or temp files left behind.
- Tests pass; add/update tests for the change if the project has a test suite.
- The change is minimal, focused, and easy to review.

## Agent Memory
Read `AgentSkills/memory/index.md` at the start of every task; load only the relevant domain file(s).
After a task, if a mistake was corrected, append one line to the correct `AgentSkills/memory/lessons/<domain>.md` and update the count in `index.md`.
