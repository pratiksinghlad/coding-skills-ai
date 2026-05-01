---
name: ef-core-and-linq
description: Implement, review, and tune EF Core and LINQ data-access code. Use when working with DbContext, entity mapping, migrations, projections, Include chains, transactions, tracking, query shape, pagination, concurrency tokens, or N+1 query problems in .NET applications.
---

# EF Core And LINQ

## Overview

Use this skill to keep data access explicit, observable, and efficient. Prefer shaping queries to match the exact read or write path instead of relying on broad entity graphs or hidden lazy-loading behavior.

## Workflow

1. Identify whether the task is read-heavy, write-heavy, migration-related, or a correctness bug.
2. Inspect the query shape and the entity model together before changing either one.
3. Preserve provider-specific behavior already in use unless it is the root cause of the issue.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Query Design Rules

- Project to DTOs or anonymous types for read models instead of materializing full aggregates by default.
- Use `AsNoTracking()` for read-only flows and `AsNoTrackingWithIdentityResolution()` only when identity fix-up materially helps.
- Apply `Where`, `OrderBy`, and `Select` before materialization.
- Page large result sets explicitly; never rely on implicit client-side truncation.
- Use filtered includes sparingly and prefer explicit projections when the query becomes hard to reason about.

## EF Core Rules

- Keep `DbContext` short-lived and scoped to the unit of work.
- Configure indexes, required relationships, precision, max lengths, and concurrency tokens in the model instead of assuming database defaults.
- Prefer explicit transactions only when the operation crosses multiple save boundaries or external resources.
- Keep migrations deterministic and review generated SQL when the schema change is non-trivial.
- Avoid lazy loading unless the codebase is already designed around it and the cost is understood.
- Select only field required by user interface, not entire entities. Use `Select` to shape the data as close to the final form as possible before materialization.

## Smells To Catch

- N+1 queries caused by navigation access inside loops.
- Client-side evaluation sneaking in through unsupported methods or early materialization.
- Huge `Include` graphs when a small projection would do.
- Tracking large collections in request paths that only read data.
- `SaveChanges` calls inside loops instead of batching logical units of work.

## Review Checklist

- Does the query express the business need with the minimum required shape?
- Are indexes, uniqueness, and concurrency handled deliberately?
- Will the change behave correctly under realistic row counts and not just seed data?
- Are tests or logs verifying SQL shape, pagination, and update conflicts where it matters?
