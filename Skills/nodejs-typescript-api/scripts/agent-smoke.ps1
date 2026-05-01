param(
    [string]$Path = ".",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

function Get-PackageManager {
    if (Test-Path "pnpm-lock.yaml") { return "pnpm" }
    if (Test-Path "yarn.lock") { return "yarn" }
    if (Test-Path "package-lock.json") { return "npm" }
    return "npm"
}

function Invoke-ScriptIfPresent([string]$Name, [string]$PackageManager, [hashtable]$Scripts) {
    if ($Scripts.ContainsKey($Name)) {
        Write-Host ""
        Write-Host "==> $Name" -ForegroundColor Cyan
        switch ($PackageManager) {
            "pnpm" { pnpm run $Name; break }
            "yarn" { yarn $Name; break }
            default { npm run $Name; break }
        }
    }
    else {
        Write-Host "Skipping $Name" -ForegroundColor DarkGray
    }
}

Push-Location $Path
try {
    if (-not (Test-Path "package.json")) {
        Write-Host "No package.json found." -ForegroundColor DarkGray
        return
    }

    $packageManager = Get-PackageManager
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json -AsHashtable
    $scripts = if ($packageJson.ContainsKey("scripts")) { $packageJson["scripts"] } else { @{} }

    Write-Host "Node API smoke check: keep the event loop smiling." -ForegroundColor Green
    Invoke-ScriptIfPresent "typecheck" $packageManager $scripts
    Invoke-ScriptIfPresent "lint" $packageManager $scripts

    if (-not $SkipTests) {
        Invoke-ScriptIfPresent "test" $packageManager $scripts
    }

    Invoke-ScriptIfPresent "build" $packageManager $scripts

    Write-Host ""
    Write-Host "Manual follow-up: check validation, auth guards, and background promise handling." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
