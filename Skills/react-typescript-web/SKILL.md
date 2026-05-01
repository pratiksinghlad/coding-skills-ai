---
name: react-typescript-web
description: Build, review, and refactor React and TypeScript web applications. Use when working on components, hooks, state management, forms, routing, accessibility, responsive design, rendering performance, browser APIs, or front-end architecture in modern web apps.
---

# React TypeScript Web

## Overview

Use this skill to ship React UI that stays accessible, fast, and responsive after real-world state and layout complexity show up. Keep the component tree readable and let data flow, rendering, and CSS each own their job.

## Workflow

1. Identify the rendering boundary: route, feature shell, server/client split, or leaf component.
2. Review state ownership before changing hooks or introducing a new library.
3. Check responsive behavior and keyboard access for every meaningful UI change.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Component Rules

- Keep components small enough that data dependencies and side effects are obvious.
- Prefer derived state over duplicated state.
- Treat `useEffect` as a synchronization tool, not a generic “run code later” escape hatch.
- Use semantic HTML first, then add ARIA only when native semantics are insufficient.
- Keep forms controlled when validation, masking, or conditional UI needs it; otherwise stay simple.

## Responsive Design Rules

- Design for narrow screens first, then grow into larger layouts.
- Use layout primitives that adapt naturally: flex, grid, logical spacing, fluid type, and container-aware widths.
- Avoid fixed heights for content-driven panels unless the UX explicitly calls for scrolling regions.
- Test hover-only affordances against touch devices and keyboard navigation.

## Performance Rules

- Profile before adding memoization; do not carpet-bomb the tree with `useMemo` and `useCallback`.
- Split heavy routes and editor-grade features to keep initial loads sharp.
- Defer non-urgent work and large list rendering when user input needs to stay responsive.
- Keep async data loading and optimistic UI localized to the feature that owns it.

## Review Checklist

- Can another engineer find the source of truth for this UI state quickly?
- Does the layout stay usable on phone, tablet, and wide desktop sizes?
- Are focus order, labels, and error messaging intact?
- Are expensive renders, stale effects, or unnecessary refetches being introduced?
