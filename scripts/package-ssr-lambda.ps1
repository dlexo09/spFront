$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$lambdaDir = Join-Path $root 'lambda-ssr'
$distServerDir = Join-Path $root 'dist\server'
$lambdaDistDir = Join-Path $lambdaDir 'dist'
$lambdaDistServerDir = Join-Path $lambdaDistDir 'server'
$zipPath = Join-Path $lambdaDir 'function.zip'

function Copy-IfExists {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$Destination,
    [switch]$Recurse
  )

  if (Test-Path $Source) {
    if ($Recurse) {
      Copy-Item -Recurse -Force $Source $Destination
    }
    else {
      Copy-Item -Force $Source $Destination
    }
  }
}

if (-not (Test-Path $distServerDir)) {
  throw "No se encontro dist/server. Ejecuta primero: npm run build"
}

if (-not (Test-Path (Join-Path $lambdaDir 'node_modules'))) {
  Push-Location $lambdaDir
  npm install --omit=dev
  Pop-Location
}

if (Test-Path $lambdaDistServerDir) {
  Remove-Item -Recurse -Force $lambdaDistServerDir
}

New-Item -ItemType Directory -Force -Path $lambdaDistDir | Out-Null
New-Item -ItemType Directory -Force -Path $lambdaDistServerDir | Out-Null

# Solo copiar artefactos SSR minimos. No incluir estaticos (img/video/files)
Copy-IfExists -Source (Join-Path $distServerDir 'entry.mjs') -Destination $lambdaDistServerDir
Copy-IfExists -Source (Join-Path $distServerDir 'package.json') -Destination $lambdaDistServerDir
Copy-IfExists -Source (Join-Path $distServerDir '.vite') -Destination $lambdaDistServerDir -Recurse
Copy-IfExists -Source (Join-Path $distServerDir 'entries') -Destination $lambdaDistServerDir -Recurse

if (Test-Path $zipPath) {
  Remove-Item -Force $zipPath
}

Compress-Archive -Path (Join-Path $lambdaDir 'index.mjs'), (Join-Path $lambdaDir 'package.json'), (Join-Path $lambdaDir 'node_modules'), (Join-Path $lambdaDir 'dist') -DestinationPath $zipPath

Write-Host "SSR Lambda package generado en: $zipPath"
