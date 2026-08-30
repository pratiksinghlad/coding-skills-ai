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
| `src/` | TypeScript CLI + core (`bin/`, `cli/`, `core/`) |
| `templates/` | Bundled skill packs shipped on npm (e.g. `dotnet/`) |
| `tests/` | Vitest suite |
| `Skills/` | Extra skill drafts — **not** published |
| `plugins/` | Local plugin experiments — **not** published |

## Workflow

1. Create a branch from `main`.
2. Make focused changes (docs, CLI, templates, or tests).
3. Run `bun run build && bun test`.
4. Open a PR against `main` with a short summary and test plan.

## Packs

Pack templates live under `templates/<pack>/` with a `manifest.json`. Keep manifest paths in sync with files on disk. Bump the pack `version` in the manifest when shipping skill content changes.

## Code style

- TypeScript, ESM (`"type": "module"`).
- Prefer small, testable helpers in `src/core/`.
- Do not commit `dist/`, `node_modules/`, or `.tgz` artifacts.

## License

By contributing, you agree that your contributions are licensed under the Apache License 2.0 (see `LICENSE`).
