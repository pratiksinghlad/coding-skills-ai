---
name: github-actions-cicd
description: Design, review, and harden GitHub Actions CI/CD workflows. Use when working on workflow YAML, matrix builds, caching, environments, secrets, reusable workflows, deployment gates, artifact flows, or release automation in GitHub repositories.
---

# GitHub Actions CI/CD

## Overview

Use this skill to keep CI fast enough for daily use and strict enough to catch regressions before merge. Prefer small reusable workflows, explicit permissions, and deterministic caches over sprawling workflow files with hidden coupling.

## Workflow

1. Identify the workflow type first: PR validation, scheduled job, release, deployment, or reusable workflow.
2. Keep build, test, package, and deploy responsibilities separated unless the repo intentionally couples them.
3. Default permissions to least privilege and elevate only what the job needs.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Workflow Rules

- Use concurrency groups for long-running workflows that should not overlap.
- Prefer official actions and pinned major versions; pin more tightly for high-trust pipelines when the repo requires it.
- Cache only deterministic artifacts with clear invalidation keys.
- Keep environment promotion and secret usage explicit, especially for production deploys.

## CI/CD Smells To Catch

- PR workflows that can mutate releases or production state.
- Broad `permissions: write-all` defaults.
- Duplicate workflow logic that should be reusable.
- Caches that ignore lockfiles or target framework changes.
- Deployments that skip build or test artifacts produced earlier in the same pipeline.

## Review Checklist

- Is the workflow readable enough that a teammate can debug it at 2 a.m.?
- Are triggers, conditions, and protected environments aligned with the intent?
- Are caches safe, scoped, and worth their complexity?
- Does the pipeline fail fast on the cheapest high-signal checks?
