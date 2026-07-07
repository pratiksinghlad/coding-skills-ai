// cli/commands/add.js
// `agent-skills add <pack> <skillName|--all>`
//
// Copies a single named skill (or all skills with --all) from a pack into the
// current project's AgentSkills/ folder.
//
// This is the generic command. `dotnet-setup` is a convenience wrapper over this.

import path from 'path';
import { loadPack } from '../core/loadPack.js';
import { copySkills, ensureAgentSkillsDir } from '../core/copySkills.js';

/** @param {import('commander').Command} program */
export function addCommand(program) {
  program
    .command('add <pack> [skillName]')
    .description('Copy a skill (or all skills with --all) from a pack into this project')
    .option('--all', 'Copy all skills from the pack', false)
    .option('--force', 'Overwrite existing files', false)
    .option('--path <dir>', 'Target project root (default: cwd)', process.cwd())
    .action(async (pack, skillName, options) => {
      if (!skillName && !options.all) {
        console.error('✗ Specify a skill name or pass --all to copy every skill.');
        process.exit(1);
      }

      const targetDir = path.resolve(options.path);

      let packDir, manifest;
      try {
        ({ packDir, manifest } = await loadPack(pack));
      } catch (err) {
        console.error(`✗ ${err.message}`);
        process.exit(1);
      }

      let skillsToCopy;
      if (options.all) {
        skillsToCopy = manifest.skills;
      } else {
        const found = manifest.skills.find((s) => s.name === skillName);
        if (!found) {
          const available = manifest.skills.map((s) => s.name).join(', ');
          console.error(`✗ Skill "${skillName}" not found in pack "${pack}".`);
          console.error(`  Available: ${available}`);
          process.exit(1);
        }
        skillsToCopy = [found];
      }

      ensureAgentSkillsDir(targetDir);
      console.log(`\nCopying from ${manifest.name}@${manifest.version} → ${targetDir}\n`);

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
    });
}

/**
 * @param {string[]} written
 * @param {string[]} skipped
 */
function printSummary(written, skipped) {
  console.log('\n' + '─'.repeat(50));
  console.log(`✔ Done — ${written.length} written, ${skipped.length} skipped.`);
  if (skipped.length > 0) {
    console.log('  (Run with --force to overwrite skipped files.)');
  }
}
