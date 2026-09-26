---
name: python-best-practices
description: >
  Load when writing, reviewing, refactoring, or optimizing Python code.
  Covers PEP conventions, uv project management, async patterns, error handling,
  structured logging, and maintainability.
---

# Python Best Practices

## Naming Conventions (PEP 8)
- **Modules & packages**: `snake_case` (`user_service.py`, `auth/`)
- **Functions & variables**: `snake_case` (`get_user`, `is_valid`)
- **Classes**: `PascalCase` (`UserService`, `OrderRepository`)
- **Constants**: `UPPER_SNAKE_CASE` (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Private members**: single underscore prefix (`_internal_helper`)
- **Dunder methods**: reserved for Python protocols (`__init__`, `__repr__`)

## Project Setup with uv
```bash
uv init my-project          # scaffold pyproject.toml, src layout
uv add fastapi pydantic      # add runtime dependencies
uv add --dev pytest mypy ruff  # add dev dependencies
uv sync                      # install from uv.lock
uv run pytest                # run commands in the managed venv
```
- Always use `uv`; never run bare `pip install` against the global environment.
- Declare all metadata in `pyproject.toml` (`[project]`, `[build-system]`, tool configs).

## Code Quality & Formatting
- Use `ruff` for linting and formatting (replaces `flake8`, `isort`, `black`).
- Enable `ruff` rules `E`, `F`, `I`, `UP`, `ANN` at minimum in `pyproject.toml`.
- Run `mypy --strict` in CI; no type errors are acceptable in production code.

## Async & I/O
- Use `async`/`await` for all I/O-bound operations (HTTP, database, file, queue).
- Never call blocking functions (`time.sleep`, `open()`, sync DB calls) inside an async context; use their async equivalents.
- Use `asyncio.TaskGroup` (Python 3.11+) for structured concurrent tasks.
- Propagate `asyncio.CancelledError`; never catch it without re-raising.

## Error Handling
- Define domain-specific exception classes inheriting from a project base (`AppError`).
- Catch the narrowest exception type possible; never use bare `except:` or `except Exception:` without logging and re-raising.
- Use `contextlib.suppress` only for explicitly expected, recoverable errors.

## Logging
- Use structured logging (`structlog` or `logging` with a JSON formatter) — never `print()` in production code.
- Bind contextual fields (request IDs, user IDs) to the logger at request scope.
- Never log secrets, tokens, passwords, or PII.

## Review Checklist
- [ ] All names follow PEP 8 conventions.
- [ ] `uv` used for dependency management; `pyproject.toml` up to date.
- [ ] No bare `pip install` or unpinned dependencies.
- [ ] `ruff` passes with zero errors.
- [ ] `mypy --strict` passes with zero errors.
- [ ] No blocking calls inside `async` functions.
- [ ] Structured logging used; no `print()` statements remain.
- [ ] Narrow exception handling; no silent swallowing of errors.
