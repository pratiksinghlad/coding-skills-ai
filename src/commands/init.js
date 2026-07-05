// src/commands/init.js
// `agent-skills init`
//
// Scaffolds an empty AgentSkills/ folder + index.json in the current project
// if one doesn't exist yet. Safe to run multiple times (idempotent).

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

/** @param {import('commander').Command} program */
export function initCommand(program) {
  program
    .command('init')
    .description('Scaffold an empty AgentSkills/ folder in the current project')
    .option('--path <dir>', 'Target project root (default: cwd)', process.cwd())
    .option('--force', 'Overwrite existing files', false)
    .action(async (options) => {
      const targetDir = path.resolve(options.path);
      const agentSkillsDir = path.join(targetDir, 'AgentSkills');

      if (existsSync(agentSkillsDir) && !options.force) {
        console.log(`AgentSkills/ already exists at ${agentSkillsDir}`);
        console.log('Use --force to reinitialize.');
        process.exit(0);
      }

      mkdirSync(agentSkillsDir, { recursive: true });
      console.log(`✓ Created ${agentSkillsDir}`);

      const indexPath = path.join(agentSkillsDir, 'index.json');
      if (!existsSync(indexPath) || options.force) {
        const indexContent = {
          skills: [],
          _comment: 'Add skills via `agent-skills add <pack> <skillName>` or `agent-skills dotnet-setup`',
        };
        writeFileSync(indexPath, JSON.stringify(indexContent, null, 2) + '\n', 'utf8');
        console.log(`✓ Created ${indexPath}`);
      }

      console.log('\n✔ AgentSkills initialized. Run `agent-skills dotnet-setup` to add .NET skills.');
    });
}
