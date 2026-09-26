# IDE Scaffolding Lessons

- Install Cursor skills at `.cursor/skills/<skill-name>/SKILL.md`. The frontmatter `name` must match the folder, and `description` must say when to use the skill.
- Keep the product Cursor-only. Do not add multi-IDE entry points, hardlinks, or an `AgentSkills/` install root.
- Ship architect, reviewer, and developer guidance as skills, and keep the operating contract in the `operating` skill.
- Point agents at skills with a short `.cursor/rules/*.mdc` file. Do not dump the full guidance into an always-on rule, and do not add index-only files Cursor will not load.
