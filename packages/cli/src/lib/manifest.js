// src/lib/manifest.js
// Reads and validates a pack's manifest.json.
//
// The manifest is the contract between a skills pack and the CLI.
// It declares what skills exist, where their source files are, and where
// they should be placed in the target project.
//
// Expected shape:
//   {
//     "name": "@pratik/agent-skills-dotnet",
//     "version": "0.1.0",
//     "skills": [
//       {
//         "name": "core",
//         "description": "...",
//         "path": "AgentSkills/skills/core"   // relative to pack root
//       }
//     ]
//   }

import { readFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * @typedef {Object} SkillEntry
 * @property {string}  name         Short identifier used as a CLI argument.
 * @property {string}  description  Human-readable purpose of the skill.
 * @property {string}  path         Source path of the skill, relative to the pack root.
 * @property {string} [dest]        Destination path in the target project, relative to the
 *                                  project root. When absent, `path` is used as the destination.
 *                                  Use this for IDE entry-point files that must land outside
 *                                  AgentSkills/ (e.g. CLAUDE.md, .github/copilot-instructions.md).
 */

/**
 * @typedef {Object} Manifest
 * @property {string}       name     Package name.
 * @property {string}       version  Semver string.
 * @property {SkillEntry[]} skills   All skills provided by this pack.
 */

/**
 * Reads and validates the manifest.json for a pack.
 *
 * @param {string} packDir  Absolute path to the pack root.
 * @returns {Manifest}
 * @throws {Error}  When manifest is missing, unreadable, or structurally invalid.
 */
export function readManifest(packDir) {
  const manifestPath = path.join(packDir, 'manifest.json');

  if (!existsSync(manifestPath)) {
    throw new Error(
      `manifest.json not found in pack at "${packDir}". ` +
      `This pack may be malformed or out of date.`
    );
  }

  let raw;
  try {
    raw = readFileSync(manifestPath, 'utf8');
  } catch (err) {
    throw new Error(`Could not read manifest.json: ${err.message}`);
  }

  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch {
    throw new Error(`manifest.json at "${manifestPath}" is not valid JSON.`);
  }

  validateManifest(manifest, manifestPath);
  return manifest;
}

/**
 * Throws with a descriptive message if the manifest does not meet the required shape.
 *
 * @param {unknown} manifest
 * @param {string}  filePath  Used only in error messages.
 */
function validateManifest(manifest, filePath) {
  if (typeof manifest !== 'object' || manifest === null) {
    throw new Error(`manifest.json at "${filePath}" must be a JSON object.`);
  }

  const required = ['name', 'version', 'skills'];
  for (const key of required) {
    if (!(key in manifest)) {
      throw new Error(`manifest.json is missing required field "${key}".`);
    }
  }

  if (!Array.isArray(manifest.skills)) {
    throw new Error(`manifest.json "skills" must be an array.`);
  }

  for (const [i, skill] of manifest.skills.entries()) {
    for (const field of ['name', 'description', 'path']) {
      if (typeof skill[field] !== 'string' || !skill[field].trim()) {
        throw new Error(
          `manifest.json skills[${i}] is missing or has an empty "${field}" field.`
        );
      }
    }
    // dest is optional; when present it must be a non-empty string.
    if ('dest' in skill && (typeof skill.dest !== 'string' || !skill.dest.trim())) {
      throw new Error(
        `manifest.json skills[${i}] has an invalid "dest" field — must be a non-empty string when present.`
      );
    }
  }
}
