// tests/copy-skills.test.ts
// Unit tests for the copySkills utility.
// Key invariants tested:
//   1. Files are copied when destination does not exist.
//   2. Existing files are NOT overwritten without --force.
//   3. Existing files ARE overwritten with --force.
//   4. Summary counts (written/skipped) are correct.
//   5. The optional `dest` field routes a file to a different target path (IDE entry-points).

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "fs";
import path from "path";
import os from "os";
import { copySkills } from "../src/core/copy-skills.js";
import type { SkillEntry } from "../src/core/manifest.js";

function createSkillSource(
  packDir: string,
  skillRelPath: string,
  content = "skill content",
): void {
  const fullPath = path.join(packDir, skillRelPath);
  mkdirSync(fullPath, { recursive: true });
  writeFileSync(path.join(fullPath, "SKILL.md"), content);
}

describe("copySkills", () => {
  let packDir: string;
  let targetDir: string;

  beforeEach(() => {
    const ts = Date.now();
    packDir = path.join(os.tmpdir(), `agent-skills-pack-${ts}`);
    targetDir = path.join(os.tmpdir(), `agent-skills-target-${ts}`);
    mkdirSync(packDir, { recursive: true });
    mkdirSync(targetDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(packDir, { recursive: true, force: true });
    rmSync(targetDir, { recursive: true, force: true });
  });

  const skills: SkillEntry[] = [
    { name: "core", description: "Core principles", path: "AgentSkills/skills/core" },
  ];

  it("copies a skill when destination does not exist", () => {
    createSkillSource(packDir, "AgentSkills/skills/core");

    const { written, skipped } = copySkills({ skills, packDir, targetDir, force: false });

    expect(written).toHaveLength(1);
    expect(skipped).toHaveLength(0);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/core/SKILL.md"))).toBe(true);
  });

  it("skips an existing skill without --force", () => {
    createSkillSource(packDir, "AgentSkills/skills/core", "original");
    // Pre-create destination with different content
    const destSkillDir = path.join(targetDir, "AgentSkills/skills/core");
    mkdirSync(destSkillDir, { recursive: true });
    writeFileSync(path.join(destSkillDir, "SKILL.md"), "existing content");

    const { written, skipped } = copySkills({ skills, packDir, targetDir, force: false });

    expect(written).toHaveLength(0);
    expect(skipped).toHaveLength(1);
    // Existing content should be preserved
    const content = readFileSync(path.join(destSkillDir, "SKILL.md"), "utf8");
    expect(content).toBe("existing content");
  });

  it("overwrites an existing skill with --force", () => {
    createSkillSource(packDir, "AgentSkills/skills/core", "new content");
    const destSkillDir = path.join(targetDir, "AgentSkills/skills/core");
    mkdirSync(destSkillDir, { recursive: true });
    writeFileSync(path.join(destSkillDir, "SKILL.md"), "old content");

    const { written, skipped } = copySkills({ skills, packDir, targetDir, force: true });

    expect(written).toHaveLength(1);
    expect(skipped).toHaveLength(0);
    const content = readFileSync(path.join(destSkillDir, "SKILL.md"), "utf8");
    expect(content).toBe("new content");
  });

  it("returns correct counts for mixed written/skipped", () => {
    const twoSkills: SkillEntry[] = [
      { name: "core", description: "Core", path: "AgentSkills/skills/core" },
      { name: "design", description: "Design", path: "AgentSkills/skills/design" },
    ];

    createSkillSource(packDir, "AgentSkills/skills/core");
    createSkillSource(packDir, "AgentSkills/skills/design");

    // Pre-create only core in the destination
    const destCore = path.join(targetDir, "AgentSkills/skills/core");
    mkdirSync(destCore, { recursive: true });
    writeFileSync(path.join(destCore, "SKILL.md"), "existing");

    const { written, skipped } = copySkills({ skills: twoSkills, packDir, targetDir, force: false });

    expect(written).toHaveLength(1);
    expect(skipped).toHaveLength(1);
    expect(written[0]).toBe("AgentSkills/skills/design");
    expect(skipped[0]).toBe("AgentSkills/skills/core");
  });

  it("copies an entry-point file to the dest path, not the source path", () => {
    // Simulate an IDE entry-point: source lives inside the pack, dest is at project root.
    const entryPointSkills: SkillEntry[] = [
      {
        name: "entry-point:claude",
        description: "Claude entry point",
        path: "AgentSkills/entry-points/CLAUDE.md",
        dest: "CLAUDE.md",
      },
    ];

    // Create source file (a plain file, not a directory)
    const srcDir = path.join(packDir, "AgentSkills/entry-points");
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(path.join(srcDir, "CLAUDE.md"), "# Claude Entry Point");

    const { written, skipped } = copySkills({ skills: entryPointSkills, packDir, targetDir, force: false });

    // Should land at target root as CLAUDE.md, not inside AgentSkills/entry-points/
    expect(written).toHaveLength(1);
    expect(written[0]).toBe("CLAUDE.md");
    expect(existsSync(path.join(targetDir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/entry-points/CLAUDE.md"))).toBe(false);
  });

  it("skips an existing entry-point file without --force (uses dest path)", () => {
    const entryPointSkills: SkillEntry[] = [
      {
        name: "entry-point:claude",
        description: "Claude entry point",
        path: "AgentSkills/entry-points/CLAUDE.md",
        dest: "CLAUDE.md",
      },
    ];

    const srcDir = path.join(packDir, "AgentSkills/entry-points");
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(path.join(srcDir, "CLAUDE.md"), "new content");

    // Pre-create destination
    writeFileSync(path.join(targetDir, "CLAUDE.md"), "existing content");

    const { written, skipped } = copySkills({ skills: entryPointSkills, packDir, targetDir, force: false });

    expect(written).toHaveLength(0);
    expect(skipped).toHaveLength(1);
    expect(skipped[0]).toBe("CLAUDE.md");
    // Existing content untouched
    expect(readFileSync(path.join(targetDir, "CLAUDE.md"), "utf8")).toBe("existing content");
  });
});
