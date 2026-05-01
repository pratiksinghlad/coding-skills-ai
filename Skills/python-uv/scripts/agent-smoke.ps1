param(
    [string]$Path = ".",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    if (-not (Test-Path "pyproject.toml")) {
        Write-Host "No pyproject.toml found." -ForegroundColor DarkGray
        return
    }

    Write-Host "Python uv smoke check: quick boot, clean env, no mystery imports." -ForegroundColor Green

    Write-Host ""
    Write-Host "==> uv sync" -ForegroundColor Cyan
    uv sync

    $pyproject = Get-Content "pyproject.toml" -Raw

    if ($pyproject -match '(?m)^\s*ruff\b') {
        Write-Host ""
        Write-Host "==> uv run ruff check ." -ForegroundColor Cyan
        uv run ruff check .
    }

    if ($pyproject -match '(?m)^\s*mypy\b' -or $pyproject -match '(?m)^\s*pyright\b') {
        Write-Host ""
        Write-Host "==> uv run python -m compileall ." -ForegroundColor Cyan
        uv run python -m compileall .
    }

    if (-not $SkipTests -and $pyproject -match '(?m)^\s*pytest\b') {
        Write-Host ""
        Write-Host "==> uv run pytest" -ForegroundColor Cyan
        uv run pytest
    }

    Write-Host ""
    Write-Host "Manual follow-up: check startup side effects, env loading, and sync-vs-async boundaries." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
