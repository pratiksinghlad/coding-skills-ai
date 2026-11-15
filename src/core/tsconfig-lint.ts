import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { findMatchingBrace, findRootOpen, stripJsonComments } from "./jsonc.js";
import type { LintChange, LintResult } from "./lint-config.js";

const TSCONFIG_FILE = "tsconfig.json";
const PARSE_REASON = "could not parse tsconfig.json";
const PATCH_REASON = "could not patch tsconfig.json safely";

const STRICT_TRUE_KEYS = [
  "strict",
  "noUnusedLocals",
  "noUnusedParameters",
  "noImplicitReturns",
  "noImplicitOverride",
  "noFallthroughCasesInSwitch",
  "noUncheckedIndexedAccess",
  "exactOptionalPropertyTypes",
  "noPropertyAccessFromIndexSignature",
  "verbatimModuleSyntax",
  "forceConsistentCasingInFileNames",
  "resolveJsonModule",
  "isolatedModules",
] as const;

const STRICT_FALSE_KEYS = ["allowUnreachableCode", "allowUnusedLabels"] as const;

const SHAPE_KEYS = {
  module: "esnext",
  moduleResolution: "bundler",
  noEmit: true,
  target: "ES2022",
} as const;

type JsonRecord = Record<string, unknown>;

interface PlannedTsconfig {
  changes: LintChange[];
  next: JsonRecord;
}

export function applyTsconfigLint(targetDir: string, force: boolean): LintResult {
  const filePath = path.join(targetDir, TSCONFIG_FILE);
  if (!existsSync(filePath)) return writeNewTsconfig(filePath);

  const source = readFileSync(filePath, "utf8");
  const stripped = stripJsonComments(source);
  const root = parseTsconfig(stripped.text);
  if (!root) return skipped(PARSE_REASON);

  const planned = planTsconfig(root, force);
  if (!hasEdits(planned.changes)) return { changes: planned.changes, file: TSCONFIG_FILE, status: "unchanged" };

  const nextSource = stripped.hasComment ? patchTsconfig(source, planned) : `${JSON.stringify(planned.next, null, 2)}\n`;
  if (nextSource === undefined) return skipped(PATCH_REASON);

  writeFileSync(filePath, nextSource, "utf8");
  return { changes: planned.changes, file: TSCONFIG_FILE, status: "written" };
}

function writeNewTsconfig(filePath: string): LintResult {
  const planned = planTsconfig({}, true);
  writeFileSync(filePath, `${JSON.stringify(planned.next, null, 2)}\n`, "utf8");
  return { changes: planned.changes, file: TSCONFIG_FILE, status: "written" };
}

function planTsconfig(root: JsonRecord, force: boolean): PlannedTsconfig {
  const options = readCompilerOptions(root);
  const changes: LintChange[] = [];
  for (const key of STRICT_TRUE_KEYS) considerKey(changes, options, key, true, force);
  for (const key of STRICT_FALSE_KEYS) considerKey(changes, options, key, false, force);
  for (const [key, desired] of Object.entries(SHAPE_KEYS)) considerKey(changes, options, key, desired, false);
  const next: JsonRecord = { ...root, compilerOptions: options };
  if (next.include === undefined) {
    next.include = ["src"];
    changes.push({ action: "added", key: "include" });
  }
  return { changes, next };
}

function considerKey(changes: LintChange[], options: JsonRecord, key: string, desired: unknown, overwrite: boolean): void {
  if (!Object.hasOwn(options, key)) {
    options[key] = desired;
    changes.push({ action: "added", key });
    return;
  }
  if (Object.is(options[key], desired)) return;
  if (!overwrite) {
    changes.push({ action: "left", key });
    return;
  }
  options[key] = desired;
  changes.push({ action: "updated", key });
}

function readCompilerOptions(root: JsonRecord): JsonRecord {
  const value = root.compilerOptions;
  if (value === undefined) return {};
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  return { ...value };
}

function parseTsconfig(text: string): JsonRecord | undefined {
  try {
    const value: unknown = JSON.parse(text);
    if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
    const root = value as JsonRecord;
    const options = root.compilerOptions;
    if (options !== undefined && (typeof options !== "object" || options === null || Array.isArray(options))) return undefined;
    return root;
  } catch {
    return undefined;
  }
}

function patchTsconfig(source: string, planned: PlannedTsconfig): string | undefined {
  const additions = planned.changes.filter((change) => change.action === "added" && change.key !== "include");
  const updates = planned.changes.filter((change) => change.action === "updated");
  let next = source;
  for (const change of updates) {
    const value = planned.next.compilerOptions;
    if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
    const replaced = replaceJsonKey(next, change.key, (value as JsonRecord)[change.key]);
    if (replaced === undefined) return undefined;
    next = replaced;
  }
  const added = insertCompilerKeys(next, additions, planned.next.compilerOptions);
  if (added === undefined) return undefined;
  if (!planned.changes.some((change) => change.key === "include" && change.action === "added")) return added;
  return insertInclude(added);
}

function insertCompilerKeys(source: string, additions: LintChange[], options: unknown): string | undefined {
  if (additions.length === 0) return source;
  if (typeof options !== "object" || options === null || Array.isArray(options)) return undefined;
  const record = options as JsonRecord;
  const match = /"compilerOptions"\s*:\s*\{/.exec(source);
  if (!match || match.index === undefined) return undefined;
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = additions.map((change) => `${newline}    "${change.key}": ${JSON.stringify(record[change.key])},`);
  const open = match.index + match[0].length - 1;
  return source.slice(0, open + 1) + lines.join("") + source.slice(open + 1);
}

function replaceJsonKey(source: string, key: string, value: unknown): string | undefined {
  const pattern = new RegExp(`^(\\s*)"${key}"\\s*:\\s*(true|false)\\b(.*)$`);
  let found = false;
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source.split(/\r?\n/).map((line) => {
    const match = pattern.exec(line);
    if (!match || found) return line;
    found = true;
    return `${match[1] ?? ""}"${key}": ${JSON.stringify(value)}${match[3] ?? ""}`;
  });
  if (!found) return undefined;
  return lines.join(newline);
}

function insertInclude(source: string): string | undefined {
  const open = findRootOpen(source);
  if (open === undefined) return undefined;
  const close = findMatchingBrace(source, open);
  if (close === undefined) return undefined;
  let cursor = close - 1;
  while (cursor >= 0 && /\s/.test(source[cursor] ?? "")) cursor -= 1;
  const previous = source[cursor] ?? "";
  const needsComma = previous !== "{" && previous !== ",";
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const comma = needsComma ? "," : "";
  return `${source.slice(0, close)}${comma}${newline}  "include": ["src"]${newline}${source.slice(close)}`;
}

function hasEdits(changes: LintChange[]): boolean {
  return changes.some((change) => change.action !== "left");
}

function skipped(reason: string): LintResult {
  return { changes: [], file: TSCONFIG_FILE, reason, status: "skipped" };
}
