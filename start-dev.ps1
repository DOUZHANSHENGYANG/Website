param(
  [switch]$SkipInstall,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $repoRoot "frontend"
$backendDir = Join-Path $repoRoot "backend"

function Test-CommandExists {
  param([Parameter(Mandatory = $true)][string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

if (-not (Test-Path $frontendDir)) { throw "Missing frontend directory: $frontendDir" }
if (-not (Test-Path $backendDir)) { throw "Missing backend directory: $backendDir" }

if (-not (Test-CommandExists "npm")) { throw "npm not found. Please install Node.js 18+." }
if (-not (Test-CommandExists "mvn")) { throw "mvn not found. Please install Maven 3.9+." }

$frontendSteps = @()
$frontendSteps += "Set-Location -LiteralPath '$frontendDir'"
if (-not $SkipInstall) {
  $frontendSteps += "if (-not (Test-Path 'node_modules')) { npm install }"
}
$frontendSteps += "npm run dev"
$frontendCommand = ($frontendSteps -join "; ")

$backendCommand = "Set-Location -LiteralPath '$backendDir'; mvn spring-boot:run"

Write-Host "== Startup Config ==" -ForegroundColor Cyan
Write-Host "repo: $repoRoot"
Write-Host "frontend: $frontendDir"
Write-Host "backend: $backendDir"
Write-Host ""
Write-Host "Frontend URL: http://localhost:9001" -ForegroundColor Green
Write-Host "Backend URL:  http://localhost:9002" -ForegroundColor Green
Write-Host "Swagger:      http://localhost:9002/swagger-ui.html" -ForegroundColor Green
Write-Host ""

if ($DryRun) {
  Write-Host "[DryRun] backend command: $backendCommand"
  Write-Host "[DryRun] frontend command: $frontendCommand"
  exit 0
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand | Out-Null
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand | Out-Null

Write-Host "Frontend and backend started in two new terminal windows." -ForegroundColor Yellow
Write-Host "To stop them, press Ctrl + C in each window."
