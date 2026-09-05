---
name: review
description: Code review framework, verification criteria, correctness, and review output standards.
---

# Code Review Guidelines

Universal review framework and verification standards for AI agents and human reviewers across all stacks.

## Five Review Dimensions
1. **Correctness**: Verify behavior matches specifications, handle boundary/edge cases (null, empty, limits, errors), and ensure changes are free of race conditions.
2. **Readability**: Ensure naming is domain-meaningful, control flow is simple (depth <= 2), and functions do not exceed 50 lines.
3. **Architecture**: Adhere to SOLID, DRY, and KISS; keep clean module boundaries; avoid circular dependencies and speculative abstractions (YAGNI).
4. **Security**: Validate untrusted inputs, use parameterized queries, never commit or log credentials/PII, and check for safe error handling.
5. **Performance**: Avoid N+1 queries, unbounded loops, blocking operations in async flows, and redundant re-computations.

## Verification & Automated Checks
- [ ] **Clean Build**: Project builds cleanly with zero errors or warnings.
- [ ] **Zero Lint Errors**: Code adheres to project formatting and static analysis rules.
- [ ] **Tests Pass**: Run test suite; all existing and newly added tests must pass.
- [ ] **Test Robustness**: Tests must cover failure paths, edge cases, and boundary conditions, not just happy paths.

## Review Output Format
Categorize every review finding clearly:
- **Critical**: Must fix before merge (security flaw, data corruption, broken functionality).
- **Important**: Should fix before merge (missing test coverage, poor error recovery, rule violation).
- **Suggestion**: Optional improvements (naming, non-critical refactoring).

## Review Rules
- Review tests first to understand intent and coverage.
- Address root causes over symptoms; fix shared logic once rather than patching callers.
- Never weaken, skip, or delete existing tests to force a pass.
- Provide concrete, actionable fixes for every Critical and Important finding.
