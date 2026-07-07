// src/core/manifest.ts
// Reads and validates a pack's manifest.json.
//
// The manifest is the contract between a skills pack and the CLI.
// It declares what skills exist, where their source files are, and where
// they should be placed in the target project.

import { readFileSync, existsSync } from "fs";
import path from "path";

export interface SkillEntry {
  /** Short identifier used as a CLI argument. */
  name: string;
  /** Human-readable purpose of the skill. */
  description: string;
  /** Source path of the skill, relative to the pack root. */
  path: string;
  /**
   * Destination path in the target project, relative to the project root.
   * When absent, `path` is used as the destination.
   * Use this for IDE entry-point files that must land outside AgentSkills/.
   */
  dest?: string;
}

export interface Manifest {
  /** Package name. */
  name: string;
  /** Semver string. */
  version: string;
  /** All skills provided by this pack. */
  skills: SkillEntry[];
}

/**
 * Reads and validates the manifest.json for a pack.
 *
 * @throws When manifest is missing, unreadable, or structurally invalid.
 */
export function readManifest(packDir: string): Manifest {
  const manifestPath = path.join(packDir, "manifest.json");

  if (!existsSync(manifestPath)) {
    throw new Error(
      `manifest.json not found in pack at "${packDir}". ` +
        `This pack may be malformed or out of date.`,
    );
  }

  let raw: string;
  try {
    raw = readFileSync(manifestPath, "utf8");
    // Strip UTF-8 BOM if present.
    if (raw.charCodeAt(0) === 0xfeff) {
      raw = raw.slice(1);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not read manifest.json: ${message}`);
  }

  let manifest: unknown;
  try {
    manifest = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `manifest.json at "${manifestPath}" is not valid JSON: ${message}`,
    );
  }

  validateManifest(manifest, manifestPath);
  return manifest as Manifest;
}

/**
 * Throws with a descriptive message if the manifest does not meet the
 * required shape.
 */
function validateManifest(manifest: unknown, filePath: string): void {
  if (typeof manifest !== "object" || manifest === null) {
    throw new Error(`manifest.json at "${filePath}" must be a JSON object.`);
  }

  const obj = manifest as Record<string, unknown>;

  const required = ["name", "version", "skills"] as const;
  for (const key of required) {
    if (!(key in obj)) {
      throw new Error(`manifest.json is missing required field "${key}".`);
    }
  }

  if (!Array.isArray(obj.skills)) {
    throw new Error(`manifest.json "skills" must be an array.`);
  }

  for (const [i, skill] of (obj.skills as unknown[]).entries()) {
    const entry = skill as Record<string, unknown>;
    for (const field of ["name", "description", "path"] as const) {
      if (typeof entry[field] !== "string" || !(entry[field] as string).trim()) {
        throw new Error(
          `manifest.json skills[${i}] is missing or has an empty "${field}" field.`,
        );
      }
    }
    // dest is optional; when present it must be a non-empty string.
    if (
      "dest" in entry &&
      (typeof entry.dest !== "string" || !entry.dest.trim())
    ) {
      throw new Error(
        `manifest.json skills[${i}] has an invalid "dest" field — must be a non-empty string when present.`,
      );
    }
  }
}
