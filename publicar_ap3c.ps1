# publicar_ap3c.ps1

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Mensaje
)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

# Sin cambios pendientes no hay nada que publicar
if (-not (git status --porcelain)) {
    Write-Host 'Sin cambios pendientes.' -ForegroundColor Yellow
    return
}

git add --all
git commit -m $Mensaje
git push

Write-Host ''
Write-Host 'Publicado. Seguimiento del despliegue:' -ForegroundColor Green
Write-Host 'https://github.com/iamjosepunto/ap3c/actions'
