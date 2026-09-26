---
name: react-typescript
description: Use when typing React components, hooks, or state. Covers prop types, discriminated unions, and custom hook design.
---

# React & TypeScript Guidance

## Type Design & Component Contracts
- Define strict prop interfaces; avoid `any` or loose `Record<string, unknown>`.
- Use discriminated unions for distinct component states (e.g., `{ status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error }`).
- Explicitly type event handlers and custom hook return values (use `as const` for tuple returns).

## Custom Hook Guidelines
- Encapsulate reusable stateful logic into focused custom hooks prefixed with `use`.
- Keep hook parameter signatures clean (maximum 4 arguments; use options objects for complex configurations).
- Pass `AbortSignal` to asynchronous functions initiated inside hooks for safe cancellation.
- Return only stable handlers, derived state, and minimal state setters required by callers.

## Form & Input Patterns
- Prefer controlled inputs for dynamic form validation; use native form actions where appropriate.
- Bind labels to inputs using `htmlFor` and `id` generated via `useId` for SSR safety.
- Handle disabled, aria-invalid, and error message associations (`aria-describedby`) for robust UX.
