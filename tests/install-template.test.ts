import fs, { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installDefaultTemplate, installTemplate } from "../src/core/install-template.js";
import { resolveSharedTemplate, resolveTemplate } from "../src/core/resolve-template.js";

const tempDirs: string[] = [];

function makeTempDir(): string {
  const directory = mkdtempSync(path.join(os.tmpdir(), "agent-skills-"));
  tempDirs.push(directory);
  return directory;
}

function install(targetDir: string, force = false, hardlink = true) {
  return installTemplate({
    agent: "codex",
    force,
    hardlink,
    sharedDir: resolveSharedTemplate(),
    targetDir,
    templateDir: resolveTemplate("react"),
  });
}

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { force: true, recursive: true });
});

describe("installTemplate", () => {
  it("installs the compact default instructions without AgentSkills", () => {
    const targetDir = makeTempDir();
    installDefaultTemplate(resolveTemplate("default"), {
      agent: "codex",
      force: false,
      hardlink: true,
      targetDir,
    });

    expect(existsSync(path.join(targetDir, "AGENTS.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills"))).toBe(false);
    const content = readFileSync(path.join(targetDir, "AGENTS.md"), "utf8");
    expect(content).toContain("Principles");
    expect(content).toContain("Review & Verification");
  });

  it("merges shared and framework files without creating a shared directory", () => {
    const targetDir = makeTempDir();
    install(targetDir);

    expect(existsSync(path.join(targetDir, "AgentSkills/OPERATING.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/react-typescript/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/principles/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/standards/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/security/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/review/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/developer.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/architect.md"))).toBe(true);
    expect(readFileSync(path.join(targetDir, "AgentSkills/agents/developer.md"), "utf8")).toContain("React Developer");
    const reviewerContent = readFileSync(path.join(targetDir, "AgentSkills/agents/reviewer.md"), "utf8");
    expect(reviewerContent).toContain("principles/SKILL.md");
    expect(reviewerContent).toContain("standards/SKILL.md");
    expect(reviewerContent).toContain("security/SKILL.md");
    expect(reviewerContent).toContain("review/SKILL.md");
    expect(reviewerContent).not.toContain("$\\le");
    const agentsContent = readFileSync(path.join(targetDir, "AGENTS.md"), "utf8");
    expect(agentsContent).toContain("principles/SKILL.md");
    expect(agentsContent).toContain("standards/SKILL.md");
    expect(agentsContent).toContain("security/SKILL.md");
    expect(agentsContent).toContain("review/SKILL.md");
    expect(agentsContent).toContain("Agent & Developer Instructions");
    expect(agentsContent).toContain("Think Before Coding");
    expect(existsSync(path.join(targetDir, "shared"))).toBe(false);
    expect(existsSync(path.join(targetDir, "AGENTS.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "CLAUDE.md"))).toBe(false);
  });

  it("preserves an installed file unless force is requested", () => {
    const targetDir = makeTempDir();
    const existingFile = path.join(targetDir, "AgentSkills/OPERATING.md");
    mkdirSync(path.dirname(existingFile), { recursive: true });
    writeFileSync(existingFile, "custom operating contract");

    const result = install(targetDir);

    expect(result.skipped).toContain("AgentSkills/OPERATING.md");
    expect(readFileSync(existingFile, "utf8")).toBe("custom operating contract");
  });

  it("creates dynamic entry points for each agent following the same standards and links", () => {
    const targetDir = makeTempDir();
    installTemplate({
      force: false,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("dotnet"),
    });

    expect(existsSync(path.join(targetDir, "AgentSkills/agents/developer.md"))).toBe(true);
    expect(readFileSync(path.join(targetDir, "AgentSkills/agents/developer.md"), "utf8")).toContain(".NET Developer");
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/architect.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/principles/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/standards/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/security/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/review/SKILL.md"))).toBe(true);

    const dotnetReviewer = readFileSync(path.join(targetDir, "AgentSkills/agents/reviewer.md"), "utf8");
    expect(dotnetReviewer).toContain("principles/SKILL.md");
    expect(dotnetReviewer).toContain("standards/SKILL.md");
    expect(dotnetReviewer).toContain("security/SKILL.md");
    expect(dotnetReviewer).toContain("review/SKILL.md");

    // Canonical AGENTS.md at root
    const agentsPath = path.join(targetDir, "AGENTS.md");
    expect(existsSync(agentsPath)).toBe(true);
    const agentsContent = readFileSync(agentsPath, "utf8");
    expect(agentsContent).toContain("principles/SKILL.md");
    expect(agentsContent).toContain("review/SKILL.md");

    // Claude.md shares identical content with AGENTS.md
    const claudePath = path.join(targetDir, "CLAUDE.md");
    expect(existsSync(claudePath)).toBe(true);
    const claudeContent = readFileSync(claudePath, "utf8");
    expect(claudeContent).toBe(agentsContent);
    expect(claudeContent).toContain("review/SKILL.md");

    // Antigravity rules with frontmatter and relative paths
    const geminiPath = path.join(targetDir, ".agents/rules/GEMINI.md");
    expect(existsSync(geminiPath)).toBe(true);
    const geminiContent = readFileSync(geminiPath, "utf8");
    expect(geminiContent).toContain("trigger: always_on");
    expect(geminiContent).toContain("../../AGENTS.md");
    expect(geminiContent).toContain("../../AgentSkills/skills/review/SKILL.md");

    // Cursor rules with frontmatter
    const cursorPath = path.join(targetDir, ".cursor/rules/instructions.md");
    expect(existsSync(cursorPath)).toBe(true);
    const cursorContent = readFileSync(cursorPath, "utf8");
    expect(cursorContent).toContain("alwaysApply: true");
    expect(cursorContent).toContain("../../AGENTS.md");

    // Copilot instructions
    const copilotPath = path.join(targetDir, ".github/copilot-instructions.md");
    expect(existsSync(copilotPath)).toBe(true);
    const copilotContent = readFileSync(copilotPath, "utf8");
    expect(copilotContent).toContain("../AGENTS.md");

    // Cline rules
    const clinePath = path.join(targetDir, ".clinerules");
    expect(existsSync(clinePath)).toBe(true);
    const clineContent = readFileSync(clinePath, "utf8");
    expect(clineContent).toBe(agentsContent);

    // Matching entry points (AGENTS.md, CLAUDE.md, and .clinerules) are hardlinked
    expect(statSync(agentsPath).ino).toBe(statSync(claudePath).ino);
    expect(statSync(agentsPath).ino).toBe(statSync(clinePath).ino);

    // Edits to one reflect in the others on disk
    writeFileSync(claudePath, "shared dynamic content", "utf8");
    expect(readFileSync(agentsPath, "utf8")).toBe("shared dynamic content");
    expect(readFileSync(clinePath, "utf8")).toBe("shared dynamic content");

    // Divergent entry points remain separate files with distinct inodes
    expect(statSync(geminiPath).ino).not.toBe(statSync(agentsPath).ino);
    expect(statSync(cursorPath).ino).not.toBe(statSync(agentsPath).ino);

    // Windsurf is completely removed
    expect(existsSync(path.join(targetDir, ".windsurfrules"))).toBe(false);
  });

  it("supports installing specific agent entry point dynamically on request", () => {
    const targetDir = makeTempDir();
    installTemplate({
      agent: "antigravity",
      force: false,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("react"),
    });

    const geminiPath = path.join(targetDir, ".agents/rules/GEMINI.md");
    expect(existsSync(geminiPath)).toBe(true);
    const geminiContent = readFileSync(geminiPath, "utf8");
    expect(geminiContent).toContain("trigger: always_on");
    expect(geminiContent).toContain("../../AgentSkills/skills/review/SKILL.md");
    expect(geminiContent).not.toContain("AGENTS.md");
    expect(existsSync(path.join(targetDir, "CLAUDE.md"))).toBe(false);
    expect(existsSync(path.join(targetDir, "AGENTS.md"))).toBe(false);
  });

  it("links to existing AGENTS.md when installing a specific agent entry point into an existing project", () => {
    const targetDir = makeTempDir();
    writeFileSync(path.join(targetDir, "AGENTS.md"), "# Existing Agents Contract\n", "utf8");

    installTemplate({
      agent: "antigravity",
      force: false,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("react"),
    });

    const geminiPath = path.join(targetDir, ".agents/rules/GEMINI.md");
    expect(existsSync(geminiPath)).toBe(true);
    const geminiContent = readFileSync(geminiPath, "utf8");
    expect(geminiContent).toContain("../../AGENTS.md");
  });

  it("supports installing code agent entry point mapping to AGENTS.md", () => {
    const targetDir = makeTempDir();
    installTemplate({
      agent: "code",
      force: false,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("react"),
    });

    const agentsPath = path.join(targetDir, "AGENTS.md");
    expect(existsSync(agentsPath)).toBe(true);
    const content = readFileSync(agentsPath, "utf8");
    expect(content).toContain("review/SKILL.md");
    expect(existsSync(path.join(targetDir, "CLAUDE.md"))).toBe(false);
  });

  it("disables hardlinks and writes separate files when hardlink is false", () => {
    const targetDir = makeTempDir();
    installTemplate({
      force: false,
      hardlink: false,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("react"),
    });

    const agentsPath = path.join(targetDir, "AGENTS.md");
    const claudePath = path.join(targetDir, "CLAUDE.md");
    const clinePath = path.join(targetDir, ".clinerules");
    expect(existsSync(agentsPath)).toBe(true);
    expect(existsSync(claudePath)).toBe(true);
    expect(existsSync(clinePath)).toBe(true);

    expect(statSync(claudePath).ino).not.toBe(statSync(clinePath).ino);
    expect(statSync(agentsPath).ino).not.toBe(statSync(claudePath).ino);

    writeFileSync(claudePath, "independent claude file", "utf8");
    expect(readFileSync(clinePath, "utf8")).not.toBe("independent claude file");
    expect(readFileSync(agentsPath, "utf8")).not.toBe("independent claude file");
  });

  it("hardlinks root entry points in default template while keeping nested entry points separate", () => {
    const targetDir = makeTempDir();
    installDefaultTemplate(resolveTemplate("default"), {
      force: false,
      hardlink: true,
      targetDir,
    });

    const agentsPath = path.join(targetDir, "AGENTS.md");
    const claudePath = path.join(targetDir, "CLAUDE.md");
    const clinePath = path.join(targetDir, ".clinerules");
    const geminiPath = path.join(targetDir, ".agents/rules/GEMINI.md");

    expect(existsSync(agentsPath)).toBe(true);
    expect(existsSync(claudePath)).toBe(true);
    expect(existsSync(clinePath)).toBe(true);
    expect(existsSync(geminiPath)).toBe(true);

    expect(statSync(agentsPath).ino).toBe(statSync(claudePath).ino);
    expect(statSync(agentsPath).ino).toBe(statSync(clinePath).ino);
    expect(statSync(geminiPath).ino).not.toBe(statSync(agentsPath).ino);

    writeFileSync(claudePath, "default synchronized instructions", "utf8");
    expect(readFileSync(agentsPath, "utf8")).toBe("default synchronized instructions");
    expect(readFileSync(clinePath, "utf8")).toBe("default synchronized instructions");
  });

  it("hardlinks AGENTS.md and matching entry points when custom template content is identical", () => {
    const targetDir = makeTempDir();
    const customShared = makeTempDir();
    const entryDir = path.join(customShared, "entry-points");
    mkdirSync(entryDir, { recursive: true });
    writeFileSync(
      path.join(entryDir, "instructions.md"),
      "# Instructions\n\nSee AGENTS.md for details.\n- Follow review/SKILL.md\n",
      "utf8",
    );

    installTemplate({
      force: false,
      hardlink: true,
      sharedDir: customShared,
      targetDir,
      templateDir: resolveTemplate("react"),
    });

    const agentsPath = path.join(targetDir, "AGENTS.md");
    const claudePath = path.join(targetDir, "CLAUDE.md");
    expect(existsSync(agentsPath)).toBe(true);
    expect(existsSync(claudePath)).toBe(true);

    expect(statSync(agentsPath).ino).toBe(statSync(claudePath).ino);
    writeFileSync(agentsPath, "synchronized instructions", "utf8");
    expect(readFileSync(claudePath, "utf8")).toBe("synchronized instructions");
  });

  it("falls back to file write when linkSync throws an error", () => {
    const targetDir = makeTempDir();
    const linkSpy = vi.spyOn(fs, "linkSync").mockImplementation(() => {
      throw new Error("EXDEV: cross-device link not permitted");
    });

    installTemplate({
      force: false,
      hardlink: true,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("react"),
    });

    linkSpy.mockRestore();

    const agentsPath = path.join(targetDir, "AGENTS.md");
    const claudePath = path.join(targetDir, "CLAUDE.md");
    const clinePath = path.join(targetDir, ".clinerules");
    expect(existsSync(agentsPath)).toBe(true);
    expect(existsSync(claudePath)).toBe(true);
    expect(existsSync(clinePath)).toBe(true);
    expect(readFileSync(claudePath, "utf8")).toContain("review/SKILL.md");
    expect(readFileSync(clinePath, "utf8")).toContain("review/SKILL.md");
    expect(statSync(claudePath).ino).not.toBe(statSync(agentsPath).ino);
  });

  it("installs shared template containing AgentSkills and review skill across entry points", () => {
    const targetDir = makeTempDir();
    installTemplate({
      force: false,
      hardlink: true,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("shared"),
    });

    expect(existsSync(path.join(targetDir, "AgentSkills/OPERATING.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/architect.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/architect.agent.md"))).toBe(false);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.agent.md"))).toBe(false);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/review/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/principles/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/standards/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/security/SKILL.md"))).toBe(true);

    const operatingContent = readFileSync(path.join(targetDir, "AgentSkills/OPERATING.md"), "utf8");
    expect(operatingContent).toContain("architect.md");
    expect(operatingContent).toContain("reviewer.md");
    expect(operatingContent).toContain("review/SKILL.md");

    expect(existsSync(path.join(targetDir, "AGENTS.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, ".agents/rules/GEMINI.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, ".cursor/rules/instructions.md"))).toBe(true);
  });

  it("installs shared skills and agents when installing antigravity agent specifically", () => {
    const targetDir = makeTempDir();
    installTemplate({
      agent: "antigravity",
      force: false,
      hardlink: true,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("shared"),
    });

    expect(existsSync(path.join(targetDir, ".agents/rules/GEMINI.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/architect.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/review/SKILL.md"))).toBe(true);

    const geminiContent = readFileSync(path.join(targetDir, ".agents/rules/GEMINI.md"), "utf8");
    expect(geminiContent).toContain("trigger: always_on");
    expect(geminiContent).toContain("../../AgentSkills/skills/review/SKILL.md");
    expect(geminiContent).toContain("../../AgentSkills/agents/");
    expect(geminiContent).toContain("architect.md");
    expect(geminiContent).toContain("reviewer.md");
  });

  it("preserves custom agent persona when installing without force and overwrites with force", () => {
    const targetDir = makeTempDir();
    const customArchitect = path.join(targetDir, "AgentSkills/agents/architect.md");
    mkdirSync(path.dirname(customArchitect), { recursive: true });
    writeFileSync(customArchitect, "custom-architect-content", "utf8");

    const nonForcedResult = installTemplate({
      force: false,
      hardlink: true,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("dotnet"),
    });

    expect(nonForcedResult.skipped).toContain("AgentSkills/agents/architect.md");
    expect(readFileSync(customArchitect, "utf8")).toBe("custom-architect-content");

    const forcedResult = installTemplate({
      force: true,
      hardlink: true,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("dotnet"),
    });

    expect(forcedResult.written).toContain("AgentSkills/agents/architect.md");
    expect(readFileSync(customArchitect, "utf8")).not.toBe("custom-architect-content");
    expect(readFileSync(customArchitect, "utf8")).toContain(".NET Architect");
  });

  it("installs shared skills and agents when installing cursor agent specifically", () => {
    const targetDir = makeTempDir();
    installTemplate({
      agent: "cursor",
      force: false,
      hardlink: true,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("shared"),
    });

    expect(existsSync(path.join(targetDir, ".cursor/rules/instructions.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/review/SKILL.md"))).toBe(true);

    const cursorContent = readFileSync(path.join(targetDir, ".cursor/rules/instructions.md"), "utf8");
    expect(cursorContent).toContain("alwaysApply: true");
    expect(cursorContent).toContain("../../AgentSkills/skills/review/SKILL.md");
    expect(cursorContent).not.toContain("AGENTS.md");
  });
});
