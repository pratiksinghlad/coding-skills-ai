param(
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    if (-not (Test-Path ".git")) {
        Write-Host "No .git directory found." -ForegroundColor DarkGray
        return
    }

    Write-Host "Git workflow smoke check: clean history, calm nerves." -ForegroundColor Green

    Write-Host ""
    Write-Host "==> git status --short --branch" -ForegroundColor Cyan
    git status --short --branch

    Write-Host ""
    Write-Host "==> git log --oneline -5" -ForegroundColor Cyan
    git log --oneline -5

    Write-Host ""
    Write-Host "Manual follow-up: check branch ownership before rebasing or rewriting history." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
