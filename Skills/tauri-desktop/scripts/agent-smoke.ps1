param(
    [string]$Path = ".",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    $hasTauri = (Test-Path "src-tauri\\Cargo.toml") -or (Test-Path "Cargo.toml" -PathType Leaf)
    if (-not $hasTauri) {
        Write-Host "No Tauri project markers found." -ForegroundColor DarkGray
        return
    }

    Write-Host "Tauri smoke check: desktop polish without native chaos." -ForegroundColor Green

    if (Test-Path "package.json") {
        Write-Host ""
        Write-Host "==> npm run build (if present)" -ForegroundColor Cyan
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json -AsHashtable
        if ($packageJson.ContainsKey("scripts") -and $packageJson["scripts"].ContainsKey("build")) {
            npm run build
        }
        else {
            Write-Host "Skipping frontend build" -ForegroundColor DarkGray
        }
    }

    $cargoPath = if (Test-Path "src-tauri\\Cargo.toml") { "src-tauri" } else { "." }
    Push-Location $cargoPath
    try {
        Write-Host ""
        Write-Host "==> cargo build" -ForegroundColor Cyan
        cargo build

        if (-not $SkipTests) {
            Write-Host ""
            Write-Host "==> cargo test" -ForegroundColor Cyan
            cargo test
        }
    }
    finally {
        Pop-Location
    }

    Write-Host ""
    Write-Host "Manual follow-up: check desktop permissions, file dialogs, and narrow-window layouts." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
