import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
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
    expect(readFileSync(path.join(targetDir, "AGENTS.md"), "utf8")).toContain("Principles");
  });

  it("merges shared and framework files without creating a shared directory", () => {
    const targetDir = makeTempDir();
    install(targetDir);

    expect(existsSync(path.join(targetDir, "AgentSkills/OPERATING.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/react-typescript/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/principles/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/standards/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/security/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/developer.agent.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.agent.md"))).toBe(true);
    expect(readFileSync(path.join(targetDir, "AgentSkills/agents/developer.agent.md"), "utf8")).toContain("React Developer");
    const reviewerContent = readFileSync(path.join(targetDir, "AgentSkills/agents/reviewer.agent.md"), "utf8");
    expect(reviewerContent).toContain("principles/SKILL.md");
    expect(reviewerContent).toContain("standards/SKILL.md");
    expect(reviewerContent).toContain("security/SKILL.md");
    expect(reviewerContent).not.toContain("$\\le");
    const agentsContent = readFileSync(path.join(targetDir, "AGENTS.md"), "utf8");
    expect(agentsContent).toContain("principles/SKILL.md");
    expect(agentsContent).toContain("standards/SKILL.md");
    expect(agentsContent).toContain("security/SKILL.md");
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

  it("hardlinks all selected agent entry points", () => {
    const targetDir = makeTempDir();
    installTemplate({
      force: false,
      hardlink: true,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("dotnet"),
    });

    expect(existsSync(path.join(targetDir, "AgentSkills/agents/developer.agent.md"))).toBe(true);
    expect(readFileSync(path.join(targetDir, "AgentSkills/agents/developer.agent.md"), "utf8")).toContain(".NET Developer");
    expect(existsSync(path.join(targetDir, "AgentSkills/agents/reviewer.agent.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/principles/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/standards/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills/skills/security/SKILL.md"))).toBe(true);
    const dotnetReviewer = readFileSync(path.join(targetDir, "AgentSkills/agents/reviewer.agent.md"), "utf8");
    expect(dotnetReviewer).toContain("principles/SKILL.md");
    expect(dotnetReviewer).toContain("standards/SKILL.md");
    expect(dotnetReviewer).toContain("security/SKILL.md");
    expect(dotnetReviewer).not.toContain("$\\le");

    const agentsPath = path.join(targetDir, "AGENTS.md");
    const claudePath = path.join(targetDir, "CLAUDE.md");
    expect(statSync(agentsPath).ino).toBe(statSync(claudePath).ino);

    const dotnetAgentsContent = readFileSync(agentsPath, "utf8");
    expect(dotnetAgentsContent).toContain("principles/SKILL.md");
    expect(dotnetAgentsContent).toContain("standards/SKILL.md");
    expect(dotnetAgentsContent).toContain("security/SKILL.md");

    writeFileSync(claudePath, "shared entry point");
    expect(readFileSync(agentsPath, "utf8")).toBe("shared entry point");
  });

  it("can install independent entry point copies", () => {
    const targetDir = makeTempDir();
    installTemplate({
      force: false,
      hardlink: false,
      sharedDir: resolveSharedTemplate(),
      targetDir,
      templateDir: resolveTemplate("dotnet"),
    });

    const agentsPath = path.join(targetDir, "AGENTS.md");
    const claudePath = path.join(targetDir, "CLAUDE.md");
    expect(statSync(agentsPath).ino).not.toBe(statSync(claudePath).ino);
  });
});
