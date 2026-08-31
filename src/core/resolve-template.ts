import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TEMPLATE_NAMES = ["default", "dotnet", "react"];

function templatesRoot(): string {
  return path.resolve(__dirname, "..", "..", "templates");
}

export function resolveSharedTemplate(): string {
  return path.join(templatesRoot(), "shared");
}

export function resolveTemplate(name: string): string {
  if (!TEMPLATE_NAMES.includes(name)) {
    throw new Error(`Unknown template "${name}". Choose: ${TEMPLATE_NAMES.join(", ")}.`);
  }

  const templateDir = path.join(templatesRoot(), name);
  if (!existsSync(templateDir)) {
    throw new Error(`Template "${name}" is not bundled with this package.`);
  }

  return templateDir;
}
