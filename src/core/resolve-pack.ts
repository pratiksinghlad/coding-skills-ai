// src/core/resolve-pack.ts
// Locates a templates folder bundled inside the package itself.
// Since everything is in one package, no runtime npm fetching is needed.
//
// Templates live at the repo/package root under `templates/<packName>/`.

import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Canonical directory names for built-in packs. */
const PACK_ALIASES: Record<string, string> = {
  dotnet: "dotnet",
  "skills-dotnet": "dotnet",
  "@pratikpsl/agent-skills-dotnet": "dotnet",
};

/**
 * Resolves a pack name or alias to its installed directory.
 *
 * @throws When the pack cannot be located.
 */
export function resolvePack(packName: string): string {
  const normalized =
    PACK_ALIASES[packName] ??
    packName
      .replace(/^@pratikpsl\/agent-skills-/, "")
      .replace(/^skills-/, "");

  // templates/ lives three levels up from dist/core/ (at the package root)
  // In development (src/core/), it's two levels up — but we always run from
  // the compiled dist/, so three levels is correct.
  const templateDir = path.resolve(
    __dirname,
    "..",
    "..",
    "templates",
    normalized,
  );

  if (
    existsSync(templateDir) &&
    existsSync(path.join(templateDir, "manifest.json"))
  ) {
    return templateDir;
  }

  throw new Error(
    `Pack "${packName}" (mapped to "${normalized}") is not bundled with this version of the CLI. ` +
      `Currently available packs: dotnet`,
  );
}
