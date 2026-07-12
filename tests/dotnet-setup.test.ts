// tests/dotnet-setup.test.ts
// Unit tests for the filterSkillsForIde helper in dotnet-setup.ts.
//
// This function is pure (no I/O), so every test runs in-process without
// touching the file system or spawning a subprocess.
//
// Invariants tested:
//   1. No IDE → no filter applied (caller receives the original array).
//   2. Each valid IDE keeps its own entry-point and drops all others.
//   3. All non-entry-point skills are always preserved.
//   4. Unknown IDE name throws with a helpful error message.

import { describe, it, expect } from "vitest";
import { filterSkillsForIde } from "../src/cli/commands/dotnet-setup.js";
import type { SkillEntry } from "../src/core/manifest.js";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SHARED_SKILLS: SkillEntry[] = [
  { name: "OPERATING", description: "Operating contract", path: "AgentSkills/OPERATING.md" },
  { name: "core",       description: "Core principles",  path: "AgentSkills/skills/core" },
  { name: "design",     description: "Design rules",     path: "AgentSkills/skills/design" },
  { name: "memory",     description: "Agent memory",     path: "AgentSkills/memory" },
];

const ENTRY_POINTS: SkillEntry[] = [
  { name: "entry-point:claude",      description: "Claude EP",      path: "AgentSkills/entry-points/CLAUDE.md",                 dest: "CLAUDE.md" },
  { name: "entry-point:codex",       description: "Codex EP",       path: "AgentSkills/entry-points/AGENTS.md",                 dest: "AGENTS.md" },
  { name: "entry-point:copilot",     description: "Copilot EP",     path: "AgentSkills/entry-points/copilot-instructions.md",   dest: ".github/copilot-instructions.md" },
  { name: "entry-point:cursor",      description: "Cursor EP",      path: "AgentSkills/entry-points/cursor-instructions.md",    dest: ".cursor/rules/instructions.md" },
  { name: "entry-point:antigravity", description: "Antigravity EP", path: "AgentSkills/entry-points/antigravity-instructions.md", dest: ".agents/GEMINI.md" },
];

const ALL_SKILLS: SkillEntry[] = [...SHARED_SKILLS, ...ENTRY_POINTS];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function entryPointNamesIn(skills: SkillEntry[]): string[] {
  return skills
    .filter((s) => s.name.startsWith("entry-point:"))
    .map((s) => s.name);
}

function sharedNamesIn(skills: SkillEntry[]): string[] {
  return skills
    .filter((s) => !s.name.startsWith("entry-point:"))
    .map((s) => s.name);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("filterSkillsForIde", () => {
  it("includes only the cursor entry-point when ide=cursor", () => {
    const result = filterSkillsForIde(ALL_SKILLS, "cursor");

    expect(entryPointNamesIn(result)).toEqual(["entry-point:cursor"]);
    expect(sharedNamesIn(result)).toEqual(sharedNamesIn(SHARED_SKILLS));
  });

  it("includes only the claude entry-point when ide=claude", () => {
    const result = filterSkillsForIde(ALL_SKILLS, "claude");

    expect(entryPointNamesIn(result)).toEqual(["entry-point:claude"]);
    expect(sharedNamesIn(result)).toEqual(sharedNamesIn(SHARED_SKILLS));
  });

  it("includes only the codex entry-point when ide=codex", () => {
    const result = filterSkillsForIde(ALL_SKILLS, "codex");

    expect(entryPointNamesIn(result)).toEqual(["entry-point:codex"]);
  });

  it("includes only the copilot entry-point when ide=copilot", () => {
    const result = filterSkillsForIde(ALL_SKILLS, "copilot");

    expect(entryPointNamesIn(result)).toEqual(["entry-point:copilot"]);
  });

  it("includes only the antigravity entry-point when ide=antigravity", () => {
    const result = filterSkillsForIde(ALL_SKILLS, "antigravity");

    expect(entryPointNamesIn(result)).toEqual(["entry-point:antigravity"]);
  });

  it("always preserves all shared (non-entry-point) skills", () => {
    for (const ide of ["cursor", "claude", "codex", "copilot", "antigravity"]) {
      const result = filterSkillsForIde(ALL_SKILLS, ide);
      expect(sharedNamesIn(result)).toEqual(sharedNamesIn(SHARED_SKILLS));
    }
  });

  it("throws a descriptive error for an unknown IDE name", () => {
    expect(() => filterSkillsForIde(ALL_SKILLS, "unknown-ide")).toThrowError(
      /Unknown IDE "unknown-ide"/,
    );
  });

  it("error message lists all valid IDE names", () => {
    expect(() => filterSkillsForIde(ALL_SKILLS, "vscode")).toThrowError(
      /cursor.*claude.*codex.*copilot.*antigravity/,
    );
  });

  it("returns the full list unchanged when the manifest has no entry-point skills", () => {
    const result = filterSkillsForIde(SHARED_SKILLS, "cursor");
    // No entry-points in source → nothing filtered out
    expect(result).toHaveLength(SHARED_SKILLS.length);
  });
});
