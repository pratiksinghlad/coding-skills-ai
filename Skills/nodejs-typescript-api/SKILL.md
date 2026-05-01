---
name: nodejs-typescript-api
description: Build, review, and harden Node.js and TypeScript backend services. Use when working on HTTP APIs, background jobs, validation, auth, queues, caching, streaming, observability, database access, or production readiness in JavaScript and TypeScript services.
---

# Node.js TypeScript API

## Overview

Use this skill to keep backend services explicit at the boundaries, predictable under load, and boring to operate. Prefer small, composable request pipelines over "magic" abstractions that hide validation, auth, or error handling.

## Workflow

1. Identify the runtime contract first: HTTP, queue consumer, scheduled job, stream, or webhook.
2. Trace data from input validation to side effects before changing handlers.
3. Keep transport concerns, business rules, and persistence concerns separate.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Service Rules

- Validate request shape at the edge and convert to domain-friendly types early.
- Keep route handlers thin; move orchestration into services or feature modules.
- Return stable error shapes and log enough structured context to debug production issues.
- Propagate cancellation and timeouts for outbound I/O where the stack supports it.
- Use streaming, batching, and pagination deliberately for large payloads.

## TypeScript Rules

- Prefer strict compiler settings and explicit return types on exported functions.
- Model nullable and optional states honestly instead of papering over them with casts.
- Avoid enum-heavy APIs when string unions or discriminated unions express the state better.
- Keep DTOs and persistence models separate when they evolve at different speeds.

## Operational Smells To Catch

- Missing input validation or auth checks in new endpoints.
- Fire-and-forget promises in request handlers.
- Shared mutable singleton state across requests.
- Retries without idempotency or backoff discipline.
- Blocking CPU-heavy work on the main event loop without queueing or worker offload.

## Review Checklist

- Is the contract clear at the boundary and well typed inside the service?
- Are logs, metrics, and failure modes good enough for on-call debugging?
- Will this hold up under concurrency, retries, and duplicate delivery?
- Are tests covering the happy path, validation failures, and at least one production-shaped edge case?
