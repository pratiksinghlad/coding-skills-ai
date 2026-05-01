---
name: docker-devops
description: Build, review, and optimize Docker-based development and delivery workflows. Use when working on Dockerfiles, compose files, container security, image size, build caching, multi-stage builds, local environments, deployment packaging, or operational readiness.
---

# Docker DevOps

## Overview

Use this skill to make container workflows predictable for developers and cheap to run in CI. Prefer explicit build stages, reproducible inputs, and narrow runtime images over "it works on my laptop" container stacks.

## Workflow

1. Identify whether the change affects image build, local orchestration, deployment packaging, or runtime behavior.
2. Separate build-time dependencies from runtime dependencies aggressively.
3. Optimize for repeatable builds first, then image size, then local convenience.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Build Rules

- Use multi-stage builds for compiled assets and SDK-heavy toolchains.
- Keep cache-friendly layers stable by copying dependency manifests before source where possible.
- Pin base images to supported families and patch levels appropriate to the repo.
- Keep secrets, SSH keys, and local config out of image layers and build history.

## Runtime Rules

- Run as a non-root user unless the workload has a clear reason not to.
- Expose only required ports, volumes, and capabilities.
- Make health checks meaningful instead of decorative.
- Keep compose files readable and environment-specific overrides deliberate.

## Review Checklist

- Does the image build reproducibly with minimal hidden machine assumptions?
- Is the runtime image smaller and less privileged than the build image?
- Are config, secrets, and local dev overrides kept out of committed images and defaults?
- Will the compose or deployment flow be understandable to the next engineer on-call?
