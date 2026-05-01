param(
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    Write-Host "Performance smoke check: no miracle claims without measurements." -ForegroundColor Green

    if (Test-Path "*.sln" -or @(Get-ChildItem -Path . -Recurse -Filter *.csproj -File -ErrorAction SilentlyContinue).Count -gt 0) {
        Write-Host ""
        Write-Host "==> dotnet build" -ForegroundColor Cyan
        dotnet build
    }
    elseif (Test-Path "Cargo.toml") {
        Write-Host ""
        Write-Host "==> cargo build" -ForegroundColor Cyan
        cargo build
    }
    elseif (Test-Path "package.json") {
        Write-Host ""
        Write-Host "==> package.json detected" -ForegroundColor Cyan
        Write-Host "Run the repo's typecheck, test, and benchmark scripts if present." -ForegroundColor DarkGray
    }
    elseif (Test-Path "pyproject.toml") {
        Write-Host ""
        Write-Host "==> pyproject.toml detected" -ForegroundColor Cyan
        Write-Host "Run uv sync plus the repo's test or benchmark command." -ForegroundColor DarkGray
    }
    else {
        Write-Host "No recognized project markers found." -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "Manual follow-up: capture before/after latency, memory, or contention evidence." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
