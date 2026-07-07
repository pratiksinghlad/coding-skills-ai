// cli/commands/dotnet-setup.js
// `agent-skills dotnet-setup`
//
// Convenience command equivalent to:
//   agent-skills add @pratikpsl/agent-skills-dotnet --all
//
// Rationale: gives first-time users a single, memorable command for the .NET
// stack without requiring them to know the full pack name.

import path from 'path';
import { loadPack } from '../core/loadPack.js';
import { copySkills, ensureAgentSkillsDir } from '../core/copySkills.js';

const DOTNET_PACK = '@pratikpsl/agent-skills-dotnet';

/** @param {import('commander').Command} program */
export function dotnetSetupCommand(program) {
  program
    .command('dotnet-setup')
    .description(`Install the full .NET/C# agent skill set (shortcut for: add ${DOTNET_PACK} --all)`)
    .option('--force', 'Overwrite existing files', false)
    .option('--path <dir>', 'Target project root (default: cwd)', process.cwd())
    .action(async (options) => {
      const targetDir = path.resolve(options.path);

      console.log(`\n🔧 Setting up .NET agent skills in: ${targetDir}\n`);

      let packDir, manifest;
      try {
        ({ packDir, manifest } = await loadPack(DOTNET_PACK));
      } catch (err) {
        console.error(`✗ ${err.message}`);
        process.exit(1);
      }

      ensureAgentSkillsDir(targetDir);
      console.log(`Copying from ${manifest.name}@${manifest.version}\n`);

      const { written, skipped } = copySkills({
        skills: manifest.skills,
        packDir,
        targetDir,
        force: options.force,
      });

      console.log('\n' + '─'.repeat(50));
      console.log(`✔ .NET skills installed — ${written.length} written, ${skipped.length} skipped.`);

      if (skipped.length > 0) {
        console.log('  (Run with --force to overwrite skipped files.)');
      }

      if (written.length === 0 && skipped.length === 0) {
        console.error('\n✗ No skills were copied. Check that the pack contains skill entries.');
        process.exit(1);
      }
    });
}
