import { applyPyprojectLint } from "./pyproject-lint.js";
import { applyTsconfigLint } from "./tsconfig-lint.js";

export type LintAction = "added" | "left" | "updated";

export interface LintChange {
  action: LintAction;
  key: string;
}

export interface LintResult {
  changes: LintChange[];
  file: string;
  reason?: string;
  status: "skipped" | "unchanged" | "written";
}

export interface ApplyLintOptions {
  force: boolean;
  language: LintLanguage;
  targetDir: string;
}

export const LINT_LANGUAGES = ["python", "react"] as const;

export type LintLanguage = (typeof LINT_LANGUAGES)[number];

export function parseLintLanguage(value: string): LintLanguage {
  const name = value.toLowerCase();
  if (name === "react" || name === "python") return name;
  throw new Error(`Unknown lint language "${value}". Choose: react, python.`);
}

export function applyProjectLint(options: ApplyLintOptions): LintResult {
  if (options.language === "react") return applyTsconfigLint(options.targetDir, options.force);
  return applyPyprojectLint(options.targetDir, options.force);
}

export function formatLintResult(result: LintResult): string {
  if (result.status === "skipped") {
    return `Skipped ${result.file}: ${result.reason ?? "could not update the file"}.`;
  }

  const added = keysFor(result.changes, "added");
  const updated = keysFor(result.changes, "updated");
  const left = keysFor(result.changes, "left");
  if (result.status === "unchanged") {
    return left.length === 0 ? `${result.file}: unchanged.` : `${result.file}: unchanged (left: ${left.join(", ")}).`;
  }

  const parts = [
    added.length > 0 ? `added: ${added.join(", ")}` : "",
    updated.length > 0 ? `updated: ${updated.join(", ")}` : "",
    left.length > 0 ? `left: ${left.join(", ")}` : "",
  ].filter((part) => part !== "");
  return `${result.file}: written (${parts.join("; ")}).`;
}

function keysFor(changes: LintChange[], action: LintAction): string[] {
  return changes.filter((change) => change.action === action).map((change) => change.key);
}
