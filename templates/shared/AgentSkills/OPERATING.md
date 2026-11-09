# Operating Contract

## Workflow
1. **Memory & Context**: Read `AgentSkills/memory/index.md` (create if missing); load only relevant domain lessons to avoid repeating past mistakes.
2. **Role & Skill Discovery**: Consult `AgentSkills/skills/index.md` to identify and load task-specific skills from `AgentSkills/skills/` (including `AgentSkills/skills/review/SKILL.md`). Load relevant role guidance from `AgentSkills/agents/` (`architect.md`, `reviewer.md`, `developer.md`).
3. **Pre-flight Inspection**: Inspect current codebase patterns, dependencies, and baseline build/test state.
4. **Surgical Implementation**: Apply the minimal change required; adhere strictly to DRY, KISS, and YAGNI.
5. **Verification**: Run the language skill's lint, type feedback, and framework build, and fix what they report. Add or run tests only when the user asks. Follow `AgentSkills/skills/review/SKILL.md`.
6. **Learning Loop**: If a mistake was made and corrected or a durable rule discovered, record a concise lesson in `AgentSkills/memory/lessons/<domain>.md` and update `index.md`.

## Completion Checklist
- [ ] Lint, types, and the framework build are clean.
- [ ] Tests were added or run only because the user asked. They pass when run.
- [ ] No dead code, debug logging, unused imports, or temporary files remain.
- [ ] Relevant documentation or memory lessons updated if applicable.
