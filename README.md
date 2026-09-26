# @pratikpsl/agent-skills

> Install Cursor workspace skills into `.cursor/skills/`.

`@pratikpsl/agent-skills` is one npm package: a TypeScript CLI and offline templates under `templates/`. Nothing is fetched at install time.

Cursor discovers each skill from `.cursor/skills/<skill-name>/SKILL.md`. The `name` in the frontmatter matches the folder. The `description` says when to use the skill. Docs: [Cursor Agent Skills](https://cursor.com/docs/skills.md).

---

## Quickstart

From a project root (Node 18+ or Bun):

```bash
# Shared skills: operating, principles, standards, security, review, architect, reviewer
npx @pratikpsl/agent-skills

# Shared skills plus a stack
npx @pratikpsl/agent-skills dotnet
npx @pratikpsl/agent-skills python
npx @pratikpsl/agent-skills react
npx @pratikpsl/agent-skills rust
```

`shared` is the same as running the command with no template. `bunx @pratikpsl/agent-skills` works the same way.

Install writes:

- `.cursor/skills/<skill-name>/SKILL.md`, including any `references/`, `scripts/`, or `assets/` next to that skill
- `.cursor/rules/agent-skills.mdc`, a short always-on rule that points agents at `.cursor/skills/`

---

## CLI

```
Usage: agent-skills [options] [template]

Arguments:
  template              Template: dotnet, python, react, rust, shared (default: shared)

Options:
  -V, --version         output the version number
  --force               Overwrite installed files (default: false)
  --path <dir>          Target project root (default: current working directory)
  -h, --help            display help for command
```

```bash
npx @pratikpsl/agent-skills react --path ../other-app
npx @pratikpsl/agent-skills python --force
```

Existing files are left in place unless you pass `--force`.

---

## What gets installed

| Template | Skills added on top of shared |
| --- | --- |
| `shared` | `operating`, `principles`, `standards`, `security`, `review`, `architect`, `reviewer` |
| `dotnet` | Replaces `architect` and adds `developer`, `dotnet-best-practices`, `dotnet-api`, `csharp-xunit`, `performance` |
| `python` | Replaces `architect` and adds `developer`, `python-best-practices`, `python-typing`, `testing`, `performance` |
| `react` | Adds `developer`, `react-typescript`, `testing`, `performance` (keeps the shared `architect`) |
| `rust` | Replaces `architect` and adds `developer`, `rust-best-practices`, `rust-ownership`, `testing`, `performance` |

Cursor loads a skill when its description matches the task. There is no skills index to maintain.

---

## Upgrading from 1.x

Version 2.0 installs Cursor workspace skills only.

- Skills go to `.cursor/skills/`, not `AgentSkills/skills/`.
- `architect`, `reviewer`, and `developer` are skills. The operating contract is the `operating` skill.
- `--agent`, `--hardlink`, agent-name arguments (`cursor`, `claude`, `codex`, and the rest), and the `default` template are removed.
- The CLI does not delete an older `AgentSkills/` tree. Remove that directory yourself after you no longer need its notes. Re-run with `--force` to refresh `.cursor/skills/`.

---

## Repository layout

```
coding-skills-ai/
├── src/
│   ├── bin/agent-skills.ts     # CLI binary entry
│   ├── cli/index.ts            # Commander program
│   └── core/
│       ├── install-template.ts # Copy skills into .cursor/skills
│       └── resolve-template.ts # Bundled template resolver
├── templates/
│   ├── shared/skills/          # Shared Cursor skills
│   ├── shared/rules/           # Thin always-on rule
│   ├── dotnet/skills/
│   ├── python/skills/
│   ├── react/skills/
│   └── rust/skills/
├── tests/
├── package.json
└── README.md
```

Each skill is `templates/<template>/skills/<skill-name>/SKILL.md`.

---

## Local development

```bash
bun install
bun run build
bun test
```

---

## Security

See [`SECURITY.md`](./SECURITY.md).

---

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE).
