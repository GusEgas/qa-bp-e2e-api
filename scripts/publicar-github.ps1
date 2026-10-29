param([string]$NombreRepo = 'qa-bp-e2e-api')

# 'Continue': git/gh escriben progreso en stderr; los fallos se controlan con $LASTEXITCODE.
$ErrorActionPreference = 'Continue'
Set-Location (Join-Path $PSScriptRoot '..')
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Instala Git para publicar el repositorio.'
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'Instala GitHub CLI (https://cli.github.com/) y ejecuta gh auth login.'
}

& gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Inicia sesión con gh auth login.' }
$login = (& gh api user --jq '.login').Trim()
$idUsuario = (& gh api user --jq '.id').Trim()

if (-not (Test-Path '.git')) { & git init -b main }

# Correo noreply de GitHub solo para este repositorio: evita publicar el correo personal/corporativo.
& git config user.name $login
& git config user.email "$idUsuario+$login@users.noreply.github.com"

& git add .
& git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    & git commit -m 'Entrega evaluación QA: E2E SauceDemo y API Petstore'
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo crear el commit.' }
}

if (@(& git remote) -notcontains 'origin') {
    & gh repo view "$login/$NombreRepo" --json url 2>$null | Out-Null
    $repoExiste = ($LASTEXITCODE -eq 0)
    if ($repoExiste) {
        # El repositorio ya existe en la cuenta autenticada: se reutiliza, nunca uno de terceros.
        & git remote add origin "https://github.com/$login/$NombreRepo.git"
    } else {
        & gh repo create "$login/$NombreRepo" --public --source . --remote origin `
            --description 'Evaluación QA Banco Pichincha: E2E SauceDemo (Cypress) y API Swagger Petstore v2'
        if ($LASTEXITCODE -ne 0) { throw 'No se creó el repositorio; revisa el mensaje de gh.' }
    }
}
& git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'No se pudo subir la rama main; revisa el mensaje de git.' }
Write-Host 'Repositorio público publicado. Copia la ÚNICA URL para el formulario del examen.'
& gh repo view "$login/$NombreRepo" --json url --jq '.url'
