// src/core/manifest.ts
// Reads and validates a pack's manifest.json, or auto-discovers skills from disk
// when manifest.json is not present.

import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";
import { IDE_ENTRY_POINT_MAP } from "./ide-map.js";

export interface SkillEntry {
  /** Short identifier used as a CLI argument. */
  name: string;
  /** Human-readable purpose of the skill. */
  description: string;
  /** Source path of the skill, relative to the pack root. */
  path: string;
  /** Destination path in the target project, relative to the project root. */
  dest?: string;
}

export interface Manifest {
  /** Package name. */
  name: string;
  /** Semver string. */
  version: string;
  /** All skills provided by this pack. */
  skills: SkillEntry[];
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  OPERATING: "Shared operating contract: bootstrap sequence, working rules, completion gate for all agents.",
  agents: "Agent persona definitions: architect (design/CQRS) and developer (.NET C# implementation).",
  memory: "Persistent agent memory: domain lesson files and memory schema for learning loops.",
  instructions: "Canonical single-file coding agent instructions (Goal, Principles, Definition of Done).",
};

const IDE_DESTINATIONS: Record<string, string> = {
  "entry-point:claude": "CLAUDE.md",
  "entry-point:codex": "AGENTS.md",
  "entry-point:copilot": ".github/copilot-instructions.md",
  "entry-point:cursor": ".cursor/rules/instructions.md",
  "entry-point:antigravity": ".agents/GEMINI.md",
  "entry-point:windsurf": ".windsurfrules",
  "entry-point:cline": ".clinerules",
};

function parseSkillDescription(skillDir: string, skillName: string): string {
  const skillFile = path.join(skillDir, "SKILL.md");
  if (existsSync(skillFile)) {
    try {
      const raw = readFileSync(skillFile, "utf8");
      const match = raw.match(/^description:\s*(?:>|\|)?\s*\n?([^\n\r]+)/m);
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_DESCRIPTIONS[skillName] ?? `Skill definition for ${skillName}.`;
}

function discoverIdeEntryPoints(entryPointSrc: string): SkillEntry[] {
  const skills: SkillEntry[] = [];
  for (const [ide, skillName] of Object.entries(IDE_ENTRY_POINT_MAP)) {
    skills.push({
      name: skillName,
      description: `Lightweight ${ide} entry point.`,
      path: entryPointSrc,
      dest: IDE_DESTINATIONS[skillName],
    });
  }
  return skills;
}

function discoverAgentSkills(packDir: string): SkillEntry[] {
  const skills: SkillEntry[] = [];
  const agentSkillsDir = path.join(packDir, "AgentSkills");

  if (existsSync(path.join(agentSkillsDir, "OPERATING.md"))) {
    skills.push({
      name: "OPERATING",
      description: DEFAULT_DESCRIPTIONS.OPERATING,
      path: "AgentSkills/OPERATING.md",
    });
  }

  const skillsSubdir = path.join(agentSkillsDir, "skills");
  if (existsSync(skillsSubdir)) {
    const entries = readdirSync(skillsSubdir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullSkillDir = path.join(skillsSubdir, entry.name);
        skills.push({
          name: entry.name,
          description: parseSkillDescription(fullSkillDir, entry.name),
          path: `AgentSkills/skills/${entry.name}`,
        });
      }
    }
  }

  for (const item of ["agents", "memory"]) {
    if (existsSync(path.join(agentSkillsDir, item))) {
      skills.push({
        name: item,
        description: DEFAULT_DESCRIPTIONS[item] ?? `${item} definitions.`,
        path: `AgentSkills/${item}`,
      });
    }
  }

  const epFile = path.join(agentSkillsDir, "entry-points", "entry-point.md");
  if (existsSync(epFile)) {
    skills.push(...discoverIdeEntryPoints("AgentSkills/entry-points/entry-point.md"));
  }

  return skills;
}

export function discoverSkills(packDir: string): SkillEntry[] {
  if (existsSync(path.join(packDir, "AgentSkills"))) {
    return discoverAgentSkills(packDir);
  }

  if (existsSync(path.join(packDir, "instructions.md"))) {
    return [
      {
        name: "instructions",
        description: DEFAULT_DESCRIPTIONS.instructions,
        path: "instructions.md",
        dest: "AGENTS.md",
      },
      ...discoverIdeEntryPoints("instructions.md"),
    ];
  }

  throw new Error(`No recognized skills or instructions found in "${packDir}".`);
}

export function readManifest(packDir: string): Manifest {
  const localManifestPath = path.join(packDir, "manifest.json");
  const sharedManifestPath = path.join(packDir, "..", "shared", "manifest.json");

  const targetPath = existsSync(localManifestPath)
    ? localManifestPath
    : existsSync(sharedManifestPath) && existsSync(path.join(packDir, "instructions.md"))
      ? sharedManifestPath
      : undefined;

  if (!targetPath) {
    return {
      name: "@pratikpsl/agent-skills",
      version: "0.8.0",
      skills: discoverSkills(packDir),
    };
  }

  let raw: string;
  try {
    raw = readFileSync(targetPath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) {
      raw = raw.slice(1);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not read manifest.json: ${message}`);
  }

  let manifest: unknown;
  try {
    manifest = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `manifest.json at "${targetPath}" is not valid JSON: ${message}`,
    );
  }

  validateManifest(manifest, targetPath);
  return manifest as Manifest;
}

function validateManifest(manifest: unknown, filePath: string): void {
  if (typeof manifest !== "object" || manifest === null) {
    throw new Error(`manifest.json at "${filePath}" must be a JSON object.`);
  }

  const obj = manifest as Record<string, unknown>;
  const required = ["name", "version", "skills"] as const;
  for (const key of required) {
    if (!(key in obj)) {
      throw new Error(`manifest.json is missing required field "${key}".`);
    }
  }

  if (!Array.isArray(obj.skills)) {
    throw new Error(`manifest.json "skills" must be an array.`);
  }

  for (const [i, skill] of (obj.skills as unknown[]).entries()) {
    const entry = skill as Record<string, unknown>;
    for (const field of ["name", "description", "path"] as const) {
      if (typeof entry[field] !== "string" || !(entry[field] as string).trim()) {
        throw new Error(
          `manifest.json skills[${i}] is missing or has an empty "${field}" field.`,
        );
      }
    }
    if (
      "dest" in entry &&
      (typeof entry.dest !== "string" || !entry.dest.trim())
    ) {
      throw new Error(
        `manifest.json skills[${i}] has an invalid "dest" field — must be a non-empty string when present.`,
      );
    }
  }
}
