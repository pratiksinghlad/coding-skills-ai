param(
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    $hasDockerfile = @(Get-ChildItem -Path . -Recurse -Filter Dockerfile* -File -ErrorAction SilentlyContinue).Count -gt 0
    if (-not $hasDockerfile -and -not (Test-Path "docker-compose.yml") -and -not (Test-Path "compose.yml")) {
        Write-Host "No Docker project markers found." -ForegroundColor DarkGray
        return
    }

    Write-Host "Docker smoke check: smaller layers, fewer surprises." -ForegroundColor Green

    if ($null -eq (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "Docker CLI is not available in PATH." -ForegroundColor Yellow
        return
    }

    if (Test-Path "docker-compose.yml" -or Test-Path "compose.yml") {
        Write-Host ""
        Write-Host "==> docker compose config" -ForegroundColor Cyan
        docker compose config | Out-Null
    }

    Write-Host ""
    Write-Host "==> docker build validation hint" -ForegroundColor Cyan
    Write-Host "Build the primary image locally if the repo documents a specific target or compose service." -ForegroundColor DarkGray

    Write-Host ""
    Write-Host "Manual follow-up: verify non-root runtime, health checks, secret handling, and layer order." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
