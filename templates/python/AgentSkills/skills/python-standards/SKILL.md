---
name: python-standards
description: >
  Load on every Python change. AI agents use this when writing, reviewing,
  refactoring, or optimizing Python for standards, typing, and implementation:
  PEP 8, uv, ruff, mypy or pyright, pydantic, Protocol, TypeVar, Literal,
  TypedDict, async I/O, errors, logging, and maintainability.
compatibility: Requires Python 3.11+ and uv. Lint and types use ruff and mypy, or pyright when the project already uses it. pydantic for models that cross a boundary.
---

# Python Standards

AI agents load this file on every Python edit, with shared principles and standards. Apply these rules while writing.

## Naming (PEP 8)
- Modules, packages, functions, variables: `snake_case`
- Classes: `PascalCase`. Constants: `UPPER_SNAKE_CASE`. Non-public: `_prefix`
- Use dunder names only for language protocols

## Project
- Manage the project with `uv` (`uv add`, `uv sync`, `uv run`). Do not `pip install` into the global environment.
- Put project metadata and tool config in `pyproject.toml`. Commit `uv.lock`.

## Types
- First statement of every module: `from __future__ import annotations`
- Annotate every parameter, return, and class attribute. Write `-> None` when a function returns nothing.
- Do not use `Any`. Use `object`, a bounded `TypeVar`, or `Literal` for a closed set of values.
- Prefer `Protocol` for injectable behavior. Use `type` aliases on 3.12+, otherwise `TypeAlias`.
- `TypedDict` for an external dict shape. `pydantic.BaseModel` for data that crosses a layer. `ConfigDict(frozen=True)` for value objects.
- Validate at the outer boundary (API, CLI, queue), then pass models inward.
- Enable strict checking. Minimum ruff selection is `E`, `F`, `I`, `UP`, `ANN`.

```toml
[tool.mypy]
strict = true

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "ANN"]
```

If the repository already uses pyright, keep pyright on strict mode instead of adding mypy.

## Async, errors, logging
- Use `async`/`await` for I/O. Inside `async def`, do not call `time.sleep`, sync `open`, or a sync client.
- Run independent tasks in `asyncio.TaskGroup`. Re-raise `asyncio.CancelledError`.
- Domain errors subclass one project base. Catch the narrowest type. Do not use a bare `except`.
- Use `contextlib.suppress` only for an error the caller intends to ignore.
- Log with `structlog` or JSON `logging`. No `print` on a production path.
- Bind request and user ids on the request logger. Never log secrets, tokens, or PII.

## Review Checklist
- [ ] Names follow PEP 8.
- [ ] `uv` manages dependencies. `pyproject.toml` and `uv.lock` are current.
- [ ] Every signature is annotated. No unexplained `Any`.
- [ ] Boundary data is a pydantic model. External dicts use `TypedDict`.
- [ ] Async functions do no blocking I/O. `CancelledError` is re-raised.
- [ ] Exceptions are narrow. Logs are structured and contain no secrets.
- [ ] `ruff` and the type checker are clean.

## Verify
After Python edits, run lint, types, and the framework build. Fix what they report:

```bash
uv run ruff check
uv run ruff format --check
uv run mypy
uv build
```

Use `uv run pyright` instead of mypy when that is the repository checker. When `pyproject.toml` has no build backend, run `uv run python -m compileall` on the source tree instead of `uv build`.

Add or run tests only when the user asks. Then load the `testing` skill and run `uv run pytest`.
