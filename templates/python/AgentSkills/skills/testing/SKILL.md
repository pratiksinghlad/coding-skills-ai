---
name: testing
description: Python unit, async, and property-based testing with pytest, pytest-asyncio, and hypothesis.
---

# Python Testing

## Testing Principles
- Test observable behavior and public interfaces, not internal implementation details.
- Follow the **Arrange-Act-Assert (AAA)** pattern in every test.
- Keep tests isolated, deterministic, and independent of execution order or external state.

## Project Setup
- Use `pytest` as the sole test runner; install via `uv add --dev pytest pytest-asyncio pytest-mock hypothesis`.
- Configure in `pyproject.toml`:
  ```toml
  [tool.pytest.ini_options]
  asyncio_mode = "auto"
  ```
- Run tests with `uv run pytest`.

## Test Naming & Structure
- Name test files `test_<module>.py` and place them under a top-level `tests/` directory mirroring the `src/` layout.
- Name test functions: `test_<function>_<scenario>_<expected>` (e.g., `test_create_user_duplicate_email_raises_conflict`).
- Match test class names to the class under test: `TestUserService` for `UserService`.

## Fixtures & Parametrize
- Use `@pytest.fixture` for shared setup; prefer function-scoped fixtures unless sharing is explicitly required.
- Use `@pytest.mark.parametrize` for data-driven cases covering multiple inputs and edge cases.
- Mock external I/O boundaries (HTTP, DB, file system) using `pytest-mock` (`mocker.patch`) — never hit real services in unit tests.

## Async Testing
- Annotate async test functions with `async def`; `asyncio_mode = "auto"` removes the need for `@pytest.mark.asyncio`.
- Use `AsyncMock` from `unittest.mock` to mock async callables and coroutines.

## Property-Based Testing
- Use `hypothesis` for algorithmic and data-parsing logic where exhaustive edge-case enumeration is impractical.
- Define `@given(st.text(), st.integers())` strategies; always run with a fixed `settings(max_examples=200)` in CI.

## Coverage & Quality
- Target 100% coverage on domain and application layers; exclude infrastructure adapters only with justification.
- Run `uv run pytest --cov=src --cov-report=term-missing` in CI.
