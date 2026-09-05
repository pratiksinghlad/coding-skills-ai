# @pratikpsl/agent-skills

> Scaffold and manage AI agent skills across any project — for Cursor, Claude, Codex, Copilot, Antigravity, and Cline.

`@pratikpsl/agent-skills` is a single npm package: a TypeScript CLI plus bundled templates under `templates/`. No runtime network fetch — templates ship inside the package, so setup works offline after install.

---

## Quickstart

From any project root (Node 18+ or Bun):

### Shared Agent Skills (Universal Skills & Personas)

Running with an **agent name** or `shared` automatically installs shared skills (`AgentSkills/skills/review`, `AgentSkills/skills/principles`, `AgentSkills/skills/standards`, `AgentSkills/skills/security`), agent personas (`AgentSkills/agents/architect.md`, `AgentSkills/agents/reviewer.md`), and the agent's entry point:

```bash
# Install shared skills + specific IDE / Agent entry point
npx @pratikpsl/agent-skills antigravity # → .agents/rules/GEMINI.md + AgentSkills/
npx @pratikpsl/agent-skills cursor      # → .cursor/rules/instructions.md + AgentSkills/
npx @pratikpsl/agent-skills claude      # → CLAUDE.md + AgentSkills/
npx @pratikpsl/agent-skills code        # → AGENTS.md + AgentSkills/
npx @pratikpsl/agent-skills codex       # → AGENTS.md + AgentSkills/
npx @pratikpsl/agent-skills copilot     # → .github/copilot-instructions.md + AgentSkills/
npx @pratikpsl/agent-skills cline       # → .clinerules + AgentSkills/

# Install shared skills across all IDE entry points
npx @pratikpsl/agent-skills shared
```

### Compact Single-File Instructions

To scaffold compact single-file agent instructions without the `AgentSkills/` folder:

```bash
npx @pratikpsl/agent-skills default
npx @pratikpsl/agent-skills default --agent antigravity
```

### .NET / C# Template

```bash
# Install .NET agent skills + all IDE entry points
npx @pratikpsl/agent-skills dotnet

# Install .NET agent skills + specific agent entry point only
npx @pratikpsl/agent-skills dotnet --agent code
npx @pratikpsl/agent-skills dotnet --agent cursor
```

### React / TypeScript Template

```bash
# Install React agent skills + all IDE entry points
npx @pratikpsl/agent-skills react

# Install React agent skills + specific agent entry point only
npx @pratikpsl/agent-skills react --agent cursor
npx @pratikpsl/agent-skills react --agent claude
```

*(You can also use `bunx @pratikpsl/agent-skills` in Bun environments).*

---

## CLI Options

```
Usage: agent-skills [options] [template]

Arguments:
  template              Template: default, dotnet, react, shared; agent names install shared guidance

Options:
  -V, --version         output the version number
  --agent <name>        Install one agent entry point: antigravity, claude, cline, code, codex, copilot, cursor
  --force               Overwrite installed files (default: false)
  --hardlink            Hardlink matching entry points (default: true)
  --no-hardlink         Do not hardlink matching entry points
  --path <dir>          Target project root (default: current working directory)
  -h, --help            display help for command
```

---

## Bundled Templates

| Template | Path | Description |
| --- | --- | --- |
| `shared` | `templates/shared/` | Base operating contract, core skills (principles, standards, security, review), review & architecture agents (`architect.md`, `reviewer.md`) |
| `dotnet` | `templates/dotnet/` | .NET/C# skills, architecture & developer agents (`architect.md`, `developer.md`), memory |
| `react` | `templates/react/` | React & TypeScript skills, frontend testing, developer agent (`developer.md`) |
| `default` | `templates/default/` | Compact single-file agent instructions without AgentSkills folder |

---

## Repository Layout

```
coding-skills-ai/
├── src/
│   ├── bin/agent-skills.ts     # CLI binary entry
│   ├── cli/index.ts            # Commander CLI program
│   └── core/
│       ├── ide-map.ts          # IDE entry point definitions and parser
│       ├── install-template.ts # Installation & merging engine
│       └── resolve-template.ts # Bundled template resolver
├── templates/
│   ├── default/                # Single-file instructions
│   ├── dotnet/                 # .NET template
│   ├── react/                  # React template
│   └── shared/                 # Shared operating contract & memory
├── tests/                      # Vitest test suite
├── bun.lock                    # Reproducible lockfile
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── SECURITY.md
├── LICENSE                     # Apache-2.0
└── README.md
```

---

## Local Development

```bash
bun install
bun run build
bun test
```

---

## Security

Please see [`SECURITY.md`](./SECURITY.md) for our security policy and reporting procedures.

---

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE).

