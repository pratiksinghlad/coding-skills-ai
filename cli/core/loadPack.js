// cli/core/loadPack.js
// Shared helper that resolves a pack and reads its manifest in one step.
//
// Eliminates the duplicated try/catch pattern that previously appeared
// in both add.js and dotnet-setup.js. Commands that need a pack and its
// manifest should call this instead of calling resolvePack + readManifest
// separately.

import { resolvePack } from './resolvePack.js';
import { readManifest } from './manifest.js';

/**
 * @typedef {Object} LoadedPack
 * @property {string}                        packDir   Absolute path to the pack root.
 * @property {import('./manifest.js').Manifest} manifest  Validated manifest for the pack.
 */

/**
 * Resolves a pack by name and reads its manifest.
 * Throws with a user-friendly message on any failure.
 *
 * @param {string} packName  Short alias (e.g. "dotnet") or full package name.
 * @returns {Promise<LoadedPack>}
 * @throws {Error}  When the pack cannot be resolved or its manifest is invalid.
 */
export async function loadPack(packName) {
  let packDir;
  try {
    packDir = await resolvePack(packName);
  } catch (err) {
    throw new Error(`Could not resolve pack "${packName}": ${err.message}`);
  }

  let manifest;
  try {
    manifest = readManifest(packDir);
  } catch (err) {
    throw new Error(`Could not read manifest for pack "${packName}": ${err.message}`);
  }

  return { packDir, manifest };
}
