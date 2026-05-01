param(
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    Write-Host "Automation smoke check: repeatable beats heroic." -ForegroundColor Green

    if (Test-Path "package.json") {
        Write-Host ""
        Write-Host "==> package.json detected" -ForegroundColor Cyan
        Write-Host "Review scripts for one-command setup, validate, and test flows." -ForegroundColor DarkGray
    }

    if (Test-Path "pyproject.toml") {
        Write-Host ""
        Write-Host "==> pyproject.toml detected" -ForegroundColor Cyan
        Write-Host "Check uv scripts or task groups for setup and validation commands." -ForegroundColor DarkGray
    }

    if (Test-Path ".github\\workflows") {
        Write-Host ""
        Write-Host "==> .github/workflows detected" -ForegroundColor Cyan
        Write-Host "Confirm local scripts and CI workflows are not drifting apart." -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "Manual follow-up: make sure the repo has one obvious validate command agents can run after edits." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
