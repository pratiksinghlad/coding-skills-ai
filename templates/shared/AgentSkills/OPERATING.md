# Operating Contract

## Workflow
1. **Memory & Context**: Read `AgentSkills/memory/index.md` (create if missing); load only relevant domain lessons to avoid repeating past mistakes.
2. **Role & Skill Discovery**: Load relevant role guidance from `AgentSkills/agents/` and skills from `AgentSkills/skills/`.
3. **Pre-flight Inspection**: Inspect current codebase patterns, dependencies, and baseline build/test state.
4. **Surgical Implementation**: Apply the minimal change required; adhere strictly to DRY, KISS, and YAGNI.
5. **Verification**: Run the project's build and test commands (e.g. `npm test`, `dotnet test`, or project test suite) to verify happy paths and edge cases.
6. **Learning Loop**: If a mistake was made and corrected or a durable rule discovered, record a concise lesson in `AgentSkills/memory/lessons/<domain>.md` and update `index.md`.

## Completion Checklist
- [ ] Project builds cleanly with zero errors or warnings.
- [ ] Automated tests pass and cover failure paths and edge cases.
- [ ] No dead code, debug logging, unused imports, or temporary files remain.
- [ ] Relevant documentation or memory lessons updated if applicable.
