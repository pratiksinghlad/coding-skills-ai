---
name: playwright-ui-testing
description: Add, review, and stabilize Playwright UI tests. Use when working on end-to-end browser tests, component-to-browser workflows, selectors, fixtures, auth setup, visual checks, flaky test triage, or regression coverage for web applications.
---

# Playwright UI Testing

## Overview

Use this skill to write browser tests that catch real regressions without becoming a maintenance tax. Prefer user-visible assertions, stable setup, and deterministic fixtures over brittle selector choreography.

## Workflow

1. Identify the user journey or regression being protected before writing selectors.
2. Prefer the smallest fixture and auth setup that still makes the test realistic.
3. Make failures easy to diagnose with good names, isolated assertions, and traces when needed.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Test Design Rules

- Assert on visible behavior, accessible roles, URLs, network outcomes, and stored state that matters to the user.
- Use `getByRole`, `getByLabel`, and other semantic selectors before falling back to test IDs.
- Keep one test focused on one meaningful scenario; split setup helpers out when duplication becomes noise.
- Freeze or stub external dependencies only when the real integration makes the test flaky or slow without adding signal.

## Flake Prevention Rules

- Wait for the condition you need, not arbitrary timeouts.
- Keep storage state, seeded users, and test data deterministic.
- Avoid cross-test dependence on mutated shared accounts or leftover browser state.
- Capture traces, screenshots, and console errors for failing runs when the repo supports it.

## Review Checklist

- Does the test describe a user behavior, not just an implementation detail?
- Are selectors resilient to layout and styling changes?
- Will this still pass in CI on a loaded runner?
- Is the failure output actionable for the next engineer?
