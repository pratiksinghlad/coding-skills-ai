---
name: git-workflows
description: Review and improve Git workflows for safe collaboration. Use when shaping commits, splitting changes, resolving branch drift, preparing clean pull requests, inspecting repo state, or choosing the safest non-destructive Git commands for daily development.
---

# Git Workflows

## Overview

Use this skill to keep history understandable and collaboration low-drama. Prefer small reviewable commits, clear branch intent, and non-destructive cleanup over clever Git moves that are hard to explain afterward.

## Workflow

1. Inspect status, branch, and recent history before suggesting any cleanup.
2. Preserve uncommitted user work unless they explicitly ask for destructive operations.
3. Choose the least risky command that achieves the goal.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) when you need a quick repo-state summary.

## Daily Rules

- Keep commits focused on one logical change when possible.
- Separate refactors from behavior changes when that improves reviewability.
- Prefer `git switch`, `git restore`, and other modern, intention-revealing commands.
- Use rebase and force-push deliberately and only when the branch ownership is clear.

## Safety Rules

- Do not recommend destructive commands casually.
- Confirm the effect of stash, rebase, reset, and clean operations before using them.
- Check whether the worktree is dirty before changing branches or rewriting history.
- Preserve generated evidence that helps code review, such as tests, logs, and migration files, unless they are clearly accidental.

## Review Checklist

- Will the resulting branch be easier to review and merge?
- Are commits shaped around real user-facing or subsystem-facing intent?
- Is the proposed Git command safe for a shared branch?
- Have we protected local changes and avoided unnecessary history surgery?
