# @pratik/agent-skills

> Scaffold and manage AI agent skills across projects — one `npx` command, no global install.

## Quick start

```bash
# In any .NET project:
npx @pratik/agent-skills dotnet-setup
```

This creates an `AgentSkills/` folder in your project containing the full set of
skill definitions, agent personas, and memory files for .NET/C# development.

## Commands

| Command | Description |
|---------|-------------|
| `agent-skills init` | Scaffold an empty `AgentSkills/` folder |
| `agent-skills list [pack]` | List available skills in a pack |
| `agent-skills add <pack> <skill>` | Copy a single skill into this project |
| `agent-skills add <pack> --all` | Copy all skills from a pack |
| `agent-skills dotnet-setup` | Install the full .NET/C# skill set |
| `agent-skills --help` | Show help |
| `agent-skills --version` | Show version |

## Options (all commands)

| Option | Description |
|--------|-------------|
| `--force` | Overwrite existing skill files |
| `--path <dir>` | Target project root (default: cwd) |

## Examples

```bash
# List all dotnet skills
npx @pratik/agent-skills list dotnet

# Add a single skill
npx @pratik/agent-skills add dotnet core

# Add all skills, overwriting existing
npx @pratik/agent-skills dotnet-setup --force

# Scaffold into a specific directory
npx @pratik/agent-skills dotnet-setup --path ./my-project
```

## Package architecture

```
@pratik/agent-skills        ← this package (CLI + bin)
@pratik/agent-skills-dotnet ← .NET/C# skill content (separate package)
@pratik/agent-skills-react  ← React skill content (future)
```

The CLI is format-agnostic: it reads `manifest.json` from a skill pack to know what
to copy. Adding a new skill to the dotnet pack requires no CLI changes — just update
the pack's `AgentSkills/` folder and `manifest.json`.

## Local development

```bash
# From monorepo root
npm install

# Link the CLI globally for local testing
cd packages/cli && npm link

# Test in any project
agent-skills dotnet-setup

# Run tests
npm test --workspace packages/cli
```

## Publishing

```bash
npm login
cd packages/cli && npm publish
cd packages/skills-dotnet && npm publish
```

Both packages are scoped to `@pratik` and default to `restricted` (private) access.
Pass `--access public` or flip `publishConfig.access` to make them public.

## License

MIT — see [LICENSE](../../LICENSE)
