// cli/core/resolvePack.js
// Locates a templates folder bundled inside the package itself.
// Since everything is in one package, no runtime npm fetching is needed.
//
// Templates live at the repo/package root under `templates/<packName>/`.

import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Canonical package names for built-in packs.
 * @type {Record<string, string>}
 */
const PACK_ALIASES = {
  dotnet: 'dotnet',
  'skills-dotnet': 'dotnet',
  '@pratikpsl/agent-skills-dotnet': 'dotnet',
};

/**
 * Resolves a pack name or alias to its installed directory.
 *
 * @param {string} packName  Short alias (e.g. "dotnet") or full package name.
 * @returns {Promise<string>} Absolute path to the pack root.
 * @throws {Error}           When the pack cannot be located.
 */
export async function resolvePack(packName) {
  const normalized =
    PACK_ALIASES[packName] ??
    packName
      .replace(/^@pratikpsl\/agent-skills-/, '')
      .replace(/^skills-/, '');

  // templates/ lives two levels up from cli/core/ (at the package root)
  const templateDir = path.resolve(__dirname, '..', '..', 'templates', normalized);

  if (existsSync(templateDir) && existsSync(path.join(templateDir, 'manifest.json'))) {
    return templateDir;
  }

  throw new Error(
    `Pack "${packName}" (mapped to "${normalized}") is not bundled with this version of the CLI. ` +
    `Currently available packs: dotnet`
  );
}
