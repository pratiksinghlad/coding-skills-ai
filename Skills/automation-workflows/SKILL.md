---
name: automation-workflows
description: Design, review, and simplify developer automation. Use when working on scripts, task runners, scaffolding commands, local setup flows, repo maintenance jobs, scheduled automation, or repeatable workflows that should be easy for coding agents and humans to run safely.
---

# Automation Workflows

## Overview

Use this skill to turn repetitive repo work into reliable commands that teammates and coding agents can actually trust. Prefer discoverable, composable automation over one-off shell snippets hidden in chat history.

## Workflow

1. Identify the repeated task and the minimum safe contract for running it.
2. Choose the narrowest tool that fits: script, task runner target, make command, npm script, or CI workflow.
3. Make inputs explicit, defaults safe, and failure messages actionable.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Automation Rules

- Keep scripts idempotent where practical.
- Fail fast on missing prerequisites and clearly describe how to fix them.
- Prefer checked-in scripts over hand-typed shell recipes for recurring work.
- Keep destructive actions opt-in, never the default.

## Agent-Friendly Rules

- Make commands easy to discover from repo root.
- Use stable file paths and predictable output.
- Avoid interactive prompts unless the workflow truly requires them.
- Prefer one command that validates the change over five commands that the user must remember.

## Review Checklist

- Can a teammate or agent run this without tribal knowledge?
- Are side effects and prerequisites obvious from the command surface?
- Does the script fail safely when the repo state is unexpected?
- Will the automation still make sense six months from now?
