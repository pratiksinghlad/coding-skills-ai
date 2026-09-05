import fs, { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { IDE_ENTRY_POINTS } from "./ide-map.js";

export interface InstallResult {
  written: string[];
  skipped: string[];
}

export interface InstallOptions {
  agent?: string;
  force: boolean;
  hardlink?: boolean;
  targetDir: string;
  sharedDir: string;
  templateDir: string;
}

export interface InstallDefaultOptions {
  agent?: string;
  force: boolean;
  hardlink?: boolean;
  targetDir: string;
}

interface MergeContext {
  force: boolean;
  existingBeforeInstall: Set<string>;
  projectDir: string;
  result: InstallResult;
}

interface WriteEntryContext {
  force: boolean;
  hardlink: boolean;
  existingBeforeInstall: Set<string>;
}

interface InstallEntryPointsOptions {
  agent?: string;
  force: boolean;
  hardlink?: boolean;
  targetDir: string;
}

const UTF8_ENCODING = "utf8" as const;
const AGENTS_FILENAME = "AGENTS.md" as const;
const DEFAULT_RELATIVE_PREFIX = "./" as const;
const PARENT_DIR_PREFIX = "../" as const;
const AGENT_SKILLS_DIR = "AgentSkills/" as const;
const ANTIGRAVITY_TARGET = ".agents/rules/GEMINI.md" as const;
const CURSOR_TARGET = ".cursor/rules/instructions.md" as const;

const ANTIGRAVITY_FRONTMATTER = `---
trigger: always_on
---

---

name: core-entry-point
description: >
  Load on every task. Universal guidelines, standards, and verification rules.

---

`;

const CURSOR_FRONTMATTER = `---
description: Universal agent instructions and standards
globs: *
alwaysApply: true
---

`;

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
  context: MergeContext,
): void {
  if (!existsSync(sourceDir)) return;
  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      mergeDirectory(source, target, context);
      continue;
    }

    const rel = relativePath(context.projectDir, target);
    const copied = copyFile(source, target, context.force, context.existingBeforeInstall);
    const list = copied ? context.result.written : context.result.skipped;
    if (!list.includes(rel)) {
      list.push(rel);
    }
  }
}

function selectedEntryPoints(agent?: string): string[] {
  if (agent) return [IDE_ENTRY_POINTS[agent]];
  const all = Array.from(new Set(Object.values(IDE_ENTRY_POINTS)));
  return all.sort((a, b) => (a === AGENTS_FILENAME ? -1 : b === AGENTS_FILENAME ? 1 : a.localeCompare(b)));
}

function getRelativePrefix(destination: string): string {
  const dir = path.dirname(destination).replaceAll("\\", "/");
  if (dir === "." || dir === "") return DEFAULT_RELATIVE_PREFIX;
  const depth = dir.split("/").filter(Boolean).length;
  return PARENT_DIR_PREFIX.repeat(depth);
}

function addAgentsLinkNote(content: string, prefix: string): string {
  if (content.includes(AGENTS_FILENAME)) return content;
  const agentsLink = prefix === DEFAULT_RELATIVE_PREFIX ? `./${AGENTS_FILENAME}` : `${prefix}${AGENTS_FILENAME}`;
  const note = `\n> Follow universal guidelines and standards in [${AGENTS_FILENAME}](${agentsLink}).\n`;
  const headerMatch = content.match(/^# [^\n]+/m);
  if (!headerMatch || headerMatch.index === undefined) {
    return `${note}\n${content}`;
  }
  const insertPos = headerMatch.index + headerMatch[0].length;
  return content.slice(0, insertPos) + note + content.slice(insertPos);
}

function formatEntryPoint(
  destination: string,
  content: string,
  hasAgentsMd: boolean,
): string {
  const prefix = getRelativePrefix(destination);
  let adjusted = content;

  if (prefix !== DEFAULT_RELATIVE_PREFIX) {
    adjusted = adjusted.replaceAll(AGENT_SKILLS_DIR, `${prefix}${AGENT_SKILLS_DIR}`);
  }

  if (prefix !== DEFAULT_RELATIVE_PREFIX && hasAgentsMd) {
    adjusted = addAgentsLinkNote(adjusted, prefix);
  }

  if (destination === ANTIGRAVITY_TARGET) {
    adjusted = `${ANTIGRAVITY_FRONTMATTER}${adjusted}`;
  } else if (destination === CURSOR_TARGET) {
    adjusted = `${CURSOR_FRONTMATTER}${adjusted}`;
  }

  return adjusted;
}

function tryHardlink(primaryPath: string, target: string): boolean {
  try {
    fs.linkSync(primaryPath, target);
    return true;
  } catch {
    return false;
  }
}

function writeOrLinkEntryPoint(
  target: string,
  content: string,
  primaryPath: string | undefined,
  context: WriteEntryContext,
): boolean {
  if (context.existingBeforeInstall.has(target) && !context.force) {
    return false;
  }
  if (existsSync(target)) {
    rmSync(target, { force: true, recursive: true });
  }
  mkdirSync(path.dirname(target), { recursive: true });

  const linked = context.hardlink && primaryPath && tryHardlink(primaryPath, target);
  if (!linked) {
    writeFileSync(target, content, UTF8_ENCODING);
  }
  return true;
}

function installEntryPoints(
  source: string,
  options: InstallEntryPointsOptions,
  existingBeforeInstall: Set<string>,
  result: InstallResult,
): void {
  const baseContent = readFileSync(source, UTF8_ENCODING);
  const destinations = selectedEntryPoints(options.agent);
  const agentsPath = path.join(options.targetDir, AGENTS_FILENAME);
  const willHaveAgentsMd =
    destinations.includes(AGENTS_FILENAME) ||
    existingBeforeInstall.has(agentsPath) ||
    existsSync(agentsPath);

  const writeContext: WriteEntryContext = {
    existingBeforeInstall,
    force: options.force,
    hardlink: options.hardlink ?? true,
  };

  const contentToPrimaryPath = new Map<string, string>();

  for (const destination of destinations) {
    const target = path.join(options.targetDir, destination);
    const rel = relativePath(options.targetDir, target);
    const content = formatEntryPoint(destination, baseContent, willHaveAgentsMd);
    const primaryPath = contentToPrimaryPath.get(content);

    const written = writeOrLinkEntryPoint(target, content, primaryPath, writeContext);
    const list = written ? result.written : result.skipped;
    if (!list.includes(rel)) {
      list.push(rel);
    }
    if (written && !contentToPrimaryPath.has(content)) {
      contentToPrimaryPath.set(content, target);
    }
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

  const sharedSkills = path.join(options.sharedDir, AGENT_SKILLS_DIR);
  const templateSkills = path.join(options.templateDir, AGENT_SKILLS_DIR);
  const targetSkills = path.join(options.targetDir, AGENT_SKILLS_DIR);

  mergeDirectory(sharedSkills, targetSkills, mergeCtx);
  if (path.resolve(templateSkills) !== path.resolve(sharedSkills)) {
    mergeDirectory(templateSkills, targetSkills, mergeCtx);
  }
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
