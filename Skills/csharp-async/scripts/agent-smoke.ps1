param(
    [string]$Path = ".",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-IfFound([string]$Label, [scriptblock]$Detector, [scriptblock]$Action) {
    if (& $Detector) {
        Write-Step $Label
        & $Action
    }
    else {
        Write-Host "Skipping $Label" -ForegroundColor DarkGray
    }
}

Push-Location $Path
try {
    Write-Host "Async smoke check: keeping the thread pool happy." -ForegroundColor Green

    $hasDotnet = $null -ne (Get-Command dotnet -ErrorAction SilentlyContinue)
    $hasProject = @(
        Get-ChildItem -Path . -Filter *.sln -File -ErrorAction SilentlyContinue
        Get-ChildItem -Path . -Recurse -Filter *.csproj -File -ErrorAction SilentlyContinue
    ).Count -gt 0

    Invoke-IfFound "dotnet restore" { $hasDotnet -and $hasProject } { dotnet restore }
    Invoke-IfFound "dotnet build --no-restore" { $hasDotnet -and $hasProject } { dotnet build --no-restore }

    if (-not $SkipTests) {
        Invoke-IfFound "dotnet test --no-build" { $hasDotnet -and $hasProject } { dotnet test --no-build }
    }

    Write-Host ""
    Write-Host "Smoke check complete. If async code changed, also scan for .Result, .Wait(), and missing CancellationToken flows." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
