import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TEMPLATE_NAMES = ["dotnet", "python", "react", "rust", "shared"];

const REMOVED_AGENTS = new Set([
  "antigravity",
  "claude",
  "cline",
  "code",
  "codex",
  "copilot",
  "cursor",
]);

function templatesRoot(): string {
  return path.resolve(__dirname, "..", "..", "templates");
}

export function resolveSharedTemplate(): string {
  return path.join(templatesRoot(), "shared");
}

export function resolveTemplate(name: string): string {
  const normalized = name.toLowerCase();

  if (REMOVED_AGENTS.has(normalized)) {
    throw new Error(
      `"${name}" is no longer an install target. This CLI installs Cursor workspace skills. Choose: ${TEMPLATE_NAMES.join(", ")}.`,
    );
  }

  if (normalized === "default") {
    throw new Error(
      `The "default" template was removed. Run without a template name to install shared Cursor skills.`,
    );
  }

  if (!TEMPLATE_NAMES.includes(normalized)) {
    throw new Error(`Unknown template "${name}". Choose: ${TEMPLATE_NAMES.join(", ")}.`);
  }

  const templateDir = path.join(templatesRoot(), normalized);
  if (!existsSync(templateDir)) {
    throw new Error(`Template "${normalized}" is not bundled with this package.`);
  }

  return templateDir;
}
