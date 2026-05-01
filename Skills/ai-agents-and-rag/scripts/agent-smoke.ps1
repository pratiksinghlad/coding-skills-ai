param(
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    Write-Host "AI workflow smoke check: grounded beats flashy." -ForegroundColor Green

    if (Test-Path "package.json") {
        Write-Host ""
        Write-Host "==> package.json detected" -ForegroundColor Cyan
        Write-Host "Run the repo's eval, typecheck, and test scripts if they exist." -ForegroundColor DarkGray
    }

    if (Test-Path "pyproject.toml") {
        Write-Host ""
        Write-Host "==> pyproject.toml detected" -ForegroundColor Cyan
        Write-Host "Run uv sync plus any eval or pytest commands the repo defines." -ForegroundColor DarkGray
    }

    if ($null -ne (Get-Command ollama -ErrorAction SilentlyContinue)) {
        Write-Host ""
        Write-Host "==> ollama --version" -ForegroundColor Cyan
        ollama --version
    }

    Write-Host ""
    Write-Host "Manual follow-up: review retrieval quality, tool traces, and one known-answer evaluation sample." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
