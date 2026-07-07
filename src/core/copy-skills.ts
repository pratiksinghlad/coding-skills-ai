// src/core/copy-skills.ts
// Copies skill files from a pack into the target project's AgentSkills/ folder.
//
// Rules enforced here:
//   - Never overwrite an existing file without --force; warn and skip instead.
//   - Directories are created recursively as needed.
//   - Returns a summary object for the caller to print: { written, skipped }.
//
// This module contains no pack-specific logic. The manifest tells it what
// to copy; it does not inspect SKILL.md contents.

import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import path from "path";
import type { SkillEntry } from "./manifest.js";

export interface CopyResult {
  /** Files that were successfully written. */
  written: string[];
  /** Files that were skipped because they already exist. */
  skipped: string[];
}

export interface CopySkillsOptions {
  /** Skills to copy, filtered from the manifest (all or a single skill). */
  skills: SkillEntry[];
  /** Absolute path to the pack root. */
  packDir: string;
  /** Absolute path to the target project root. */
  targetDir: string;
  /** When true, overwrite existing files. */
  force: boolean;
}

/**
 * Copies a list of skill source directories into the target project.
 */
export function copySkills(options: CopySkillsOptions): CopyResult {
  const { skills, packDir, targetDir, force } = options;
  const written: string[] = [];
  const skipped: string[] = [];

  for (const skill of skills) {
    const src = path.join(packDir, skill.path);
    // dest overrides where the file lands in the target project.
    // Used for IDE entry-points (e.g. CLAUDE.md, .github/copilot-instructions.md)
    // that must live outside AgentSkills/ at a specific root-relative path.
    const destRelPath = skill.dest ?? skill.path;
    const dest = path.join(targetDir, destRelPath);

    if (!existsSync(src)) {
      console.warn(
        `  ⚠ Source path for skill "${skill.name}" not found: ${src}`,
      );
      skipped.push(destRelPath);
      continue;
    }

    if (existsSync(dest) && !force) {
      console.warn(
        `  ⚠ Skipping "${skill.name}" — destination already exists. Use --force to overwrite.`,
      );
      skipped.push(destRelPath);
      continue;
    }

    mkdirSync(path.dirname(dest), { recursive: true });
    // Remove the destination first when forcing — cpSync throws "src and dest
    // cannot be the same" on Windows if the dest directory already exists,
    // even with force:true.
    if (force && existsSync(dest)) {
      rmSync(dest, { recursive: true, force: true });
    }
    cpSync(src, dest, { recursive: true });
    written.push(destRelPath);
    console.log(`  ✓ ${destRelPath}`);
  }

  return { written, skipped };
}

/**
 * Ensures the AgentSkills root directory exists in the target project.
 *
 * @returns Absolute path to AgentSkills/.
 */
export function ensureAgentSkillsDir(targetDir: string): string {
  const dir = path.join(targetDir, "AgentSkills");
  mkdirSync(dir, { recursive: true });
  return dir;
}
