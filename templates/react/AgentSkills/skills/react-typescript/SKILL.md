---
name: react-typescript
description: >
  Load on every React, TypeScript, or JavaScript change. AI agents use this
  when writing, reviewing, or refactoring React, TypeScript, and JavaScript:
  strict types, component props, discriminated unions, custom hooks, and forms.
compatibility: Requires TypeScript with strict enabled and React 18 or newer. Typecheck with tsc --noEmit and lint with the project's ESLint.
---

# React and TypeScript Standards

AI agents load this file on every React, TypeScript, or JavaScript edit, with shared principles and standards. Apply these rules while writing.

## TypeScript
- Keep `strict` enabled. Do not use `any`. Use `unknown` and narrow it.
- Export the props type and the return type of every public component and hook.

## Component Contracts
- Type props with an interface or type alias. Avoid a loose `Record<string, unknown>`.
- Model states that differ in shape as a discriminated union (`{ status: "loading" } | { status: "success"; data: T } | { status: "error"; error: Error }`).
- Type event handlers. For a hook tuple return, use `as const`.

## Custom Hooks
- Put reusable state in a hook named `useSomething`.
- Keep the parameter list to four. Pass an options object past that.
- Pass an `AbortSignal` into async work started by the hook.
- Return stable handlers, derived state, and only the setters the caller needs.

## Forms
- Use a controlled input when validation is dynamic. Use a native form action when the platform covers it.
- Bind each label with `htmlFor` and an `id` from `useId`.
- Wire `aria-invalid` and `aria-describedby` to the error message.

## Review Checklist
- [ ] `strict` is on. New code has no `any`.
- [ ] States with different shapes use a discriminated union.
- [ ] Hooks start with `use`, stay within four parameters, and return stable values.
- [ ] Async work in a hook accepts an `AbortSignal`.
- [ ] Inputs have labels, and errors are referenced with `aria-describedby`.

## Verify
After TypeScript, JavaScript, or React edits, run the project's typecheck, ESLint, and framework build. Fix what they report.

Add or run tests only when the user asks. Then load the `testing` skill and run the project's test script.
