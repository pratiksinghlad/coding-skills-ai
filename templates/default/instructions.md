# Agent Instructions

## Goal
Implement the requested change with production-quality code, preserving existing behavior and
minimizing the diff, following the project's own architecture and conventions.

## Principles

### Scope & Intent
- Make the smallest change that satisfies the request; touch only what is explicitly required.
- Do not add unrequested features, speculative abstractions, or unsolicited refactoring (YAGNI).
- Favor deletion over addition; reuse existing utilities and helpers before creating new ones.
- If requirements are ambiguous or missing critical details, ask before guessing.

### Code Quality & Design
- Match existing code style, patterns, naming, error handling, and folder structure.
- Apply SOLID, DRY, and KISS: single-responsibility functions, separation of concerns, no duplicated logic.
- Keep functions under 50 lines, nesting depth at most 2 levels (prefer early returns), and signatures under 4 parameters.
- Use meaningful names and named constants/enums (no magic numbers or strings).
- Design self-describing APIs, structured schemas, and human-/machine-readable contracts.
- Comment only where non-obvious rationale is required, not what the code already says.

### Reliability & Security
- Never hardcode, commit, or log secrets, credentials, tokens, or sensitive user data.
- Validate and sanitize external input; use parameterized queries to prevent injection.
- Use idiomatic non-blocking `async`/`await`; ensure code is free of race conditions and deadlocks.
- Avoid deprecated APIs and patterns; introduce new dependencies only when strictly necessary (permissive license, actively maintained).

## Definition of Done
- Builds cleanly and all tests pass without errors or warnings.
- No debug code, dead code, unused imports, or temporary files left behind.
- Changes are minimal, focused, covered by tests, and easy to review.

## Agent Memory
- Read `AgentSkills/memory/index.md` at the start of every task (create if missing); load only relevant domain lessons.
- When a mistake is corrected or a durable rule discovered, record an actionable lesson in `AgentSkills/memory/lessons/<domain>.md` (create if missing) and update `index.md`.
