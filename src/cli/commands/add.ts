// src/cli/commands/add.ts
// `agent-skills add <pack> <skillName|--all>`
//
// Copies a single named skill (or all skills with --all) from a pack into the
// current project's AgentSkills/ folder.
//
// This is the generic command. `dotnet-setup` is a convenience wrapper over this.

import path from "path";
import type { Command } from "commander";
import { loadPack } from "../../core/load-pack.js";
import { copySkills, ensureAgentSkillsDir } from "../../core/copy-skills.js";
import type { SkillEntry } from "../../core/manifest.js";

export function addCommand(program: Command): void {
  program
    .command("add <pack> [skillName]")
    .description(
      "Copy a skill (or all skills with --all) from a pack into this project",
    )
    .option("--all", "Copy all skills from the pack", false)
    .option("--force", "Overwrite existing files", false)
    .option("--path <dir>", "Target project root (default: cwd)", process.cwd())
    .action(
      (
        pack: string,
        skillName: string | undefined,
        options: { all: boolean; force: boolean; path: string },
      ) => {
        if (!skillName && !options.all) {
          console.error(
            "✗ Specify a skill name or pass --all to copy every skill.",
          );
          process.exit(1);
        }

        const targetDir = path.resolve(options.path);

        const { packDir, manifest } = loadPackOrExit(pack);

        let skillsToCopy: SkillEntry[];
        if (options.all) {
          skillsToCopy = manifest.skills;
        } else {
          const found = manifest.skills.find((s) => s.name === skillName);
          if (!found) {
            const available = manifest.skills.map((s) => s.name).join(", ");
            console.error(
              `✗ Skill "${skillName}" not found in pack "${pack}".`,
            );
            console.error(`  Available: ${available}`);
            process.exit(1);
          }
          skillsToCopy = [found];
        }

        ensureAgentSkillsDir(targetDir);
        console.log(
          `\nCopying from ${manifest.name}@${manifest.version} → ${targetDir}\n`,
        );

        const { written, skipped } = copySkills({
          skills: skillsToCopy,
          packDir,
          targetDir,
          force: options.force,
        });

        printSummary(written, skipped);

        if (written.length === 0 && skipped.length > 0) {
          // Everything was skipped — treat as a soft warning, not a hard error.
          process.exit(0);
        }
      },
    );
}

function loadPackOrExit(pack: string): ReturnType<typeof loadPack> {
  try {
    return loadPack(pack);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`✗ ${message}`);
    process.exit(1);
  }
}

function printSummary(written: string[], skipped: string[]): void {
  console.log("\n" + "─".repeat(50));
  console.log(`✔ Done — ${written.length} written, ${skipped.length} skipped.`);
  if (skipped.length > 0) {
    console.log("  (Run with --force to overwrite skipped files.)");
  }
}
