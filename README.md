# agent-skills

> Scaffold and manage AI agent skills across any project — like `shadcn/ui` but for AI coding agents.

This single package `@pratikpsl/agent-skills` bundles both the CLI tool and the template definitions. This makes installation and publishing simple and ensures offline usage capability with zero network delays at runtime.

---

## Usage (Consumers)

To setup agent skills in any target project, run:

```bash
# In any .NET project root:
npx @pratikpsl/agent-skills dotnet-setup
```

### Other Commands

| Command | Description |
|---------|-------------|
| `npx @pratikpsl/agent-skills init` | Scaffold an empty `AgentSkills/` folder and `index.json` |
| `npx @pratikpsl/agent-skills list dotnet` | List available skills inside the dotnet pack |
| `npx @pratikpsl/agent-skills add dotnet <skill>` | Copy a single skill into your project |
| `npx @pratikpsl/agent-skills add dotnet --all` | Copy all skills (alternative to `dotnet-setup`) |
| `npx @pratikpsl/agent-skills --help` | Show CLI help |
| `npx @pratikpsl/agent-skills --version` | Show CLI version |

### Options
- `--force`: Overwrite existing skill and entry point files.
- `--path <dir>`: Target project root (defaults to `process.cwd()`).

---

## Repository Structure

```
agent-skills/
├── bin/
│   └── agent-skills.js             (CLI binary entrypoint)
├── src/
│   ├── index.js                    (CLI commands setup)
│   ├── commands/                   (init, list, add, dotnet-setup)
│   ├── lib/                        (copySkills, manifest parsing, resolvePack)
│   ├── templates/                  (bundled language packs)
│   │   └── dotnet/
│   │       ├── AgentSkills/        (C# best practices, agents, memory, lessons)
│   │       └── manifest.json       (declaration of files and destinations)
│   └── __tests__/                  (unit test suite)
├── package.json                    (unified package configuration)
├── LICENSE                         (MIT)
└── README.md
```

---

## Local Development

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Link CLI globally for local command line testing
npm link

# Test the linked binary inside any other project directory
agent-skills dotnet-setup
```

---

## Publishing to npm

Since this is a unified package, publishing is straightforward:

1. **Log in to npm** (if not already):
   ```bash
   npm login
   ```
2. **Publish the package**:
   ```bash
   npm publish --otp=YOUR_6_DIGIT_OTP
   ```

---

## License

MIT
