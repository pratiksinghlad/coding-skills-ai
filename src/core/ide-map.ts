export const IDE_ENTRY_POINTS: Record<string, string> = {
  antigravity: ".agents/GEMINI.md",
  claude: "CLAUDE.md",
  cline: ".clinerules",
  codex: "AGENTS.md",
  copilot: ".github/copilot-instructions.md",
  cursor: ".cursor/rules/instructions.md",
  windsurf: ".windsurfrules",
};

export const AGENT_NAMES = Object.keys(IDE_ENTRY_POINTS);

export function parseAgentName(value?: string): string | undefined {
  if (!value) return undefined;
  const agent = value.toLowerCase();
  if (agent in IDE_ENTRY_POINTS) return agent;
  throw new Error(`Unknown agent "${value}". Choose: ${AGENT_NAMES.join(", ")}.`);
}

