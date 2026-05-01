param(
    [string]$Path = ".",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    if (-not (Test-Path "package.json")) {
        Write-Host "No package.json found." -ForegroundColor DarkGray
        return
    }

    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json -AsHashtable
    $scripts = if ($packageJson.ContainsKey("scripts")) { $packageJson["scripts"] } else { @{} }

    Write-Host "Playwright smoke check: fewer flakes, more signal." -ForegroundColor Green

    if ($scripts.ContainsKey("test:e2e")) {
        Write-Host ""
        Write-Host "==> npm run test:e2e" -ForegroundColor Cyan
        if (-not $SkipTests) { npm run test:e2e } else { Write-Host "Skipped by request" -ForegroundColor DarkGray }
    }
    elseif ($scripts.ContainsKey("playwright")) {
        Write-Host ""
        Write-Host "==> npm run playwright" -ForegroundColor Cyan
        if (-not $SkipTests) { npm run playwright } else { Write-Host "Skipped by request" -ForegroundColor DarkGray }
    }
    else {
        Write-Host "No dedicated Playwright script found. Try 'npx playwright test' if the repo supports it." -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "Manual follow-up: inspect traces for failures and confirm selectors target user-facing semantics." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
