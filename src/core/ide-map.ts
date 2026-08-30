// src/core/ide-map.ts
// Central registry of supported AI coding IDEs and their entry-point mappings.

import type { SkillEntry } from "./manifest.js";

export const IDE_ENTRY_POINT_MAP: Record<string, string> = {
  cursor: "entry-point:cursor",
  claude: "entry-point:claude",
  codex: "entry-point:codex",
  copilot: "entry-point:copilot",
  antigravity: "entry-point:antigravity",
  windsurf: "entry-point:windsurf",
  cline: "entry-point:cline",
};

export const VALID_IDE_NAMES = Object.keys(IDE_ENTRY_POINT_MAP).join(", ");
export const ENTRY_POINT_PREFIX = "entry-point:";

/**
 * Filters skills for a given IDE (or all IDEs when undefined).
 * Deduplicates multiple skills targeting the same destination.
 */
export function filterSkillsForIde(
  skills: SkillEntry[],
  ide?: string,
): SkillEntry[] {
  if (!ide) {
    const seen = new Set<string>();
    return skills.filter((s) => {
      const dest = s.dest ?? s.path;
      if (seen.has(dest)) return false;
      seen.add(dest);
      return true;
    });
  }

  const targetSkillName = IDE_ENTRY_POINT_MAP[ide.toLowerCase()];
  if (!targetSkillName) {
    throw new Error(
      `Unknown IDE "${ide}". Valid options are: ${VALID_IDE_NAMES}`,
    );
  }

  return skills.filter(
    (s) =>
      (!s.name.startsWith(ENTRY_POINT_PREFIX) && s.name !== "instructions") ||
      s.name === targetSkillName,
  );
}
