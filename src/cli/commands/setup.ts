// src/cli/commands/setup.ts
// `agent-skills [ide]` or `agent-skills setup [ide]`
//
// Scaffolds the single-file coding agent instruction template.
// Supports cross-OS hardlinking (Windows, Linux, macOS) so all
// IDE entry-points share one single file.

import path from "path";
import type { Command } from "commander";
import { loadPack } from "../../core/load-pack.js";
import { copySkills } from "../../core/copy-skills.js";
import { filterSkillsForIde, VALID_IDE_NAMES } from "../../core/ide-map.js";
import type { SkillEntry } from "../../core/manifest.js";

const DEFAULT_PACK = "default";

export interface SetupOptions {
  force?: boolean;
  path?: string;
  hardlink?: boolean;
}

export function runSetup(
  ide: string | undefined,
  options: SetupOptions = {},
): void {
  const targetDir = path.resolve(options.path ?? process.cwd());
  const force = options.force ?? false;
  const hardlink = options.hardlink ?? true;

  const targetMsg = ide ? ` [${ide}]` : " (all IDE entry points)";
  console.log(`\n🔧 Setting up agent instructions${targetMsg} in: ${targetDir}\n`);

  const { packDir, manifest } = loadPackOrExit(DEFAULT_PACK);
  let skills: SkillEntry[];

  try {
    skills = filterSkillsForIde(manifest.skills, ide);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`✗ ${message}`);
    process.exit(1);
  }

  console.log(`Setting up from ${manifest.name}@${manifest.version}`);
  if (hardlink) {
    console.log("Cross-OS hardlinking enabled — all IDE entry points share one file.\n");
  } else {
    console.log();
  }

  const { written, skipped } = copySkills({
    skills,
    packDir,
    targetDir,
    force,
    hardlink,
  });

  printSummary(written, skipped);
}

function printSummary(written: string[], skipped: string[]): void {
  console.log("\n" + "─".repeat(50));
  console.log(
    `✔ Instructions installed — ${written.length} written, ${skipped.length} skipped.`,
  );
  if (skipped.length > 0) {
    console.log("  (Run with --force to overwrite skipped files.)");
  }
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

export function setupCommand(program: Command): void {
  program
    .command("setup")
    .description(
      `Install single-file agent instructions with cross-OS hardlinks.\n  Available IDEs: ${VALID_IDE_NAMES}`,
    )
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
}

