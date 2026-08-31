# @pratikpsl/agent-skills

> Scaffold and manage AI agent skills across any project — for Cursor, Claude, Codex, Copilot, Antigravity, Windsurf, and Cline.

`@pratikpsl/agent-skills` is a single npm package: a TypeScript CLI plus bundled templates under `templates/`. No runtime network fetch — templates ship inside the package, so setup works offline after install.

---

## Quickstart

From any project root (Node 18+ or Bun):

### Default: Single-File Instructions (Cross-OS Hardlinked)

Running with **no arguments** automatically scaffolds universal single-file agent instructions across all IDEs using cross-OS hardlinks:

```bash
# Installs instructions across all IDEs with cross-OS hardlinks by default
npx @pratikpsl/agent-skills

# Or install for a specific IDE / Agent directly
npx @pratikpsl/agent-skills cursor      # → .cursor/rules/instructions.md
npx @pratikpsl/agent-skills claude      # → CLAUDE.md
npx @pratikpsl/agent-skills codex       # → AGENTS.md
npx @pratikpsl/agent-skills copilot     # → .github/copilot-instructions.md
npx @pratikpsl/agent-skills antigravity # → .agents/GEMINI.md
npx @pratikpsl/agent-skills windsurf    # → .windsurfrules
npx @pratikpsl/agent-skills cline       # → .clinerules
```

### .NET / C# Template

```bash
# Install .NET agent skills + all IDE entry points
npx @pratikpsl/agent-skills dotnet

# Install .NET agent skills + specific agent entry point only
npx @pratikpsl/agent-skills dotnet --agent codex
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
  template              Template: default, dotnet, react; agent names install default guidance

Options:
  -V, --version         output the version number
  --agent <name>        Install one agent entry point: antigravity, claude, cline, codex, copilot, cursor, windsurf
  --force               Overwrite installed files (default: false)
  --no-hardlink         Copy agent entry points instead of hardlinking
  --path <dir>          Target project root (default: current working directory)
  -h, --help            display help for command
```

---

## Bundled Templates

| Template | Path | Description |
| --- | --- | --- |
| `default` | `templates/default/` | Universal single-file agent instructions, cross-OS hardlinked |
| `dotnet` | `templates/dotnet/` | .NET/C# skills, architecture & developer agents, memory |
| `react` | `templates/react/` | React & TypeScript skills, frontend testing, developer agent |
| `shared` | `templates/shared/` | Base operating contract, core skills (standards, security), review agents |

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

