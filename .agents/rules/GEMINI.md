---
trigger: always_on
---

---

name: core-entry-point
description: >
Load on every task. Non-negotiable principles that govern
all work: how to think, what to change, and how to verify.

---

# Project Entry Point

## Core Principles

> "Simplification is the ultimate sophistication."
> Write code that is simple, small, easy to delete, and entirely free of unnecessary overhead.

1. **Think Before Coding** – Thoroughly understand the goal before writing a single line. If requirements are ambiguous, **stop and ask**—assumptions compound. Surface tradeoffs to the caller rather than burying them in comments.
2. **Simplicity First** – Write the minimum amount of code required to correctly solve the problem. Avoid speculative engineering or building features for future use cases.
3. **Surgical Changes** – Touch only what the task explicitly requires. Avoid "while I'm here" modifications. Refactoring is a separate, isolated task—never bundle it into a feature or bug fix.
4. **Zero-Error Builds** – Every incremental change must maintain system stability. The project must compile cleanly and pass all static analysis checks at every stage of development.
5. **No Race Conditions** – Treat shared mutable state as highly dangerous. Prefer immutability and thread-safe design patterns by default.
6. **Agent Memory** – Approach every task as a learning loop. Read `AgentMemory/index.md` at the start of a task, then load only the domain file(s) relevant to your scope. Before closing the task, evaluate if a new lesson was learned. If so, read `AgentSkills/memory/schema.md`, append exactly one line to the correct domain file, and update the count in `index.md`.
7. **Fail Loudly, Recover Gracefully** – Errors are a first-class output. When something fails, surface it loudly with rich context (what failed, where, and any relevant IDs). Never swallow exceptions silently. Error recovery paths must be designed as deliberately as the happy path.
8. **Prefer Reversible Moves** – When two approaches solve a problem equally well, choose the one that is easier to undo. Explicitly flag irreversible changes (such as schema drops, destructive migrations, or hard deletes) before execution.

---

## Pre-Submit Checklist

### Build & Verification

- [ ] **Clean Build:** The project compiles and builds successfully without any errors or warnings after changes.
- [ ] **Verification Runs:** Relevant build, test, format, and harness commands were executed successfully (or skipped with a clear, explicitly documented reason).
- [ ] **Test Robustness:** Tests cover failure paths and edge cases, not just happy paths.
- [ ] **Isolated Tests:** Tests do not depend on external state, network resources, or a specific execution order.
- [ ] **Behavioral Naming:** Test names clearly describe the expected behavior rather than internal implementation details.

### Scope & Tracking

- [ ] **Surgical Scope:** Only the required files were modified; no unrelated refactoring or metadata churn.
- [ ] **Documentation Sync:** Public documentation was updated if and only if there were changes to behavior, setup, commands, or usage.
- [ ] **Intentional Commits:** The commit message explicitly states _what_ changed and _why_.
- [ ] **Memory Updates:** Contextual memory was updated only if a mistake was corrected or a durable, project-specific rule was discovered.

### Design & Maintainability

- [ ] **Minimalistic Code:** The code is as simple as possible, but no simpler.
- [ ] **No Speculative Design:** There is no speculative generality or unused extension points.
- [ ] **Single Responsibility:** Each function or class does exactly one thing.
- [ ] **Clean Signatures:** No argument list exceeds 4 parameters; complex signatures use an object, options type, or record instead.
- [ ] **Shallow Nesting:** Code nesting does not exceed 2 levels; early returns are preferred to flatten logic.
- [ ] **Meaningful Reusability:** Shared behavior is only extracted when it represents genuine, repeatable reuse—not superficial duplication.
- [ ] **SOLID Principles:** Software design adheres strictly to SOLID principles, with a strong emphasis on Single Responsibility.
- [ ] **No Magic Literals:** All important or arbitrary values are properly named constants.
- [ ] **Intentional Comments:** Comments explain _why_ something is done, never _what_ the code itself already says.

### Reliability & Security

- [ ] **Concurrency Safety:** Shared mutable state is eliminated or protected against race conditions.
- [ ] **Asynchronous Safety:** All async operations implement a clear cancellation path.
- [ ] **Data Protection:** No sensitive data (keys, PII, secrets, or tokens) is leaked into logs, errors, commits, or API responses.
- [ ] **Input Validation:** All external inputs are validated and sanitized before usage.
- [ ] **Contextual Errors:** Errors provide actionable context, including what failed, where it occurred, and relevant tracing IDs.
- [ ] **Structured Logging:** Logging uses structured entries; raw string concatenation in logs is avoided.
- [ ] **Trace Propagation:** Correlation or trace IDs are correctly propagated across cross-service boundaries.
