---
name: python-uv
description: Build, review, and maintain Python projects that use uv. Use when working on pyproject.toml, dependency management, virtual environments, scripts, CLIs, FastAPI or backend tooling, pytest, Ruff, type checking, or modern Python project structure.
---

# Python uv

## Overview

Use this skill to keep Python projects reproducible, fast to bootstrap, and boring to maintain. Prefer `pyproject.toml`, `uv`, and clear task commands over ad-hoc environment setup and drifting dependency files.

## Workflow

1. Identify whether the task touches packaging, runtime behavior, tooling, or test infrastructure.
2. Keep one source of truth for dependencies and scripts.
3. Prefer explicit commands that work the same locally and in CI.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Project Rules

- Prefer `pyproject.toml` over scattered requirements files unless the repo already uses both for a reason.
- Use `uv sync` or the repo’s documented setup command instead of hand-managing virtualenv state.
- Keep application code, tests, and scripts importable without mutating `sys.path`.
- Use type checking and linting proportionate to the project’s maturity, not as cargo cult.

## Code Rules

- Raise meaningful exceptions and preserve context when crossing I/O boundaries.
- Use context managers for files, clients, database sessions, and subprocess resources.
- Keep async Python and sync Python separated deliberately instead of mixing them accidentally.
- Treat data validation and serialization as explicit layers, especially at API boundaries.

## Review Checklist

- Can a fresh clone get to a working environment with one or two commands?
- Are dependency groups, scripts, and test tools represented clearly in `pyproject.toml`?
- Does the code avoid hidden global state and implicit import-time side effects?
- Are lint, test, and type-check commands stable enough for local and CI reuse?
