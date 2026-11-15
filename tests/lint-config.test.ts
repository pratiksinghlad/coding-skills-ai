import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { afterEach, describe, expect, it } from "vitest";
import { applyProjectLint, parseLintLanguage } from "../src/core/lint-config.js";

const tempDirs: string[] = [];
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function makeTempDir(): string {
  const directory = mkdtempSync(path.join(os.tmpdir(), "agent-skills-lint-"));
  tempDirs.push(directory);
  return directory;
}

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { force: true, recursive: true });
});

describe("applyProjectLint", () => {
  it("creates a strict tsconfig for an empty react project", () => {
    const targetDir = makeTempDir();
    const result = applyProjectLint({ force: false, language: "react", targetDir });
    const parsed = JSON.parse(readFileSync(path.join(targetDir, "tsconfig.json"), "utf8")) as {
      compilerOptions: { module: string; noEmit: boolean; noUncheckedIndexedAccess: boolean };
      include: string[];
    };

    expect(result.status).toBe("written");
    expect(parsed.compilerOptions.noUncheckedIndexedAccess).toBe(true);
    expect(parsed.compilerOptions.noEmit).toBe(true);
    expect(parsed.compilerOptions.module).toBe("esnext");
    expect(parsed.include).toEqual(["src"]);
  });

  it("fills missing TypeScript flags without overriding strict or module", () => {
    const targetDir = makeTempDir();
    writeFileSync(
      path.join(targetDir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { module: "Node16", strict: false } }, null, 2),
      "utf8",
    );

    applyProjectLint({ force: false, language: "react", targetDir });
    const parsed = JSON.parse(readFileSync(path.join(targetDir, "tsconfig.json"), "utf8")) as {
      compilerOptions: { module: string; noUncheckedIndexedAccess: boolean; strict: boolean };
    };

    expect(parsed.compilerOptions.strict).toBe(false);
    expect(parsed.compilerOptions.module).toBe("Node16");
    expect(parsed.compilerOptions.noUncheckedIndexedAccess).toBe(true);
  });

  it("raises strictness flags with force and keeps module, paths, and extends", () => {
    const targetDir = makeTempDir();
    writeFileSync(
      path.join(targetDir, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: { module: "Node16", paths: { "@app/*": ["src/*"] }, strict: false },
          extends: "./base.json",
        },
        null,
        2,
      ),
      "utf8",
    );

    applyProjectLint({ force: true, language: "react", targetDir });
    const parsed = JSON.parse(readFileSync(path.join(targetDir, "tsconfig.json"), "utf8")) as {
      compilerOptions: { module: string; paths: { "@app/*": string[] }; strict: boolean };
      extends: string;
    };

    expect(parsed.compilerOptions.strict).toBe(true);
    expect(parsed.compilerOptions.module).toBe("Node16");
    expect(parsed.compilerOptions.paths["@app/*"]).toEqual(["src/*"]);
    expect(parsed.extends).toBe("./base.json");
  });

  it("keeps comments while adding a missing TypeScript flag", () => {
    const targetDir = makeTempDir();
    writeFileSync(
      path.join(targetDir, "tsconfig.json"),
      '{\n  // keep\n  "compilerOptions": {\n    "strict": false,\n    "module": "Node16"\n  }\n}\n',
      "utf8",
    );

    applyProjectLint({ force: false, language: "react", targetDir });
    const text = readFileSync(path.join(targetDir, "tsconfig.json"), "utf8");

    expect(text).toContain("// keep");
    expect(text).toContain('"module": "Node16"');
    expect(text).toContain('"strict": false');
    expect(text).toContain('"noUncheckedIndexedAccess": true');
  });

  it("skips a tsconfig that cannot be parsed", () => {
    const targetDir = makeTempDir();
    const filePath = path.join(targetDir, "tsconfig.json");
    writeFileSync(filePath, "{", "utf8");

    const result = applyProjectLint({ force: false, language: "react", targetDir });

    expect(result.status).toBe("skipped");
    expect(readFileSync(filePath, "utf8")).toBe("{");
  });

  it("creates ruff tables for an empty python project", () => {
    const targetDir = makeTempDir();
    const result = applyProjectLint({ force: false, language: "python", targetDir });
    const text = readFileSync(path.join(targetDir, "pyproject.toml"), "utf8");

    expect(result.status).toBe("written");
    expect(text).toContain("[tool.ruff]");
    expect(text).toContain('select = ["E", "F", "I", "UP", "N", "ANN"]');
  });

  it("unions ruff select codes and keeps the project table", () => {
    const targetDir = makeTempDir();
    writeFileSync(
      path.join(targetDir, "pyproject.toml"),
      '[project]\nname = "demo"\n\n[tool.ruff.lint]\nselect = ["E"]\n',
      "utf8",
    );

    applyProjectLint({ force: false, language: "python", targetDir });
    const text = readFileSync(path.join(targetDir, "pyproject.toml"), "utf8");

    expect(text).toContain('name = "demo"');
    expect(text).toContain('select = ["E", "F", "I", "UP", "N", "ANN"]');
  });

  it("leaves an existing quote style unless force is set", () => {
    const targetDir = makeTempDir();
    const source = '[tool.ruff]\nline-length = 100\n\n[tool.ruff.format]\nquote-style = "single"\n';
    writeFileSync(path.join(targetDir, "pyproject.toml"), source, "utf8");

    applyProjectLint({ force: false, language: "python", targetDir });
    const filled = readFileSync(path.join(targetDir, "pyproject.toml"), "utf8");
    expect(filled).toContain("line-length = 100");
    expect(filled).toContain('quote-style = "single"');

    applyProjectLint({ force: true, language: "python", targetDir });
    const forced = readFileSync(path.join(targetDir, "pyproject.toml"), "utf8");
    expect(forced).toContain("line-length = 100");
    expect(forced).toContain('quote-style = "double"');
  });

  it("rejects a lint language other than react or python", () => {
    expect(() => parseLintLanguage("rust")).toThrowError(/react, python/);
  });
});

describe("lint instructions", () => {
  it("tells every task to read the project lint config before editing", () => {
    const operating = readFileSync(path.join(repoRoot, "templates/shared/AgentSkills/OPERATING.md"), "utf8");
    const react = readFileSync(path.join(repoRoot, "templates/react/AgentSkills/skills/react-typescript/SKILL.md"), "utf8");
    const python = readFileSync(path.join(repoRoot, "templates/python/AgentSkills/skills/python-standards/SKILL.md"), "utf8");

    expect(operating).toContain(
      "Read the project lint config before editing, and obey it for the whole change (`tsconfig.json`, `pyproject.toml`, `Cargo.toml`, `.editorconfig`, and the same kind of file for any other language).",
    );
    expect(react).toContain("compilerOptions");
    expect(react).toContain("tsc --noEmit");
    expect(python).toContain("[tool.ruff]");
    expect(python).toContain('"N"');
    expect(existsSync(path.join(repoRoot, "scripts"))).toBe(false);
  });
});
