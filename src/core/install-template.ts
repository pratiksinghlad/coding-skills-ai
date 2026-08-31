import { copyFileSync, existsSync, linkSync, mkdirSync, readdirSync, rmSync } from "fs";
import path from "path";
import { IDE_ENTRY_POINTS } from "./ide-map.js";

export interface InstallResult {
  written: string[];
  skipped: string[];
}

export interface InstallOptions {
  agent?: string;
  force: boolean;
  hardlink: boolean;
  targetDir: string;
  sharedDir: string;
  templateDir: string;
}

export interface InstallDefaultOptions {
  agent?: string;
  force: boolean;
  hardlink: boolean;
  targetDir: string;
}

function relativePath(targetDir: string, filePath: string): string {
  return path.relative(targetDir, filePath).replaceAll("\\", "/");
}

function collectExistingFiles(dir: string): Set<string> {
  const files = new Set<string>();
  if (!existsSync(dir)) return files;

  function walk(current: string): void {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        files.add(full);
      }
    }
  }

  walk(dir);
  return files;
}

function copyFile(
  source: string,
  destination: string,
  force: boolean,
  existingBeforeInstall: Set<string>,
): boolean {
  if (existingBeforeInstall.has(destination) && !force) {
    return false;
  }
  if (existsSync(destination)) {
    rmSync(destination, { force: true, recursive: true });
  }
  mkdirSync(path.dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  return true;
}

function mergeDirectory(
  sourceDir: string,
  targetDir: string,
  projectDir: string,
  force: boolean,
  existingBeforeInstall: Set<string>,
  result: InstallResult,
): void {
  if (!existsSync(sourceDir)) return;
  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      mergeDirectory(source, target, projectDir, force, existingBeforeInstall, result);
    } else {
      const rel = relativePath(projectDir, target);
      if (copyFile(source, target, force, existingBeforeInstall)) {
        if (!result.written.includes(rel)) {
          result.written.push(rel);
        }
      } else {
        if (!result.skipped.includes(rel)) {
          result.skipped.push(rel);
        }
      }
    }
  }
}

function selectedEntryPoints(agent?: string): string[] {
  return agent ? [IDE_ENTRY_POINTS[agent]] : Object.values(IDE_ENTRY_POINTS);
}

function linkOrCopy(
  source: string,
  target: string,
  primary: string | undefined,
  options: { force: boolean; hardlink: boolean },
  existingBeforeInstall: Set<string>,
): boolean {
  if (existingBeforeInstall.has(target) && !options.force) {
    return false;
  }
  if (existsSync(target)) {
    rmSync(target, { force: true, recursive: true });
  }
  mkdirSync(path.dirname(target), { recursive: true });

  if (options.hardlink && primary) {
    try {
      linkSync(primary, target);
      return true;
    } catch {
      // Non-hardlink-compatible filesystems use copy fallback
    }
  }

  copyFileSync(source, target);
  return true;
}

function installEntryPoints(
  source: string,
  options: { agent?: string; force: boolean; hardlink: boolean; targetDir: string },
  existingBeforeInstall: Set<string>,
  result: InstallResult,
): void {
  let primary: string | undefined;

  for (const destination of selectedEntryPoints(options.agent)) {
    const target = path.join(options.targetDir, destination);
    const rel = relativePath(options.targetDir, target);
    if (linkOrCopy(source, target, primary, options, existingBeforeInstall)) {
      primary ??= target;
      if (!result.written.includes(rel)) {
        result.written.push(rel);
      }
    } else {
      if (!result.skipped.includes(rel)) {
        result.skipped.push(rel);
      }
    }
  }
}

export function installTemplate(options: InstallOptions): InstallResult {
  const result: InstallResult = { written: [], skipped: [] };
  const existing = collectExistingFiles(options.targetDir);
  const sharedSkills = path.join(options.sharedDir, "AgentSkills");
  const templateSkills = path.join(options.templateDir, "AgentSkills");
  const targetSkills = path.join(options.targetDir, "AgentSkills");

  mergeDirectory(sharedSkills, targetSkills, options.targetDir, options.force, existing, result);
  mergeDirectory(templateSkills, targetSkills, options.targetDir, options.force, existing, result);
  installEntryPoints(
    path.join(options.sharedDir, "entry-points", "instructions.md"),
    options,
    existing,
    result,
  );

  return result;
}

export function installDefaultTemplate(
  sourceDir: string,
  options: InstallDefaultOptions,
): InstallResult {
  const result: InstallResult = { written: [], skipped: [] };
  const existing = collectExistingFiles(options.targetDir);
  installEntryPoints(
    path.join(sourceDir, "instructions.md"),
    options,
    existing,
    result,
  );
  return result;
}

