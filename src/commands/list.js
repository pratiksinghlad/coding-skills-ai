// src/commands/list.js
// `agent-skills list [pack]`
//
// Lists available skills in an installed or available pack.
// When no pack is specified, lists all packs the CLI knows about.

import { resolvePack } from '../lib/resolvePack.js';
import { readManifest } from '../lib/manifest.js';

/** @param {import('commander').Command} program */
export function listCommand(program) {
  program
    .command('list [pack]')
    .description('List available skills in a pack (default: all known packs)')
    .action(async (pack) => {
      const packsToList = pack
        ? [pack]
        : ['dotnet']; // Extend this array as new packs are added.

      let exitCode = 0;

      for (const packName of packsToList) {
        try {
          const packDir = await resolvePack(packName);
          const manifest = readManifest(packDir);

          console.log(`\n📦 ${manifest.name}@${manifest.version}`);
          console.log('─'.repeat(50));

          for (const skill of manifest.skills) {
            console.log(`  • ${skill.name.padEnd(28)} ${skill.description}`);
          }
        } catch (err) {
          console.error(`\n✗ Could not list pack "${packName}": ${err.message}`);
          exitCode = 1;
        }
      }

      if (exitCode !== 0) process.exit(exitCode);
    });
}
