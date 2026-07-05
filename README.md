# agent-skills

> Publish and scaffold AI agent skills across any project — like `shadcn/ui` but for
> AI coding agents.

## What this is

A monorepo containing:

| Package | Description |
|---------|-------------|
| [`@pratik/agent-skills`](packages/cli) | CLI with `bin` entrypoint — the `npx` target |
| [`@pratik/agent-skills-dotnet`](packages/skills-dotnet) | Skill content for .NET/C# projects |

## Usage (consumers)

```bash
# In any .NET project:
npx @pratik/agent-skills dotnet-setup

# List available skills
npx @pratik/agent-skills list dotnet

# Add a single skill
npx @pratik/agent-skills add dotnet core
```

## Repository structure

```
agent-skills/
├── packages/
│   ├── cli/                     → @pratik/agent-skills (bin + commands)
│   └── skills-dotnet/           → @pratik/agent-skills-dotnet (skill files)
├── package.json                 (npm workspaces root)
├── .github/workflows/publish.yml
└── README.md
```

## Design rationale

- **Core CLI + language packs split**: The CLI owns all command logic. Language packs
  are thin, content-only packages. A React project never downloads .NET skill files.
- **Independent versioning**: Bump the pack on content changes, bump the CLI only on
  behavioral changes.
- **Format-agnostic CLI**: The CLI reads `manifest.json` to know what to copy — it
  never parses `SKILL.md` contents. Adding a new skill = adding a folder + updating
  `manifest.json`, no CLI release needed.

## Local development

```bash
# Install all workspace deps
npm install

# Run all tests
npm test

# Link CLI for local testing
cd packages/cli && npm link

# Test in any project
agent-skills dotnet-setup
```

## Publishing

See [packages/cli/README.md](packages/cli/README.md) for full publishing steps.

Push a `v*` tag to trigger the GitHub Actions publish workflow.

## License

MIT
