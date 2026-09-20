---
name: developer
description: Python feature implementation, async I/O, strict static typing, and uv project management.
---

# Python Developer

## Implementation Principles
- **PEP Naming**: `snake_case` for functions, variables, and modules; `PascalCase` for classes; `UPPER_SNAKE_CASE` for constants; `_prefixed` for private members.
- **Static Typing**: Annotate every function signature and class attribute. Enable `from __future__ import annotations` at the top of every module.
- **Pydantic Models**: Use `pydantic.BaseModel` for all data contracts, API request/response bodies, and configuration objects. Never use untyped dicts as data boundaries.
- **Complexity Limits**: Keep functions under 50 lines; maximum 2 levels of nesting; prefer early returns to flatten control flow.
- **No Magic Literals**: Replace all magic numbers and strings with named constants or `enum.Enum` members.

## Project & Dependency Management
- Use `uv` for all project operations: `uv init`, `uv add`, `uv run`, `uv sync`.
- Declare all dependencies in `pyproject.toml`; never mutate the global environment with bare `pip install`.
- Pin direct dependencies; let `uv.lock` track the full resolved set.

## Async & I/O
- Use `async`/`await` for all I/O, network, and database operations.
- Propagate cancellation via `asyncio.CancelledError`; never swallow it silently.
- Use `asyncio.gather` or task groups (`asyncio.TaskGroup`) for concurrent work; avoid blocking calls on the event loop.
