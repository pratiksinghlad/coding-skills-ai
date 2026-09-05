import path from "path";
import { describe, expect, it } from "vitest";
import { AGENT_NAMES, IDE_ENTRY_POINTS, parseAgentName } from "../src/core/ide-map.js";
import { resolveSharedTemplate, resolveTemplate, TEMPLATE_NAMES } from "../src/core/resolve-template.js";

describe("ide-map", () => {
  it("maps all supported agent names to their respective entry points", () => {
    expect(AGENT_NAMES).toEqual([
      "antigravity",
      "claude",
      "cline",
      "code",
      "codex",
      "copilot",
      "cursor",
    ]);
    expect(IDE_ENTRY_POINTS.cursor).toBe(".cursor/rules/instructions.md");
    expect(IDE_ENTRY_POINTS.code).toBe("AGENTS.md");
    expect(IDE_ENTRY_POINTS.codex).toBe("AGENTS.md");
    expect(IDE_ENTRY_POINTS.claude).toBe("CLAUDE.md");
    expect(IDE_ENTRY_POINTS.copilot).toBe(".github/copilot-instructions.md");
    expect(IDE_ENTRY_POINTS.antigravity).toBe(".agents/rules/GEMINI.md");
    expect(IDE_ENTRY_POINTS.cline).toBe(".clinerules");
  });

  it("parses valid agent names case-insensitively", () => {
    expect(parseAgentName("CURSOR")).toBe("cursor");
    expect(parseAgentName("Codex")).toBe("codex");
    expect(parseAgentName("CODE")).toBe("code");
    expect(parseAgentName("antigravity")).toBe("antigravity");
    expect(parseAgentName(undefined)).toBeUndefined();
  });

  it("throws for unknown agent names", () => {
    expect(() => parseAgentName("unknown-agent")).toThrowError(/Unknown agent "unknown-agent"/);
    expect(() => parseAgentName("windsurf")).toThrowError(/Unknown agent "windsurf"/);
  });
});

describe("resolve-template", () => {
  it("resolves valid template directories", () => {
    expect(TEMPLATE_NAMES).toEqual(["default", "dotnet", "react", "shared"]);
    expect(resolveTemplate("default")).toContain(path.join("templates", "default"));
    expect(resolveTemplate("dotnet")).toContain(path.join("templates", "dotnet"));
    expect(resolveTemplate("react")).toContain(path.join("templates", "react"));
    expect(resolveTemplate("shared")).toContain(path.join("templates", "shared"));
    expect(resolveSharedTemplate()).toContain(path.join("templates", "shared"));
  });

  it("throws for unknown template names", () => {
    expect(() => resolveTemplate("unknown-template")).toThrowError(/Unknown template "unknown-template"/);
  });
});
