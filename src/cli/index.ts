// src/cli/index.ts
// Wires up the root `commander` program and registers all sub-commands.
// This file is the only place that imports commander; sub-commands receive
// the program instance so they stay independently testable.

import { Command } from "commander";
import { createRequire } from "module";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { addCommand } from "./commands/add.js";
import { dotnetSetupCommand } from "./commands/dotnet-setup.js";
import { setupCommand, runSetup } from "./commands/setup.js";
import { VALID_IDE_NAMES } from "../core/ide-map.js";

// Read version from our own package.json without a JSON import assertion
// (works in Node 18 without the --experimental-json-modules flag).
const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

program
  .name("agent-skills")
  .description("Scaffold and manage AI agent skills across projects")
  .version(version)
  .argument(
    "[ide]",
    `IDE entry-point to install (${VALID_IDE_NAMES}). Omit to install all.`,
  )
  .option("--force", "Overwrite existing files", false)
  .option("--no-hardlink", "Copy separate files instead of hardlinking")
  .option("--path <dir>", "Target project root (default: cwd)", process.cwd())
  .action((ide: string | undefined, options: { force: boolean; hardlink?: boolean; path: string }) => {
    runSetup(ide, {
      force: options.force,
      path: options.path,
      hardlink: options.hardlink ?? true,
    });
  });

setupCommand(program);
dotnetSetupCommand(program);
initCommand(program);
listCommand(program);
addCommand(program);

program.parseAsync(process.argv).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\n✗ ${message}`);
  process.exit(1);
});
