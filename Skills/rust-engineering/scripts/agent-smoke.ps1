param(
    [string]$Path = ".",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    $hasCargo = Test-Path "Cargo.toml"
    if (-not $hasCargo) {
        Write-Host "No Cargo.toml found." -ForegroundColor DarkGray
        return
    }

    Write-Host "Rust smoke check: fearless, but still formatted." -ForegroundColor Green

    Write-Host ""
    Write-Host "==> cargo fmt --all --check" -ForegroundColor Cyan
    cargo fmt --all --check

    Write-Host ""
    Write-Host "==> cargo clippy --all-targets --all-features -- -D warnings" -ForegroundColor Cyan
    cargo clippy --all-targets --all-features -- -D warnings

    Write-Host ""
    Write-Host "==> cargo build --all-features" -ForegroundColor Cyan
    cargo build --all-features

    if (-not $SkipTests) {
        Write-Host ""
        Write-Host "==> cargo test --all-features" -ForegroundColor Cyan
        cargo test --all-features
    }

    Write-Host ""
    Write-Host "Manual follow-up: watch for hidden blocking, clone-heavy hot paths, and shaky unsafe seams." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
