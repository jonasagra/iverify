$ErrorActionPreference = "Stop"

# Sincroniza o banco local para a versao publica usada no deploy.
$source = Join-Path $PSScriptRoot "models.json"
$target = Join-Path $PSScriptRoot "public\models.json"

if (-not (Test-Path $source)) {
    throw "Arquivo nao encontrado: $source"
}

if (-not (Test-Path (Split-Path $target -Parent))) {
    New-Item -ItemType Directory -Path (Split-Path $target -Parent) | Out-Null
}

# Valida JSON antes de copiar.
$jsonRaw = Get-Content -Path $source -Raw -Encoding UTF8
$null = $jsonRaw | ConvertFrom-Json

Set-Content -Path $target -Value $jsonRaw -Encoding UTF8
Write-Host "OK: models.json sincronizado para public/models.json"
