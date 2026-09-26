import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import path from "path";

export interface InstallResult {
  written: string[];
  skipped: string[];
}

export interface InstallOptions {
  force: boolean;
  targetDir: string;
  sharedDir: string;
  templateDir: string;
}

interface MergeContext {
  force: boolean;
  existingBeforeInstall: Set<string>;
  projectDir: string;
  result: InstallResult;
}

const SKILLS_DIR = "skills";
const CURSOR_SKILLS_DIR = path.join(".cursor", "skills");
const CURSOR_RULE_REL = path.join(".cursor", "rules", "agent-skills.mdc");
const RULE_SOURCE_REL = path.join("rules", "agent-skills.mdc");

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

function record(context: MergeContext, destination: string, copied: boolean): void {
  const rel = relativePath(context.projectDir, destination);
  const list = copied ? context.result.written : context.result.skipped;
  if (!list.includes(rel)) {
    list.push(rel);
  }
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

function mergeDirectory(sourceDir: string, targetDir: string, context: MergeContext): void {
  if (!existsSync(sourceDir)) return;
  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      mergeDirectory(source, target, context);
      continue;
    }

    const copied = copyFile(source, target, context.force, context.existingBeforeInstall);
    record(context, target, copied);
  }
}

export function installTemplate(options: InstallOptions): InstallResult {
  const result: InstallResult = { written: [], skipped: [] };
  const existing = collectExistingFiles(options.targetDir);
  const mergeCtx: MergeContext = {
    existingBeforeInstall: existing,
    force: options.force,
    projectDir: options.targetDir,
    result,
  };

  const targetSkills = path.join(options.targetDir, CURSOR_SKILLS_DIR);
  const sharedSkills = path.join(options.sharedDir, SKILLS_DIR);
  mergeDirectory(sharedSkills, targetSkills, mergeCtx);

  const templateSkills = path.join(options.templateDir, SKILLS_DIR);
  if (path.resolve(templateSkills) !== path.resolve(sharedSkills)) {
    mergeDirectory(templateSkills, targetSkills, mergeCtx);
  }

  const ruleSource = path.join(options.sharedDir, RULE_SOURCE_REL);
  if (existsSync(ruleSource)) {
    const ruleTarget = path.join(options.targetDir, CURSOR_RULE_REL);
    const copied = copyFile(ruleSource, ruleTarget, options.force, existing);
    record(mergeCtx, ruleTarget, copied);
  }

  return result;
}
