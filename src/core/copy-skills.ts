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

import { cpSync, existsSync, linkSync, mkdirSync, rmSync, statSync } from "fs";
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
  /** When true, hardlink duplicate files sharing the same source to the first written instance. */
  hardlink?: boolean;
}

/**
 * Places a single skill file or directory, using hardlinks when requested
 * and a previous instance of the source file was already written.
 */
function placeSkillFile(
  src: string,
  dest: string,
  destRelPath: string,
  targetDir: string,
  hardlink: boolean,
  primaryDestMap: Map<string, string>,
): void {
  const primaryPath = primaryDestMap.get(src);
  if (hardlink && primaryPath && existsSync(primaryPath)) {
    try {
      linkSync(primaryPath, dest);
      const relPrimary = path.relative(targetDir, primaryPath);
      console.log(`  ✓ ${destRelPath} (hardlink → ${relPrimary})`);
      return;
    } catch {
      // Fall back to copy if hard link fails (e.g. cross-device link)
    }
  }

  cpSync(src, dest, { recursive: true });
  try {
    if (statSync(src).isFile()) {
      primaryDestMap.set(src, dest);
    }
  } catch {
    // Stat error ignored
  }
  console.log(`  ✓ ${destRelPath}`);
}

/**
 * Copies or hardlinks a list of skill sources into the target project.
 */
export function copySkills(options: CopySkillsOptions): CopyResult {
  const { skills, packDir, targetDir, force, hardlink = false } = options;
  const written: string[] = [];
  const skipped: string[] = [];
  const primaryDestMap = new Map<string, string>();

  for (const skill of skills) {
    const src = path.join(packDir, skill.path);
    const destRelPath = skill.dest ?? skill.path;
    const dest = path.join(targetDir, destRelPath);

    if (!existsSync(src)) {
      console.warn(`  ⚠ Source path for skill "${skill.name}" not found: ${src}`);
      skipped.push(destRelPath);
      continue;
    }

    if (existsSync(dest) && !force) {
      console.warn(`  ⚠ Skipping "${skill.name}" — destination already exists. Use --force to overwrite.`);
      skipped.push(destRelPath);
      if (!primaryDestMap.has(src)) primaryDestMap.set(src, dest);
      continue;
    }

    mkdirSync(path.dirname(dest), { recursive: true });
    if (force && existsSync(dest)) {
      rmSync(dest, { recursive: true, force: true });
    }

    placeSkillFile(src, dest, destRelPath, targetDir, hardlink, primaryDestMap);
    written.push(destRelPath);
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
