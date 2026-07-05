// src/lib/resolvePack.js
// Locates an installed skills-* package and returns its root directory.
//
// Strategy:
//   1. If the pack is already installed (via workspace or node_modules), resolve
//      it with `require.resolve('<pack>/manifest.json')` and walk up to the
//      package root.
//   2. If not found, attempt a temporary `npm install` into a local cache dir so
//      the CLI can operate without the consumer installing the pack manually.
//      This is the same pattern used by `create-react-app` and `shadcn`.
//
// The two-phase approach keeps the CLI's own install size small: only packs the
// consumer actually uses are ever fetched.

import { createRequire } from 'module';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import os from 'os';

const require = createRequire(import.meta.url);

/**
 * Canonical package names for built-in packs.
 * @type {Record<string, string>}
 */
const PACK_ALIASES = {
  dotnet: '@pratik/agent-skills-dotnet',
  'skills-dotnet': '@pratik/agent-skills-dotnet',
  '@pratik/agent-skills-dotnet': '@pratik/agent-skills-dotnet',
};

/**
 * Resolves a pack name or alias to its installed directory.
 *
 * @param {string} packName  Short alias (e.g. "dotnet") or full package name.
 * @returns {Promise<string>} Absolute path to the pack root.
 * @throws {Error}           When the pack cannot be located or installed.
 */
export async function resolvePack(packName) {
  const pkg = PACK_ALIASES[packName] ?? packName;

  // Phase 1 — try to find an already-installed copy.
  try {
    const manifestPath = require.resolve(`${pkg}/manifest.json`);
    return path.dirname(manifestPath);
  } catch {
    // Not installed yet — fall through to Phase 2.
  }

  // Phase 2 — install into a temp cache dir and resolve from there.
  console.log(`  ↳ Pack "${pkg}" not found locally, fetching via npm…`);
  const cacheDir = path.join(os.tmpdir(), 'agent-skills-cache', pkg.replace(/\//g, '__'));
  mkdirSync(cacheDir, { recursive: true });

  try {
    execSync(`npm install ${pkg} --prefix "${cacheDir}" --no-save --loglevel=error`, {
      stdio: 'inherit',
    });
  } catch {
    throw new Error(
      `Failed to install pack "${pkg}". ` +
      `If the package is private, ensure you are logged in with \`npm login\`.`
    );
  }

  try {
    const cachePkgDir = path.join(cacheDir, 'node_modules', ...pkg.split('/'));
    if (existsSync(path.join(cachePkgDir, 'manifest.json'))) {
      return cachePkgDir;
    }
    throw new Error('manifest.json not found after install');
  } catch {
    throw new Error(
      `Pack "${pkg}" was installed but its manifest.json could not be located. ` +
      `The pack may be malformed.`
    );
  }
}
