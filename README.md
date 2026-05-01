# Coding Skills AI

Reusable coding-agent instructions, skills, prompts, and placement guides for Codex, Claude Code, GitHub Copilot, and Google Antigravity.

This repository is the source catalog. Copy only the files a project needs into that project's tool-specific folder structure.

## Repository Layout

```text
.
|-- README.md                    # This placement guide
|-- LICENSE
|-- Skills/                      # Reusable skill catalog
|   |-- aspnet-core/
|   |   |-- SKILL.md
|   |   |-- agents/
|   |   |-- references/
|   |   `-- scripts/
|   |-- ef-core-and-linq/
|   |   |-- SKILL.md
|   |   |-- agents/
|   |   `-- scripts/
|   `-- ...
`-- plugins/                     # Tool-specific packaged examples
    |-- .github/
    |   |-- copilot-instructions.md
    |   `-- prompts/
    `-- csharp-dotnet-development/
        |-- csharp-xunit/
        |   `-- SKILL.md
        `-- dotnet-best-practices/
            `-- SKILL.md
```

## File Placement Rules

Use this table when moving files from this repository into a real project.

| Content type | Source location in this repo | Codex project location | Claude Code project location | Copilot project location | Antigravity project location |
| --- | --- | --- | --- | --- | --- |
| Main project guidance | Write from relevant skills | `AGENTS.md` | `CLAUDE.md` | `.github/copilot-instructions.md` | `AGENTS.md` or `.agents/rules.md` |
| Reusable skill | `Skills/<skill-name>/SKILL.md` | `.codex/skills/<skill-name>/SKILL.md` | `.claude/skills/<skill-name>/SKILL.md` | `.github/skills/<skill-name>/SKILL.md` | `.agents/skills/<skill-name>/SKILL.md` |
| Agent profile | `Skills/<skill-name>/agents/*.yaml` | `.codex/agents/*.yaml` | `.claude/agents/*.md` | `.github/agents/*.agent.md` | `.agents/*.md` |
| Prompt template | `plugins/.github/prompts/*.prompt.md` | `.codex/prompts/*.md` | `.claude/commands/*.md` | `.github/prompts/*.prompt.md` | `.agents/prompts/*.md` |
| Reference docs | `Skills/<skill-name>/references/*` | Keep under the skill folder | Keep under the skill folder | Keep under the skill folder | Keep under the skill folder |
| Helper scripts | `Skills/<skill-name>/scripts/*` | Keep under the skill folder | Keep under the skill folder | Keep under the skill folder | Keep under the skill folder |
| Assets | `Skills/<skill-name>/assets/*` | Keep under the skill folder | Keep under the skill folder | Keep under the skill folder | Keep under the skill folder |

## Codex Structure

Use Codex files when the project should guide OpenAI Codex-style agents.

```text
.
|-- AGENTS.md                         # Main project instructions
`-- .codex/
    |-- skills/
    |   |-- ef-core-and-linq/
    |   |   |-- SKILL.md
    |   |   |-- agents/
    |   |   `-- scripts/
    |   `-- react-typescript-web/
    |       |-- SKILL.md
    |       `-- scripts/
    |-- agents/
    |   `-- senior-csharp-developer.yaml
    `-- prompts/
        `-- docs.md
```

**Keep here**

- `AGENTS.md`: repository-wide rules, build commands, testing policy, architecture constraints.
- `.codex/skills/<skill-name>/SKILL.md`: a complete reusable skill.
- `.codex/agents/`: Codex-specific agent profiles.
- `.codex/prompts/`: reusable prompt templates.

## Claude Code Structure

Use Claude files when the project should guide Claude Code.

```text
.
|-- CLAUDE.md                         # Main project instructions
`-- .claude/
    |-- skills/
    |   |-- ef-core-and-linq/
    |   |   |-- SKILL.md
    |   |   |-- agents/
    |   |   `-- scripts/
    |   `-- csharp-async/
    |       `-- SKILL.md
    |-- agents/
    |   `-- senior-csharp-developer.md
    `-- commands/
        `-- review.md
```

**Keep here**

- `CLAUDE.md`: repository-wide Claude Code instructions.
- `.claude/skills/<skill-name>/SKILL.md`: reusable Claude skill content.
- `.claude/agents/`: project subagents or role instructions.
- `.claude/commands/`: slash-command style prompt files.

## GitHub Copilot Structure

Use Copilot files when the project should guide GitHub Copilot Chat, coding agent flows, and prompt files.

```text
.github/
|-- README.md                            # Main reference, lean
|-- copilot-instructions.md              # Mandatory coding standards
|-- agents/
|   `-- senior-csharp-developer.agent.md # Agent config with YAML frontmatter
|-- prompts/
|   `-- docs.prompt.md                   # Reusable prompt
`-- skills/
    |-- api-best-practices/
    |   `-- SKILL.md                     # API patterns and MediatR
    |-- csharp-xunit/
    |   `-- SKILL.md                     # xUnit testing patterns
    `-- dotnet-best-practices/
        `-- SKILL.md                     # .NET standards and architecture
```

**Keep here**

- `.github/copilot-instructions.md`: required project standards Copilot should always follow.
- `.github/agents/*.agent.md`: Copilot agent definitions with YAML frontmatter.
- `.github/prompts/*.prompt.md`: reusable Copilot prompt files.
- `.github/skills/<skill-name>/SKILL.md`: copied skill content for project use.
- `.github/README.md`: short map explaining what each Copilot file is for.

## Antigravity Structure

Use Antigravity files when the project should guide Google Antigravity-style agent workspaces.

```text
.
|-- AGENTS.md                         # Main project instructions, if supported by the workspace
`-- .agents/
    |-- rules.md                      # Shared standards and operating rules
    |-- agents/
    |   `-- senior-csharp-developer.md
    |-- prompts/
    |   `-- docs.md
    `-- skills/
        |-- ef-core-and-linq/
        |   |-- SKILL.md
        |   |-- agents/
        |   `-- scripts/
        `-- github-actions-cicd/
            `-- SKILL.md
```

**Keep here**

- `AGENTS.md`: high-level workspace instructions when the tool reads root agent files.
- `.agents/rules.md`: shared coding, review, and delivery standards.
- `.agents/agents/`: role-specific agent files.
- `.agents/prompts/`: reusable prompt templates.
- `.agents/skills/<skill-name>/SKILL.md`: copied skill content.

## Skill Folder Standard

Every skill should stay self-contained.

```text
<skill-name>/
|-- SKILL.md                 # Required entry point
|-- agents/                  # Optional tool or role configs
|-- references/              # Optional detailed guidance
|-- scripts/                 # Optional helper scripts
|-- assets/                  # Optional images, diagrams, examples
`-- LICENSE.txt              # Optional third-party license notice
```

## Naming Rules

- Use lowercase kebab-case for skill folders: `ef-core-and-linq`, `react-typescript-web`.
- Keep the skill entry file named exactly `SKILL.md`.
- Keep tool-specific global instruction files at the exact names each tool expects.
- Keep copied references, scripts, and assets inside the same skill folder so relative links continue to work.
- Do not mix tool-specific files at the repository root except widely recognized root files such as `AGENTS.md` or `CLAUDE.md`.

## Recommended Workflow

1. Pick the target coding tool.
2. Create that tool's folder structure in the project.
3. Copy only the required skills from `Skills/`.
4. Add or update the tool's main instruction file.
5. Keep standards in the main instruction file and detailed patterns in individual skills.
6. Run any helper script from the copied skill folder, not from this source catalog, unless you are testing the catalog itself.
