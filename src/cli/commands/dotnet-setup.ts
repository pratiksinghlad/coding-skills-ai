// src/cli/commands/dotnet-setup.ts
// `agent-skills dotnet-setup [ide]`
//
// Convenience command equivalent to:
//   agent-skills add @pratikpsl/agent-skills-dotnet --all
//
// When an optional [ide] positional argument is supplied (cursor | claude |
// codex | copilot | antigravity), only that IDE's entry-point file is written
// together with all shared AgentSkills files. All other entry-point files are
// skipped.
//
// Without [ide], all skills including every entry-point are copied (original
// behaviour — no breaking change).

import path from "path";
import type { Command } from "commander";
import { loadPack } from "../../core/load-pack.js";
import { copySkills, ensureAgentSkillsDir } from "../../core/copy-skills.js";
import { filterSkillsForIde, VALID_IDE_NAMES } from "../../core/ide-map.js";
import type { SkillEntry } from "../../core/manifest.js";

const DOTNET_PACK = "dotnet";

export { filterSkillsForIde };

export function dotnetSetupCommand(program: Command): void {
  program
    .command("dotnet-setup")
    .description(
      `Install the full .NET/C# agent skill set (shortcut for: add ${DOTNET_PACK} --all).\n` +
        `  Optionally pass an IDE name to install only that IDE's entry-point:\n` +
        `  ${VALID_IDE_NAMES}`,
    )
    .argument(
      "[ide]",
      `IDE entry-point to install (${VALID_IDE_NAMES}). Omit to install all.`,
    )
    .option("--force", "Overwrite existing files", false)
    .option("--hardlink", "Hardlink shared files where possible", false)
    .option("--path <dir>", "Target project root (default: cwd)", process.cwd())
    .action((ide: string | undefined, options: { force: boolean; hardlink: boolean; path: string }) => {
      const targetDir = path.resolve(options.path);

      if (ide !== undefined) {
        console.log(
          `\n🔧 Setting up .NET agent skills [${ide}] in: ${targetDir}\n`,
        );
      } else {
        console.log(`\n🔧 Setting up .NET agent skills in: ${targetDir}\n`);
      }

      const { packDir, manifest } = loadPackOrExit(DOTNET_PACK);

      let skills: SkillEntry[];
      if (ide !== undefined) {
        try {
          skills = filterSkillsForIde(manifest.skills, ide);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`✗ ${message}`);
          process.exit(1);
        }
      } else {
        skills = manifest.skills;
      }

      ensureAgentSkillsDir(targetDir);
      console.log(`Copying from ${manifest.name}@${manifest.version}\n`);

      const { written, skipped } = copySkills({
        skills,
        packDir,
        targetDir,
        force: options.force,
        hardlink: options.hardlink,
      });

      console.log("\n" + "─".repeat(50));
      console.log(
        `✔ .NET skills installed — ${written.length} written, ${skipped.length} skipped.`,
      );

      if (skipped.length > 0) {
        console.log("  (Run with --force to overwrite skipped files.)");
      }

      if (written.length === 0 && skipped.length === 0) {
        console.error(
          "\n✗ No skills were copied. Check that the pack contains skill entries.",
        );
        process.exit(1);
      }
    });
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
