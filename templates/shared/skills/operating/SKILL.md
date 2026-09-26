---
name: operating
description: Use when starting any coding task. Covers inspecting the codebase, making the smallest change, verifying with the project's build and tests, and recording a lesson after a correction.
---

# Operating Contract

Cursor discovers skills in `.cursor/skills/` from each skill's `name` and `description`. Load a skill when its description matches the task. Role skills are `architect`, `developer`, and `reviewer`.

## Workflow
1. **Role and skills**: Apply this skill, then load only the skills whose descriptions match the work (including `review` before finishing).
2. **Memory**: Read `.cursor/memory/index.md` when it exists, and load only the domain lessons that apply.
3. **Pre-flight**: Inspect current patterns, dependencies, and the baseline build and test state.
4. **Surgical change**: Apply the smallest change that satisfies the request. Follow DRY, KISS, and YAGNI.
5. **Verification**: Run the project's build and test commands and check failure paths and edge cases using the `review` skill.
6. **Learning loop**: When a mistake is corrected or a durable project rule is discovered, record a short lesson in `.cursor/memory/lessons/<domain>.md` and update `.cursor/memory/index.md`.

## Completion Checklist
- [ ] The project builds cleanly, with no errors or warnings.
- [ ] Automated tests pass and cover failure paths and edge cases.
- [ ] No dead code, debug logging, unused imports, or temporary files remain.
- [ ] Documentation or memory lessons are updated when the change requires it.
