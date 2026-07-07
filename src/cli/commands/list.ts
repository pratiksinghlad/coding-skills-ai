// src/cli/commands/list.ts
// `agent-skills list [pack]`
//
// Lists available skills in an installed or available pack.
// When no pack is specified, lists all packs the CLI knows about.

import type { Command } from "commander";
import { resolvePack } from "../../core/resolve-pack.js";
import { readManifest } from "../../core/manifest.js";

export function listCommand(program: Command): void {
  program
    .command("list [pack]")
    .description("List available skills in a pack (default: all known packs)")
    .action((pack?: string) => {
      const packsToList = pack
        ? [pack]
        : ["dotnet"]; // Extend this array as new packs are added.

      let exitCode = 0;

      for (const packName of packsToList) {
        try {
          const packDir = resolvePack(packName);
          const manifest = readManifest(packDir);

          console.log(`\n📦 ${manifest.name}@${manifest.version}`);
          console.log("─".repeat(50));

          for (const skill of manifest.skills) {
            console.log(`  • ${skill.name.padEnd(28)} ${skill.description}`);
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`\n✗ Could not list pack "${packName}": ${message}`);
          exitCode = 1;
        }
      }

      if (exitCode !== 0) process.exit(exitCode);
    });
}
