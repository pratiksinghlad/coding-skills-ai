# @pratikpsl/agent-skills

> Scaffold and manage AI agent skills across any project — like `shadcn/ui`, but for Cursor, Claude, Codex, Copilot, Antigravity, Windsurf, and Cline.

`@pratikpsl/agent-skills` is a single npm package: a TypeScript CLI plus bundled skill **packs** under `templates/`. No runtime network fetch — packs ship inside the package, so setup works offline after install.

---

## Quickstart

From any project root (Node 18+ or Bun):

### Default: Single-File Instructions (Cross-OS Hardlinked)

Running with **no arguments** automatically scaffolds universal single-file agent instructions across all IDEs using cross-OS hardlinks:

```bash
# Installs instructions across all IDEs with cross-OS hardlinks by default
npx @pratikpsl/agent-skills

# Or install for a specific IDE directly
npx @pratikpsl/agent-skills cursor      # → .cursor/rules/instructions.md
npx @pratikpsl/agent-skills claude      # → CLAUDE.md
npx @pratikpsl/agent-skills codex       # → AGENTS.md
npx @pratikpsl/agent-skills copilot     # → .github/copilot-instructions.md
npx @pratikpsl/agent-skills antigravity # → .agents/GEMINI.md
npx @pratikpsl/agent-skills windsurf    # → .windsurfrules
npx @pratikpsl/agent-skills cline       # → .clinerules
```

*(You can also use `bunx @pratikpsl/agent-skills` if running in Bun environments).*

### .NET / C# (Modular Skills Pack)

```bash
# Install the full .NET/C# skill set + every IDE entry-point
npx @pratikpsl/agent-skills dotnet-setup

# Or install shared skills + one IDE entry-point only
npx @pratikpsl/agent-skills dotnet-setup cursor      # → .cursor/rules/instructions.md
npx @pratikpsl/agent-skills dotnet-setup claude       # → CLAUDE.md
npx @pratikpsl/agent-skills dotnet-setup codex        # → AGENTS.md
npx @pratikpsl/agent-skills dotnet-setup copilot      # → .github/copilot-instructions.md
npx @pratikpsl/agent-skills dotnet-setup antigravity  # → .agents/GEMINI.md
```

---

## Commands

| Command | Description |
| --- | --- |
| `npx @pratikpsl/agent-skills [ide]` | **Default**: Scaffold single-file instructions with cross-OS hardlinks |
| `npx @pratikpsl/agent-skills setup [ide]` | Explicit alias for instructions setup |
| `npx @pratikpsl/agent-skills dotnet-setup [ide]` | Convenience installer for the .NET pack |
| `npx @pratikpsl/agent-skills init` | Scaffold an empty `AgentSkills/` folder and `index.json` |
| `npx @pratikpsl/agent-skills list` | List skills in known packs (`default`, `dotnet`) |
| `npx @pratikpsl/agent-skills list <pack>` | List skills in a specific pack (`default`, `dotnet`, etc.) |
| `npx @pratikpsl/agent-skills add <pack> <skill>` | Copy one skill into the project |
| `npx @pratikpsl/agent-skills add <pack> --all` | Copy all skills from a pack |
| `npx @pratikpsl/agent-skills --help` | Show CLI help |
| `npx @pratikpsl/agent-skills --version` | Show CLI version |

*(All commands work identically with `bunx`)*

### Options

- `--force` — overwrite existing skill and entry-point files
- `--hardlink` / `--no-hardlink` — control cross-OS hardlinking for shared entry points
- `--path <dir>` — target project root (default: `process.cwd()`)

---

## Packs

| Pack | Path | Notes |
| --- | --- | --- |
| `default` | `templates/default/` | Universal single-file agent instructions, cross-OS hardlinked across all IDEs |
| `dotnet` | `templates/dotnet/` | .NET/C# skills, agents, memory, IDE entry-points |

Aliases accepted by the CLI:
- Default pack: `default`, `instructions`, `single-file`, `core`, `standard`, `universal`, `base`, `@pratikpsl/agent-skills`
- .NET pack: `dotnet`, `skills-dotnet`, `@pratikpsl/agent-skills-dotnet`

The repo also contains a `Skills/` tree of additional drafts and a `plugins/` folder. Those are **not** part of the published npm tarball (see `.npmignore` and the `files` whitelist in `package.json`).

---

## Repository layout

```
coding-skills-ai/
├── src/
│   ├── bin/agent-skills.ts     # CLI binary entry
│   ├── cli/                    # commander wiring + commands
│   │   └── commands/           # init, list, add, dotnet-setup, setup
│   └── core/                   # resolve-pack, manifest, copy-skills, ide-map
├── templates/
│   ├── default/                # default instructions template
│   ├── dotnet/                 # shipped pack (AgentSkills/)
│   └── shared/                 # shared manifest
├── tests/                      # Vitest suite
├── Skills/                     # extra drafts (not published)
├── plugins/                    # local experiments (not published)
├── .github/workflows/          # CI + npm publish on version tags
├── bun.lock                    # reproducible lockfile
├── package.json
├── tsconfig.json               # emits to dist/
├── vitest.config.ts
├── SECURITY.md                 # Supply chain & vulnerability reporting policy
├── LICENSE                     # Apache-2.0
└── README.md
```

Build output: `tsc` compiles `src/` → `dist/`. The published binary is `dist/bin/agent-skills.js`. Pack templates stay at package-root `templates/` (included via `files`).

---

## Local development

```bash
bun install
bun run build
bun test

# Optional: try the CLI globally from this checkout
bun link
agent-skills --help
agent-skills list dotnet
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `bun run build` | `tsc` → `dist/` |
| `bun test` | Vitest (`tests/**/*.test.ts`) |
| `bun run test:watch` | Vitest watch mode |
| `bun run dry-run` | Build + `npm publish --dry-run` |

---

## Publish checklist (maintainers)

1. Ensure `main` is green (CI: Bun — build + test).
2. Confirm version in `package.json` (and `templates/shared/manifest.json`).
3. Verify the tarball includes templates and compiled `dist/`:
   ```bash
   bun run build
   bun pm pack --dry-run
   # Expect: dist/** and templates/** (not Skills/ or src/)
   ```
4. Publish:
   - **Trusted Publisher (preferred):** push an annotated tag matching `package.json`, e.g. `v0.8.0`. Workflow `.github/workflows/publish.yml` runs tests and `npm publish --provenance`.
   - **Manual:**
     ```bash
     npm login
     bun run build && bun test
     npm publish --access public --otp=YOUR_6_DIGIT_OTP
     ```
5. Confirm on npm: https://www.npmjs.com/package/@pratikpsl/agent-skills
6. Smoke-test: `npx @pratikpsl/agent-skills@0.8.0 --version` and `dotnet-setup` in a throwaway folder.

---

## Security

Please see [`SECURITY.md`](./SECURITY.md) for our security policy, provenance verification, and vulnerability reporting procedures.

---

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE).
