// tests/list.test.js
// Integration-style test: verifies that list output matches manifest contents.
// We don't spawn the CLI process — instead we call the underlying core functions
// that the list command uses, which is the behaviour that matters.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import path from 'path';
import os from 'os';
import { readManifest } from '../cli/core/manifest.js';

function makeTempDir() {
  const dir = path.join(os.tmpdir(), `agent-skills-list-test-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe('list — manifest content matches output data', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns all skills declared in manifest', () => {
    const manifest = {
      name: '@pratikpsl/agent-skills-dotnet',
      version: '0.1.0',
      skills: [
        { name: 'core', description: 'Core principles', path: 'AgentSkills/skills/core' },
        { name: 'design', description: 'Design principles', path: 'AgentSkills/skills/design' },
        { name: 'dotnet-api', description: '.NET API rules', path: 'AgentSkills/skills/dotnet-api' },
      ],
    };
    writeFileSync(path.join(tmpDir, 'manifest.json'), JSON.stringify(manifest));

    const result = readManifest(tmpDir);

    // The list command renders result.skills — verify the data is identical.
    expect(result.skills.map((s) => s.name)).toEqual(['core', 'design', 'dotnet-api']);
    expect(result.skills.every((s) => typeof s.description === 'string')).toBe(true);
    expect(result.name).toBe(manifest.name);
    expect(result.version).toBe(manifest.version);
  });
});
