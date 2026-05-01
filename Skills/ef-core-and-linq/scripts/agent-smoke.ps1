param(
    [string]$Path = ".",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    Write-Host "EF Core smoke check: query shape before query drama." -ForegroundColor Green

    $hasProject = @(
        Get-ChildItem -Path . -Filter *.sln -File -ErrorAction SilentlyContinue
        Get-ChildItem -Path . -Recurse -Filter *.csproj -File -ErrorAction SilentlyContinue
    ).Count -gt 0

    if ($hasProject) {
        Write-Host ""
        Write-Host "==> dotnet restore" -ForegroundColor Cyan
        dotnet restore

        Write-Host ""
        Write-Host "==> dotnet build --no-restore" -ForegroundColor Cyan
        dotnet build --no-restore

        if (-not $SkipTests) {
            Write-Host ""
            Write-Host "==> dotnet test --no-build" -ForegroundColor Cyan
            dotnet test --no-build
        }
    }
    else {
        Write-Host "No .NET solution or project files found." -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "Manual follow-up: spot-check for N+1 loops, early ToList(), and broad Include chains." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
