# Cursor / Antigravity Entry Point

This file is a lightweight entry point for Cursor and Antigravity IDEs.

`AgentSkills/` is the single source of truth for skills, agents, memory,
prerequisites, checklists, and project rules used by all coding agents and
AI-enabled IDEs in this repository.

## Start Here

1. Read `AgentSkills/OPERATING.md`.
2. Follow skill routing in `AgentSkills/skills/INDEX.md`.
3. Load role definitions from `AgentSkills/agents/` only when the task requires them.

Do not duplicate canonical instructions in this file. Edit shared guidance in
`AgentSkills/`.

## Mandatory Bootstrap (All Agents — Enforced)

Before changing any file or producing a final answer for any **code-changing**
task in this repository, you MUST complete the following bootstrap sequence
in order. Do NOT skip this sequence even for tasks that appear simple or quick.

1. Read `AgentSkills/OPERATING.md`.
2. Read `AgentSkills/memory/index.md`; load only the domain lesson file(s)
   relevant to the current task (do not load all files at once).
3. Read `AgentSkills/skills/INDEX.md` (when it exists).
4. Always load `AgentSkills/skills/core/SKILL.md`.
5. Load any task-specific skill from `AgentSkills/skills/` that matches the task.
6. For .NET / C# implementation tasks, load `AgentSkills/agents/developer.agent.md`.
7. For design, CQRS structure, SQL schema, or architecture tasks, load
   `AgentSkills/agents/architect.agent.md`.
8. Inspect the worktree context before editing so existing user changes are
   preserved.
9. Define the verification path for the task before making changes.

## Completion Gate (All Agents — Enforced)

Before marking any code-changing task complete:

1. Run the pre-submit checklist in `AgentSkills/skills/core/SKILL.md`.
2. Run the harness validator (unless the task is documentation-only or the
   environment cannot run it — in that case, state the reason explicitly):

   ```powershell
   pwsh ./tools/Harness/validate.ps1
   ```

3. Do not claim completion when required checks fail. List failures clearly and
   leave the work in a reviewable state.
