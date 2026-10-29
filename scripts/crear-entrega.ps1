param([string]$ArchivoSalida = 'Entrega_QA_BP_E2E_API_FINAL.zip')

$ErrorActionPreference = 'Stop'
$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$carpetaPadre = Split-Path $raiz -Parent
$destino = Join-Path $carpetaPadre $ArchivoSalida
$temporal = Join-Path ([System.IO.Path]::GetTempPath()) ('qa-bp-' + [guid]::NewGuid().ToString('N'))
$staging = Join-Path $temporal (Split-Path $raiz -Leaf)

try {
    [System.IO.Directory]::CreateDirectory($staging) | Out-Null
    Get-ChildItem -Path $raiz -File -Recurse -Force | ForEach-Object {
        $relativo = $_.FullName.Substring($raiz.Length).TrimStart('\','/')
        if ($relativo -match '(^|[\\/])(node_modules|\.git)([\\/]|$)') { return }
        if ($_.Name -match '^\.env($|\.)' -and $_.Name -ne '.env.example') { return }
        $rutaDestino = Join-Path $staging $relativo
        [System.IO.Directory]::CreateDirectory((Split-Path $rutaDestino -Parent)) | Out-Null
        Copy-Item -LiteralPath $_.FullName -Destination $rutaDestino -Force
    }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    if (Test-Path $destino) { Remove-Item -LiteralPath $destino -Force }
    [System.IO.Compression.ZipFile]::CreateFromDirectory($temporal, $destino)
    Write-Host "ZIP creado: $destino"
    Write-Host 'Incluye evidencias generadas (si ejecutaste los tests), pero excluye node_modules y .git.'
}
finally {
    if (Test-Path $temporal) { Remove-Item -LiteralPath $temporal -Recurse -Force }
}
