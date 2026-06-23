param(
  [Parameter(Mandatory = $true)]
  [string]$BucketName,

  [Parameter(Mandatory = $false)]
  [string]$DistributionId,

  [Parameter(Mandatory = $false)]
  [string]$Profile = "",

  [Parameter(Mandatory = $false)]
  [switch]$Build
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if ($Build) {
  Write-Host "Construyendo proyecto (npm run build)..." -ForegroundColor Cyan
  npm run build
  if ($LASTEXITCODE -ne 0) {
    throw "Build fallo."
  }
}

$distPath = Join-Path $root "dist"
if (-not (Test-Path $distPath)) {
  throw "No se encontro dist. Ejecuta primero npm run build o usa -Build."
}

$profileArgs = @()
if ($Profile -and $Profile.Trim().Length -gt 0) {
  $profileArgs = @("--profile", $Profile)
}

Write-Host "Subiendo assets con cache largo..." -ForegroundColor Cyan
aws s3 sync "dist" "s3://$BucketName" --delete --exclude "*" --include "assets/*" --cache-control "public,max-age=31536000,immutable" @profileArgs
if ($LASTEXITCODE -ne 0) {
  throw "Fallo sync de assets."
}

Write-Host "Subiendo HTML y resto con no-cache..." -ForegroundColor Cyan
aws s3 sync "dist" "s3://$BucketName" --delete --exclude "assets/*" --cache-control "no-cache" @profileArgs
if ($LASTEXITCODE -ne 0) {
  throw "Fallo sync de HTML/resto."
}

if ($DistributionId -and $DistributionId.Trim().Length -gt 0) {
  Write-Host "Invalidando CloudFront..." -ForegroundColor Cyan
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*" @profileArgs | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Fallo invalidacion de CloudFront."
  }
  Write-Host "Invalidacion enviada." -ForegroundColor Green
} else {
  Write-Host "Sin DistributionId: se omite invalidacion CloudFront." -ForegroundColor Yellow
}

Write-Host "Deploy estatico completado." -ForegroundColor Green
