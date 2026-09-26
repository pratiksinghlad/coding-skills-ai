# Contributing

Thanks for helping improve `@pratikpsl/agent-skills`.

## Setup

```bash
git clone https://github.com/pratiksinghlad/coding-skills-ai.git
cd coding-skills-ai
bun install
bun run build
bun test
```

## Layout

| Path | Purpose |
| --- | --- |
| `src/` | TypeScript CLI (`bin/`, `cli/`, `core/`) |
| `templates/<name>/skills/<skill>/SKILL.md` | Bundled Cursor skills shipped on npm |
| `templates/shared/rules/` | Thin always-on Cursor rule copied to `.cursor/rules/` |
| `tests/` | Vitest suite |

## Skill files

Every `SKILL.md` needs YAML frontmatter:

```yaml
---
name: skill-name
description: Use when ...
---
```

`name` is lowercase words separated by hyphens, and it must match the folder name. `description` says when Cursor should load the skill.

Optional `references/`, `scripts/`, and `assets/` directories next to `SKILL.md` are copied with the skill.

## Workflow

1. Create a branch from `main`.
2. Change the CLI, templates, or tests.
3. Run `bun run build && bun test`.
4. Open a PR against `main` with a short summary and test plan.

## Code style

- TypeScript, ESM (`"type": "module"`).
- Prefer small helpers in `src/core/`.
- Do not commit `dist/`, `node_modules/`, or `.tgz` artifacts.

## License

By contributing, you agree that your contributions are licensed under the Apache License 2.0 (see `LICENSE`).
