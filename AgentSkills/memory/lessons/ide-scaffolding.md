# IDE Scaffolding Lessons

- Dynamic entry point generation: Never rely on OS hardlinks across divergent IDE entry points; generate each entry point dynamically with required frontmatter and relative link references to avoid path breakage in nested agent directories (.agents/rules, .cursor/rules).
- Conditional canonical links: When generating agent entry points dynamically on request, only link to AGENTS.md if it exists or is being created during installation to prevent dangling broken links in single-agent environments.
- Dynamic generation with hardlinks: Dynamically generate tailored content per IDE entry point (handling frontmatter and nested relative paths), while hardlinking matching entry points that share identical content (with copy/write fallback on unsupported filesystems) to keep shared guidance synchronized across tools without breaking nested agents.
- Standard agent naming and shared scaffolding: Agent persona guidance files under AgentSkills/agents/ follow standard .md naming rather than compound .agent.md extensions, and agent-specific CLI commands scaffold the shared skills structure alongside the agent entry point to prevent dangling references to review skills and personas.

