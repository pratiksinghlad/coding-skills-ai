# Operating Contract

## Workflow
1. **Memory & Context**: Read `AgentSkills/memory/index.md` (create if missing); load only relevant domain lessons to avoid repeating past mistakes.
2. **Role & Skill Discovery**: Consult `AgentSkills/skills/index.md` to identify and load task-specific skills from `AgentSkills/skills/` (including `AgentSkills/skills/review/SKILL.md`). Load relevant role guidance from `AgentSkills/agents/` (`architect.md`, `reviewer.md`, `developer.md`).
3. **Pre-flight Inspection**: Inspect current codebase patterns, dependencies, and baseline build/test state.
4. **Lint Config**: On a TypeScript or JavaScript change, load `AgentSkills/skills/react-typescript/SKILL.md` and `AgentSkills/skills/folder-structure/SKILL.md` before editing when those files exist. On a Python change, load `AgentSkills/skills/python-standards/SKILL.md` and `AgentSkills/skills/folder-structure/SKILL.md` before editing when those files exist. Read the project lint config before editing, and obey it for the whole change (`tsconfig.json`, `pyproject.toml`, `Cargo.toml`, `.editorconfig`, and the same kind of file for any other language). After editing, run that lint when the config exists and fix what it reports. Do not weaken it. Do not create a lint config unless the user ran `agent-skills lint`.
5. **Surgical Implementation**: Apply the minimal change required; adhere strictly to DRY, KISS, and YAGNI.
6. **Verification**: Run the language skill's lint, type feedback, and framework build, and fix what they report. Do not weaken the lint config. Add or run tests only when the user asks. Follow `AgentSkills/skills/review/SKILL.md`.
7. **Learning Loop**: If a mistake was made and corrected or a durable rule discovered, record a concise lesson in `AgentSkills/memory/lessons/<domain>.md` and update `index.md`.

## Completion Checklist
- [ ] Lint, types, and the framework build are clean.
- [ ] Tests were added or run only because the user asked. They pass when run.
- [ ] No dead code, debug logging, unused imports, or temporary files remain.
- [ ] Relevant documentation or memory lessons updated if applicable.
