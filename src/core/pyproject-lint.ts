import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { LintChange, LintResult } from "./lint-config.js";

const PYPROJECT_FILE = "pyproject.toml";
const PARSE_REASON = "could not parse pyproject.toml safely";
const RUFF_TABLE = "tool.ruff";
const LINT_TABLE = "tool.ruff.lint";
const FORMAT_TABLE = "tool.ruff.format";
const REQUIRED_SELECT = ["E", "F", "I", "UP", "N", "ANN"];

const NEW_PYPROJECT = `[tool.ruff]
target-version = "py311"
line-length = 88

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "N", "ANN"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
`;

interface TomlSection {
  header: string;
  lines: string[];
}

export function applyPyprojectLint(targetDir: string, force: boolean): LintResult {
  const filePath = path.join(targetDir, PYPROJECT_FILE);
  if (!existsSync(filePath)) return writeNewPyproject(filePath);

  const source = readFileSync(filePath, "utf8");
  if (source.includes('"""') || source.includes("'''")) return skipped(PARSE_REASON);

  const sections = splitToml(source);
  const map = sectionMap(sections);
  if (!map) return skipped(PARSE_REASON);

  const changes: LintChange[] = [];
  const edited =
    ensureRuff(sections, map, changes) &&
    ensureSelect(sections, map, changes) &&
    ensureFormat(sections, map, changes, force);
  if (!edited) return skipped(PARSE_REASON);
  if (!hasEdits(changes)) return { changes, file: PYPROJECT_FILE, status: "unchanged" };

  writeFileSync(filePath, serialize(sections), "utf8");
  return { changes, file: PYPROJECT_FILE, status: "written" };
}

function writeNewPyproject(filePath: string): LintResult {
  writeFileSync(filePath, NEW_PYPROJECT, "utf8");
  const changes: LintChange[] = ["target-version", "line-length", "select", "quote-style", "indent-style"].map(
    (key) => ({ action: "added", key }),
  );
  return { changes, file: PYPROJECT_FILE, status: "written" };
}

function ensureRuff(sections: TomlSection[], map: Map<string, TomlSection>, changes: LintChange[]): boolean {
  const section = ensureSection(sections, map, RUFF_TABLE);
  const version = setKey(section, "target-version", '"py311"', false, changes);
  const length = setKey(section, "line-length", "88", false, changes);
  return version && length;
}

function ensureFormat(
  sections: TomlSection[],
  map: Map<string, TomlSection>,
  changes: LintChange[],
  force: boolean,
): boolean {
  const section = ensureSection(sections, map, FORMAT_TABLE);
  const quote = setKey(section, "quote-style", '"double"', force, changes);
  const indent = setKey(section, "indent-style", '"space"', force, changes);
  return quote && indent;
}

function ensureSelect(sections: TomlSection[], map: Map<string, TomlSection>, changes: LintChange[]): boolean {
  const lint = map.get(LINT_TABLE);
  const ruff = map.get(RUFF_TABLE);
  if (lint) return setSelect(lint, changes);
  if (ruff && assignmentIndexes(ruff.lines, "select").length > 0) return setSelect(ruff, changes);
  return setSelect(ensureSection(sections, map, LINT_TABLE), changes);
}

function ensureSection(sections: TomlSection[], map: Map<string, TomlSection>, header: string): TomlSection {
  const existing = map.get(header);
  if (existing) return existing;
  const created: TomlSection = { header, lines: [] };
  appendSection(sections, created);
  map.set(header, created);
  return created;
}

function setKey(section: TomlSection, key: string, literal: string, overwrite: boolean, changes: LintChange[]): boolean {
  const indexes = assignmentIndexes(section.lines, key);
  if (indexes.length > 1) return false;
  if (indexes.length === 0) {
    insertAssignment(section, `${key} = ${literal}`);
    changes.push({ action: "added", key });
    return true;
  }
  const index = indexes[0] ?? 0;
  const current = readLiteral(section.lines[index] ?? "", key);
  if (current === undefined) return false;
  if (current === literal) return true;
  if (!overwrite) {
    changes.push({ action: "left", key });
    return true;
  }
  const indent = (section.lines[index] ?? "").match(/^\s*/)?.[0] ?? "";
  section.lines[index] = `${indent}${key} = ${literal}`;
  changes.push({ action: "updated", key });
  return true;
}

function setSelect(section: TomlSection, changes: LintChange[]): boolean {
  const indexes = assignmentIndexes(section.lines, "select");
  if (indexes.length > 1) return false;
  if (indexes.length === 0) {
    insertAssignment(section, `select = ${formatSelect(REQUIRED_SELECT)}`);
    changes.push({ action: "added", key: "select" });
    return true;
  }
  const index = indexes[0] ?? 0;
  const codes = readSelect(section.lines[index] ?? "");
  if (!codes) return false;
  const codesToAdd = REQUIRED_SELECT.filter((code) => !codes.includes(code));
  if (codesToAdd.length === 0) return true;
  const indent = (section.lines[index] ?? "").match(/^\s*/)?.[0] ?? "";
  section.lines[index] = `${indent}select = ${formatSelect([...codes, ...codesToAdd])}`;
  changes.push({ action: "updated", key: "select" });
  return true;
}

function readSelect(line: string): string[] | undefined {
  const match = /^\s*select\s*=\s*\[(.*)\]\s*(?:#.*)?$/.exec(line);
  if (!match) return undefined;
  const body = match[1] ?? "";
  const codes: string[] = [];
  for (const found of body.matchAll(/"([^"]+)"|'([^']+)'/g)) {
    const code = found[1] ?? found[2];
    if (code) codes.push(code);
  }
  if (body.trim() !== "" && codes.length === 0) return undefined;
  return codes;
}

function readLiteral(line: string, key: string): string | undefined {
  const match = new RegExp(`^\\s*${key}\\s*=\\s*(.*)$`).exec(line);
  if (!match) return undefined;
  const raw = match[1] ?? "";
  const hash = raw.indexOf("#");
  const value = (hash === -1 ? raw : raw.slice(0, hash)).trim();
  return value === "" ? undefined : value;
}

function assignmentIndexes(lines: string[], key: string): number[] {
  const pattern = new RegExp(`^\\s*${key}\\s*=`);
  return lines.flatMap((line, index) => (pattern.test(line) ? [index] : []));
}

function insertAssignment(section: TomlSection, assignment: string): void {
  let end = section.lines.length;
  while (end > 0 && section.lines[end - 1]?.trim() === "") end -= 1;
  section.lines.splice(end, 0, assignment);
}

function appendSection(sections: TomlSection[], section: TomlSection): void {
  const last = sections[sections.length - 1];
  if (last && last.lines.length > 0 && last.lines[last.lines.length - 1] !== "") last.lines.push("");
  sections.push(section);
}

function splitToml(source: string): TomlSection[] {
  const sections: TomlSection[] = [{ header: "", lines: [] }];
  for (const line of source.split(/\r?\n/)) {
    const header = /^\[([^[\]]+)\]\s*(?:#.*)?$/.exec(line);
    if (header?.[1]) {
      sections.push({ header: header[1].trim(), lines: [] });
      continue;
    }
    sections[sections.length - 1]?.lines.push(line);
  }
  return sections;
}

function sectionMap(sections: TomlSection[]): Map<string, TomlSection> | undefined {
  const map = new Map<string, TomlSection>();
  for (const section of sections) {
    if (section.header === "") continue;
    if (map.has(section.header)) return undefined;
    map.set(section.header, section);
  }
  return map;
}

function serialize(sections: TomlSection[]): string {
  const chunks: string[] = [];
  for (const section of sections) {
    if (section.header !== "") chunks.push(`[${section.header}]`);
    chunks.push(...section.lines);
  }
  const text = chunks.join("\n");
  return text.endsWith("\n") ? text : `${text}\n`;
}

function formatSelect(codes: readonly string[]): string {
  return `[${codes.map((code) => `"${code}"`).join(", ")}]`;
}

function hasEdits(changes: LintChange[]): boolean {
  return changes.some((change) => change.action !== "left");
}

function skipped(reason: string): LintResult {
  return { changes: [], file: PYPROJECT_FILE, reason, status: "skipped" };
}
