---
name: python-typing
description: >
  Load when writing or reviewing Python code. Covers strict static typing with mypy/pyright,
  pydantic data models, Protocol, TypeVar, Literal, and TypedDict patterns.
---

# Python Static Typing

## Module Setup
- Add `from __future__ import annotations` as the first import in every module to enable postponed evaluation of annotations (PEP 563).
- Enable strict mode in `pyproject.toml`:
  ```toml
  [tool.mypy]
  strict = true
  warn_return_any = true
  disallow_untyped_defs = true
  ```

## Function & Variable Annotations
- Annotate every function parameter, return type, and class attribute without exception.
- Use `None` as an explicit return type for functions that return nothing; never omit the annotation.
- Avoid `Any` — use `object` for truly unknown types, or narrow with generics and `TypeVar`.

## Type Constructs
- **`TypeAlias`**: Use `type Alias = ...` (Python 3.12+) or `TypeAlias` from `typing` for readable compound types.
- **`Protocol`**: Prefer structural subtyping (`Protocol`) over ABCs for dependency injection and testability.
- **`TypeVar` / `ParamSpec`**: Use for generic functions and decorators; constrain with `bound=` where applicable.
- **`Literal`**: Use `Literal["value"]` to narrow string/int constants in type signatures.
- **`TypedDict`**: Use for dict shapes at external boundaries (JSON, config); prefer `pydantic.BaseModel` for mutable internal models.

## Pydantic Models
- Define all data contracts as `pydantic.BaseModel` subclasses; never pass raw `dict` across layer boundaries.
- Use `model_config = ConfigDict(frozen=True)` for immutable value objects.
- Validate external inputs at the outermost boundary (API, CLI, queue consumer) before passing into application logic.

## Review Checklist
- [ ] `from __future__ import annotations` present in every module.
- [ ] No `Any` without a documented justification comment.
- [ ] All function signatures fully annotated (parameters + return).
- [ ] Pydantic models used at all data boundaries.
- [ ] `mypy --strict` passes with zero errors.
