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

// Read version from our own package.json without a JSON import assertion
// (works in Node 18 without the --experimental-json-modules flag).
const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command();

program
  .name("agent-skills")
  .description("Scaffold and manage AI agent skills across projects")
  .version(version);

initCommand(program);
listCommand(program);
addCommand(program);
dotnetSetupCommand(program);

program.parseAsync(process.argv).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\n✗ ${message}`);
  process.exit(1);
});
