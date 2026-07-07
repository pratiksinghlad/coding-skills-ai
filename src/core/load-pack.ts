// src/core/load-pack.ts
// Shared helper that resolves a pack and reads its manifest in one step.
//
// Eliminates the duplicated try/catch pattern that previously appeared
// in both add.ts and dotnet-setup.ts. Commands that need a pack and its
// manifest should call this instead of calling resolvePack + readManifest
// separately.

import { resolvePack } from "./resolve-pack.js";
import { readManifest } from "./manifest.js";
import type { Manifest } from "./manifest.js";

export interface LoadedPack {
  /** Absolute path to the pack root. */
  packDir: string;
  /** Validated manifest for the pack. */
  manifest: Manifest;
}

/**
 * Resolves a pack by name and reads its manifest.
 * Throws with a user-friendly message on any failure.
 *
 * @throws When the pack cannot be resolved or its manifest is invalid.
 */
export function loadPack(packName: string): LoadedPack {
  let packDir: string;
  try {
    packDir = resolvePack(packName);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not resolve pack "${packName}": ${message}`);
  }

  let manifest: Manifest;
  try {
    manifest = readManifest(packDir);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Could not read manifest for pack "${packName}": ${message}`,
    );
  }

  return { packDir, manifest };
}
