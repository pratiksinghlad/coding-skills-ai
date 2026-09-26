import { execFileSync } from "child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { afterEach, describe, expect, it } from "vitest";
import { installTemplate } from "../src/core/install-template.js";
import { resolveSharedTemplate, resolveTemplate } from "../src/core/resolve-template.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempDirs: string[] = [];

function makeTempDir(): string {
  const directory = mkdtempSync(path.join(os.tmpdir(), "agent-skills-"));
  tempDirs.push(directory);
  return directory;
}

function install(targetDir: string, template = "react", force = false) {
  return installTemplate({
    force,
    sharedDir: resolveSharedTemplate(),
    targetDir,
    templateDir: resolveTemplate(template),
  });
}

function skill(targetDir: string, name: string): string {
  return path.join(targetDir, ".cursor", "skills", name, "SKILL.md");
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function readFrontmatter(content: string): { name: string; description: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("missing frontmatter");
  const block = match[1];
  const name = block.match(/^name:\s*(\S+)\s*$/m)?.[1];
  if (!name) throw new Error(`missing name in:\n${block}`);

  const lines = block.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith("description:"));
  if (start < 0) throw new Error("missing description");
  const inline = lines[start].slice("description:".length).trim();
  let description = inline;
  if (inline === ">" || inline === "|" || inline === "") {
    const folded: string[] = [];
    for (const line of lines.slice(start + 1)) {
      if (/^[A-Za-z0-9_-]+:/.test(line)) break;
      if (line.trim()) folded.push(line.trim());
    }
    description = folded.join(" ");
  }
  description = description.replace(/^["']|["']$/g, "").trim();
  return { name, description };
}

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { force: true, recursive: true });
});

describe("skill frontmatter", () => {
  it("gives every bundled skill a name that matches its folder and a when-to-use description", () => {
    const skillFiles = walk(path.join(repoRoot, "templates")).filter((file) => file.endsWith(`${path.sep}SKILL.md`));
    expect(skillFiles.length).toBeGreaterThan(0);

    for (const file of skillFiles) {
      const folder = path.basename(path.dirname(file));
      const { name, description } = readFrontmatter(readFileSync(file, "utf8"));
      expect(name, file).toBe(folder);
      expect(name, file).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(description.length, file).toBeGreaterThan(20);
      expect(description, file).toMatch(/use when|load when/i);
    }
  });
});

describe("installTemplate", () => {
  it("installs shared Cursor skills and a thin always-on rule", () => {
    const targetDir = makeTempDir();
    install(targetDir, "shared");

    for (const name of ["operating", "principles", "standards", "security", "review", "architect", "reviewer"]) {
      expect(existsSync(skill(targetDir, name)), name).toBe(true);
    }

    const operating = readFileSync(skill(targetDir, "operating"), "utf8");
    expect(operating).toContain("name: operating");
    expect(operating).toContain("architect");
    expect(operating).toContain("reviewer");
    expect(operating).toContain(".cursor/skills/");

    const rulePath = path.join(targetDir, ".cursor", "rules", "agent-skills.mdc");
    const rule = readFileSync(rulePath, "utf8");
    expect(rule).toContain("alwaysApply: true");
    expect(rule).toContain(".cursor/skills/");
    expect(rule).toContain("operating");
    expect(rule.length).toBeLessThan(500);

    expect(existsSync(path.join(targetDir, "AgentSkills"))).toBe(false);
    expect(existsSync(path.join(targetDir, "AGENTS.md"))).toBe(false);
    expect(existsSync(path.join(targetDir, ".cursor", "rules", "instructions.md"))).toBe(false);
    expect(existsSync(path.join(targetDir, ".agents", "rules", "GEMINI.md"))).toBe(false);
    expect(existsSync(path.join(targetDir, ".github", "copilot-instructions.md"))).toBe(false);
    expect(existsSync(path.join(targetDir, ".clinerules"))).toBe(false);
    expect(walk(path.join(targetDir, ".cursor", "skills")).some((file) => file.endsWith("index.md"))).toBe(false);
  });

  it("merges a language template over shared skills", () => {
    const targetDir = makeTempDir();
    install(targetDir, "react");

    expect(readFileSync(skill(targetDir, "developer"), "utf8")).toContain("React Developer");
    expect(readFileSync(skill(targetDir, "architect"), "utf8")).toContain("Architect Guidance");
    expect(readFileSync(skill(targetDir, "react-typescript"), "utf8")).toContain("name: react-typescript");
    expect(existsSync(skill(targetDir, "testing"))).toBe(true);
    expect(existsSync(skill(targetDir, "performance"))).toBe(true);
    expect(existsSync(skill(targetDir, "principles"))).toBe(true);
    expect(existsSync(path.join(targetDir, "shared"))).toBe(false);
  });

  it("lets stack architect and developer skills replace the shared roles", () => {
    const dotnetDir = makeTempDir();
    install(dotnetDir, "dotnet");
    expect(readFileSync(skill(dotnetDir, "developer"), "utf8")).toContain(".NET Developer");
    expect(readFileSync(skill(dotnetDir, "architect"), "utf8")).toContain(".NET Architect");
    expect(existsSync(skill(dotnetDir, "dotnet-best-practices"))).toBe(true);
    expect(existsSync(skill(dotnetDir, "csharp-xunit"))).toBe(true);
    expect(readFileSync(skill(dotnetDir, "reviewer"), "utf8")).toContain(".cursor/skills/review/SKILL.md");

    const pythonDir = makeTempDir();
    install(pythonDir, "python");
    expect(readFileSync(skill(pythonDir, "developer"), "utf8")).toContain("Python Developer");
    expect(readFileSync(skill(pythonDir, "architect"), "utf8")).toContain("Python Architect");
    expect(readFileSync(skill(pythonDir, "python-typing"), "utf8")).toContain("pydantic");
    expect(readFileSync(skill(pythonDir, "python-best-practices"), "utf8")).toContain("uv");

    const rustDir = makeTempDir();
    install(rustDir, "rust");
    expect(readFileSync(skill(rustDir, "developer"), "utf8")).toContain("Rust Developer");
    expect(readFileSync(skill(rustDir, "architect"), "utf8")).toContain("Rust Architect");
    expect(readFileSync(skill(rustDir, "rust-ownership"), "utf8")).toContain("unwrap()");
    expect(readFileSync(skill(rustDir, "rust-best-practices"), "utf8")).toContain("clippy");
  });

  it("preserves an installed skill unless force is requested", () => {
    const targetDir = makeTempDir();
    const existingFile = skill(targetDir, "operating");
    mkdirSync(path.dirname(existingFile), { recursive: true });
    writeFileSync(existingFile, "custom operating contract");

    const skipped = install(targetDir, "shared");
    expect(skipped.skipped).toContain(".cursor/skills/operating/SKILL.md");
    expect(readFileSync(existingFile, "utf8")).toBe("custom operating contract");

    const forced = install(targetDir, "dotnet", true);
    expect(forced.written).toContain(".cursor/skills/operating/SKILL.md");
    expect(forced.written).toContain(".cursor/skills/architect/SKILL.md");
    expect(readFileSync(existingFile, "utf8")).toContain("name: operating");
    expect(readFileSync(skill(targetDir, "architect"), "utf8")).toContain(".NET Architect");
  });

  it("copies nested skill references, scripts, and assets", () => {
    const targetDir = makeTempDir();
    const sharedDir = makeTempDir();
    const skillDir = path.join(sharedDir, "skills", "example");
    mkdirSync(path.join(skillDir, "references"), { recursive: true });
    mkdirSync(path.join(skillDir, "scripts"), { recursive: true });
    mkdirSync(path.join(skillDir, "assets"), { recursive: true });
    writeFileSync(
      path.join(skillDir, "SKILL.md"),
      "---\nname: example\ndescription: Use when exercising nested skill files.\n---\n\n# Example\n",
    );
    writeFileSync(path.join(skillDir, "references", "note.md"), "nested reference");
    writeFileSync(path.join(skillDir, "scripts", "check.sh"), "echo ok\n");
    writeFileSync(path.join(skillDir, "assets", "diagram.txt"), "box\n");

    installTemplate({
      force: false,
      sharedDir,
      targetDir,
      templateDir: sharedDir,
    });

    const installed = path.join(targetDir, ".cursor", "skills", "example");
    expect(readFileSync(path.join(installed, "SKILL.md"), "utf8")).toContain("name: example");
    expect(readFileSync(path.join(installed, "references", "note.md"), "utf8")).toBe("nested reference");
    expect(readFileSync(path.join(installed, "scripts", "check.sh"), "utf8")).toBe("echo ok\n");
    expect(readFileSync(path.join(installed, "assets", "diagram.txt"), "utf8")).toBe("box\n");
    expect(existsSync(path.join(targetDir, ".cursor", "rules", "agent-skills.mdc"))).toBe(false);
  });

  it("installs through the CLI into --path", () => {
    const targetDir = makeTempDir();
    const output = execFileSync(
      "bun",
      ["src/bin/agent-skills.ts", "dotnet", "--path", targetDir],
      { cwd: repoRoot, encoding: "utf8" },
    );

    expect(output).toContain("Installed dotnet Cursor skills:");
    expect(existsSync(skill(targetDir, "dotnet-api"))).toBe(true);
    expect(existsSync(skill(targetDir, "operating"))).toBe(true);
    expect(existsSync(path.join(targetDir, ".cursor", "rules", "agent-skills.mdc"))).toBe(true);
    expect(existsSync(path.join(targetDir, "AgentSkills"))).toBe(false);
  });
});
