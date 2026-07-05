# Infra Lessons

RULE: Never overwrite files in AgentSkills/ without verifying they are backed up; it is the single source of truth and tool-specific entry points must point to it, never duplicate it. #circular-redirect 2026-05-31
RULE: Use repo-relative paths in all agent and IDE instruction files; never write absolute local drive paths in shared documentation. #wrong-path 2026-06-06
RULE: When splitting a monolithic memory file into domain files, grep the whole repo for the old path and update every reference before deleting the original. #stale-reference 2026-06-07
RULE: Always check native command exit codes explicitly in PowerShell harness scripts. #native-exit-code 2026-06-21
RULE: Run dotnet format after patching C# files; this repo enforces CRLF and no final newline. #format-fail 2026-07-01
RULE: Always execute the full AgentSkills bootstrap sequence before any code-changing task, even simple ones. #bootstrap-skip 2026-07-05
