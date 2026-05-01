param(
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

Push-Location $Path
try {
    if (-not (Test-Path ".github\\workflows")) {
        Write-Host "No .github/workflows directory found." -ForegroundColor DarkGray
        return
    }

    Write-Host "GitHub Actions smoke check: fewer red Xs, faster signal." -ForegroundColor Green

    $workflowFiles = Get-ChildItem ".github\\workflows" -Include *.yml, *.yaml -File -ErrorAction SilentlyContinue
    if (-not $workflowFiles) {
        Write-Host "No workflow YAML files found." -ForegroundColor DarkGray
        return
    }

    foreach ($workflowFile in $workflowFiles) {
        Write-Host ""
        Write-Host "==> $($workflowFile.Name)" -ForegroundColor Cyan
        Get-Content $workflowFile.FullName | Out-Null
    }

    Write-Host ""
    Write-Host "Manual follow-up: verify permissions, concurrency, cache keys, and deploy guards." -ForegroundColor Yellow
}
finally {
    Pop-Location
}
