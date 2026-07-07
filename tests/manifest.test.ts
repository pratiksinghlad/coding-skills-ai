// tests/manifest.test.ts
// Unit tests for the manifest reader/validator.

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import path from "path";
import os from "os";
import { readManifest } from "../src/core/manifest.js";

function makeTempDir(): string {
  const dir = path.join(os.tmpdir(), `agent-skills-test-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe("readManifest", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("parses a valid manifest", () => {
    const manifest = {
      name: "@pratikpsl/agent-skills-dotnet",
      version: "0.1.0",
      skills: [
        { name: "core", description: "Core principles", path: "AgentSkills/skills/core" },
      ],
    };
    writeFileSync(path.join(tmpDir, "manifest.json"), JSON.stringify(manifest));
    const result = readManifest(tmpDir);
    expect(result.name).toBe("@pratikpsl/agent-skills-dotnet");
    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].name).toBe("core");
  });

  it("throws when manifest.json is missing", () => {
    expect(() => readManifest(tmpDir)).toThrowError(/manifest.json not found/);
  });

  it("throws when manifest.json is not valid JSON", () => {
    writeFileSync(path.join(tmpDir, "manifest.json"), "not json!");
    expect(() => readManifest(tmpDir)).toThrowError(/not valid JSON/);
  });

  it('throws when "name" field is missing', () => {
    const bad = { version: "0.1.0", skills: [] };
    writeFileSync(path.join(tmpDir, "manifest.json"), JSON.stringify(bad));
    expect(() => readManifest(tmpDir)).toThrowError(/missing required field "name"/);
  });

  it('throws when "skills" is not an array', () => {
    const bad = { name: "test", version: "0.1.0", skills: "not-an-array" };
    writeFileSync(path.join(tmpDir, "manifest.json"), JSON.stringify(bad));
    expect(() => readManifest(tmpDir)).toThrowError(/"skills" must be an array/);
  });

  it('throws when a skill entry is missing the "path" field', () => {
    const bad = {
      name: "test",
      version: "0.1.0",
      skills: [{ name: "core", description: "desc" }],
    };
    writeFileSync(path.join(tmpDir, "manifest.json"), JSON.stringify(bad));
    expect(() => readManifest(tmpDir)).toThrowError(/missing or has an empty "path" field/);
  });
});
