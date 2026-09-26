import path from "path";
import { describe, expect, it } from "vitest";
import { resolveSharedTemplate, resolveTemplate, TEMPLATE_NAMES } from "../src/core/resolve-template.js";

describe("resolve-template", () => {
  it("resolves bundled Cursor skill templates", () => {
    expect(TEMPLATE_NAMES).toEqual(["dotnet", "python", "react", "rust", "shared"]);
    expect(resolveTemplate("dotnet")).toContain(path.join("templates", "dotnet"));
    expect(resolveTemplate("Python")).toContain(path.join("templates", "python"));
    expect(resolveTemplate("react")).toContain(path.join("templates", "react"));
    expect(resolveTemplate("rust")).toContain(path.join("templates", "rust"));
    expect(resolveTemplate("shared")).toContain(path.join("templates", "shared"));
    expect(resolveSharedTemplate()).toContain(path.join("templates", "shared"));
  });

  it("rejects unknown templates", () => {
    expect(() => resolveTemplate("unknown-template")).toThrowError(/Unknown template "unknown-template"/);
  });

  it("rejects removed multi-IDE agent names", () => {
    expect(() => resolveTemplate("cursor")).toThrowError(/no longer an install target/);
    expect(() => resolveTemplate("Claude")).toThrowError(/no longer an install target/);
    expect(() => resolveTemplate("codex")).toThrowError(/no longer an install target/);
    expect(() => resolveTemplate("antigravity")).toThrowError(/no longer an install target/);
  });

  it("rejects the removed default template", () => {
    expect(() => resolveTemplate("default")).toThrowError(/"default" template was removed/);
  });
});
