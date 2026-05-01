---
name: tauri-desktop
description: Build, review, and package Tauri applications that turn web stacks into desktop apps. Use when working on Tauri commands, frontend-to-Rust boundaries, desktop permissions, bundling, updater flows, filesystem access, notifications, tray features, or cross-platform desktop UX.
---

# Tauri Desktop

## Overview

Use this skill to keep desktop apps secure at the native boundary and pleasant on both the web and desktop sides. Treat every bridge between the frontend and Rust backend as an API surface, not a shortcut.

## Workflow

1. Identify the boundary being changed: frontend shell, Tauri command, plugin, packaging config, or desktop capability.
2. Check whether the behavior belongs in the web app, the Tauri command layer, or the Rust core.
3. Keep permissions and command exposure as narrow as possible.
4. Run [scripts/agent-smoke.ps1](scripts/agent-smoke.ps1) after edits.

## Desktop Rules

- Expose only the commands the UI actually needs.
- Validate and normalize all user-influenced file paths and shell arguments before crossing into native code.
- Keep long-running native work off the UI thread and return progress deliberately.
- Respect platform differences for paths, notifications, menu behavior, and packaging.

## Frontend Bridge Rules

- Treat command payloads like API DTOs with explicit shape validation.
- Keep browser-only assumptions out of flows that now run inside a desktop shell.
- Make offline, startup, and auto-update states visible in the UI.
- Design for smaller windows and multi-monitor resizing, not only full-screen browser layouts.

## Review Checklist

- Is the web/native boundary explicit and easy to audit?
- Are permissions, file access, and command exposure as small as they can be?
- Will this package and behave correctly across Windows, macOS, and Linux expectations?
- Are failure states surfaced to the user instead of disappearing into logs?
