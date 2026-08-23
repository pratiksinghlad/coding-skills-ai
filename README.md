# @pratikpsl/agent-skills

> Scaffold and manage AI agent skills across any project — like `shadcn/ui`, but for Cursor, Claude, Codex, Copilot, and Antigravity.

`@pratikpsl/agent-skills` is a single npm package: a TypeScript CLI plus bundled skill **packs** under `templates/`. No runtime network fetch — packs ship inside the package, so setup works offline after install.

Currently published on npm as **0.5.0**; this branch prepares **0.6.0**.

---

## Quickstart

From any project root (Node 18+):

```bash
# Install the full .NET/C# skill set + every IDE entry-point
npx @pratikpsl/agent-skills@0.6.0 dotnet-setup

# Or install shared skills + one IDE entry-point only
npx @pratikpsl/agent-skills@0.6.0 dotnet-setup cursor      # → .cursor/rules/instructions.md
npx @pratikpsl/agent-skills@0.6.0 dotnet-setup claude       # → CLAUDE.md
npx @pratikpsl/agent-skills@0.6.0 dotnet-setup codex        # → AGENTS.md
npx @pratikpsl/agent-skills@0.6.0 dotnet-setup copilot      # → .github/copilot-instructions.md
npx @pratikpsl/agent-skills@0.6.0 dotnet-setup antigravity  # → .agents/GEMINI.md
```

Until 0.6.0 is published, use `@0.5.0` or the git branch for local testing.

---

## Commands

| Command | Description |
| --- | --- |
| `npx @pratikpsl/agent-skills init` | Scaffold an empty `AgentSkills/` folder and `index.json` |
| `npx @pratikpsl/agent-skills list` | List skills in known packs (default: `dotnet`) |
| `npx @pratikpsl/agent-skills list dotnet` | List skills in the `dotnet` pack |
| `npx @pratikpsl/agent-skills add dotnet <skill>` | Copy one skill into the project |
| `npx @pratikpsl/agent-skills add dotnet --all` | Copy all skills (same pack content as `dotnet-setup`) |
| `npx @pratikpsl/agent-skills dotnet-setup [ide]` | Convenience installer for the .NET pack |
| `npx @pratikpsl/agent-skills --help` | Show CLI help |
| `npx @pratikpsl/agent-skills --version` | Show CLI version |

### Options

- `--force` — overwrite existing skill and entry-point files
- `--path <dir>` — target project root (default: `process.cwd()`)

---

## Packs

| Pack | Path | Notes |
| --- | --- | --- |
| `dotnet` | `templates/dotnet/` | .NET/C# skills, agents, memory, IDE entry-points |

Aliases accepted by the CLI: `dotnet`, `skills-dotnet`, `@pratikpsl/agent-skills-dotnet`.

The repo also contains a `Skills/` tree of additional drafts and a `plugins/` folder. Those are **not** part of the published npm tarball (see `.npmignore` and the `files` whitelist in `package.json`).

---

## Repository layout

```
coding-skills-ai/
├── src/
│   ├── bin/agent-skills.ts     # CLI binary entry
│   ├── cli/                    # commander wiring + commands
│   │   └── commands/           # init, list, add, dotnet-setup
│   └── core/                   # resolve-pack, manifest, copy-skills
├── templates/
│   └── dotnet/                 # shipped pack (manifest.json + AgentSkills/)
├── tests/                      # Vitest suite
├── Skills/                     # extra drafts (not published)
├── plugins/                    # local experiments (not published)
├── .github/workflows/          # CI + npm publish on version tags
├── package.json
├── tsconfig.json               # emits to dist/
├── vitest.config.ts
├── LICENSE                     # Apache-2.0
└── README.md
```

Build output: `tsc` compiles `src/` → `dist/`. The published binary is `dist/bin/agent-skills.js`. Pack templates stay at package-root `templates/` (included via `files`).

---

## Local development

```bash
npm ci
npm run build
npm test

# Optional: try the CLI globally from this checkout
npm link
agent-skills --help
agent-skills list dotnet
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | `tsc` → `dist/` |
| `npm test` | Vitest (`tests/**/*.test.ts`) |
| `npm run test:watch` | Vitest watch mode |
| `npm run dry-run` | Build + `npm publish --dry-run` |

---

## Publish checklist (maintainers)

1. Ensure `main` is green (CI: Node 18/20/22 — build + test).
2. Confirm version in `package.json` (and pack `templates/dotnet/manifest.json` if skill content changed).
3. Verify the tarball includes templates:
   ```bash
   npm run build
   npm pack --dry-run
   # Expect: dist/** and templates/dotnet/** (not Skills/ or src/)
   ```
4. Publish:
   - **Trusted Publisher (preferred):** push an annotated tag matching `package.json`, e.g. `v0.6.0`. Workflow `.github/workflows/publish.yml` runs tests and `npm publish --provenance`.
   - **Manual:**
     ```bash
     npm login
     npm run build && npm test
     npm publish --access public --otp=YOUR_6_DIGIT_OTP
     ```
5. Confirm on npm: https://www.npmjs.com/package/@pratikpsl/agent-skills
6. Smoke-test: `npx @pratikpsl/agent-skills@0.6.0 --version` and `dotnet-setup` in a throwaway folder.

---

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE).
