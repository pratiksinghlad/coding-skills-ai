// tests/setup.test.ts
// Unit tests for the filterSkillsForIde helper, setup command, and default pack resolution.

import { describe, it, expect } from "vitest";
import { filterSkillsForIde, VALID_IDE_NAMES } from "../src/core/ide-map.js";
import { resolvePack } from "../src/core/resolve-pack.js";
import { readManifest } from "../src/core/manifest.js";
import type { SkillEntry } from "../src/core/manifest.js";

const TEST_SKILLS: SkillEntry[] = [
  { name: "instructions", description: "Canonical instructions", path: "instructions.md", dest: "AGENTS.md" },
  { name: "entry-point:codex", description: "Codex EP", path: "instructions.md", dest: "AGENTS.md" },
  { name: "entry-point:claude", description: "Claude EP", path: "instructions.md", dest: "CLAUDE.md" },
  { name: "entry-point:copilot", description: "Copilot EP", path: "instructions.md", dest: ".github/copilot-instructions.md" },
  { name: "entry-point:cursor", description: "Cursor EP", path: "instructions.md", dest: ".cursor/rules/instructions.md" },
  { name: "entry-point:antigravity", description: "Antigravity EP", path: "instructions.md", dest: ".agents/GEMINI.md" },
  { name: "entry-point:windsurf", description: "Windsurf EP", path: "instructions.md", dest: ".windsurfrules" },
  { name: "entry-point:cline", description: "Cline EP", path: "instructions.md", dest: ".clinerules" },
  { name: "entry-point:aider", description: "Aider EP", path: "instructions.md", dest: "CONVENTIONS.md" },
];

describe("filterSkillsForIde", () => {
  it("deduplicates destinations when no IDE is specified", () => {
    const result = filterSkillsForIde(TEST_SKILLS);
    const dests = result.map((s) => s.dest ?? s.path);
    const uniqueDests = Array.from(new Set(dests));
    expect(dests).toEqual(uniqueDests);
    expect(result.length).toBe(8); // 8 distinct destination paths
  });

  it("filters accurately for each supported IDE", () => {
    const testCases: Array<[string, string]> = [
      ["cursor", "entry-point:cursor"],
      ["claude", "entry-point:claude"],
      ["codex", "entry-point:codex"],
      ["copilot", "entry-point:copilot"],
      ["antigravity", "entry-point:antigravity"],
      ["windsurf", "entry-point:windsurf"],
      ["cline", "entry-point:cline"],
      ["aider", "entry-point:aider"],
    ];

    for (const [ide, expectedSkillName] of testCases) {
      const result = filterSkillsForIde(TEST_SKILLS, ide);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(expectedSkillName);
    }
  });

  it("handles case-insensitive IDE names", () => {
    const result = filterSkillsForIde(TEST_SKILLS, "CURSOR");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("entry-point:cursor");
  });

  it("throws a descriptive error for unknown IDE", () => {
    expect(() => filterSkillsForIde(TEST_SKILLS, "unknown-ide")).toThrowError(
      /Unknown IDE "unknown-ide"/,
    );
  });

  it("lists all valid IDE names in error message", () => {
    expect(() => filterSkillsForIde(TEST_SKILLS, "vim")).toThrowError(
      new RegExp(VALID_IDE_NAMES.replace(/, /g, ".*")),
    );
  });
});

describe("default pack resolution & aliases", () => {
  const aliases = [
    "default",
    "instructions",
    "skills-instructions",
    "@pratikpsl/agent-skills",
    "@pratikpsl/agent-skills-default",
    "@pratikpsl/agent-skills-instructions",
    "single-file",
    "universal",
    "core",
    "standard",
    "base",
  ];

  for (const alias of aliases) {
    it(`resolves alias "${alias}" to the default template`, () => {
      const packDir = resolvePack(alias);
      const manifest = readManifest(packDir);
      expect(manifest.name).toBe("@pratikpsl/agent-skills");
      expect(manifest.skills.length).toBeGreaterThan(0);
    });
  }
});

