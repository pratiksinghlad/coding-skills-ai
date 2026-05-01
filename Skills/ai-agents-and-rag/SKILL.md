---
name: ai-agents-and-rag
description: Design, review, and improve AI agent and RAG systems, including local LLM stacks like Ollama. Use when working on retrieval pipelines, embeddings, chunking, prompt orchestration, tool calling, evaluation, context windows, grounding, or developer-facing AI workflows.
---

# AI Agents And RAG

## Overview

Use this skill to keep agentic systems grounded, inspectable, and cheap enough to operate. Prefer observable pipelines with explicit retrieval and tool boundaries over giant prompts that "kind of work" until they do not.

## Workflow

1. Identify the system shape first: chat app, coding agent, retrieval QA, workflow automation, or local-LLM desktop flow.
2. Separate model choice, retrieval strategy, prompt design, tool execution, and evaluation concerns.
3. Optimize for traceability before chasing benchmark demos.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## RAG Rules

- Index content that is authoritative, current, and permission-appropriate.
- Tune chunking to preserve meaning boundaries, not only token counts.
- Store enough metadata to explain why a chunk was retrieved and whether it should be trusted.
- Keep retrieval, reranking, and answer synthesis measurable as separate stages.

## Agent Rules

- Make tool contracts explicit and easy to validate.
- Guard stateful or side-effecting actions with narrow scopes, retries, and good logs.
- Prefer deterministic post-processing and structured output where downstream systems depend on it.
- Treat local model stacks such as Ollama as runtime options, not excuses to skip evaluation or guardrails.

## Smells To Catch

- Prompt-only systems pretending to be retrieval systems.
- Overlong context stuffing with no evidence it improves answers.
- Tool loops with weak stop conditions or poor error recovery.
- No golden datasets, eval harness, or user-feedback loop for regression tracking.

## Review Checklist

- Can we explain why this answer or action happened?
- Are retrieval inputs, prompts, tools, and outputs all observable?
- Does the architecture support local models, hosted models, or both without hidden coupling?
- Is there an evaluation story strong enough to catch regressions after prompt or model changes?
