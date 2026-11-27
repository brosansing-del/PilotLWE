param([switch]$DryRun, [switch]$Undo, [string]$Project = 'D:\PilotLWE')
$ErrorActionPreference = 'Stop'
$installer = Join-Path $PSScriptRoot 'install.cjs'
if (-not (Test-Path -LiteralPath $installer)) { throw 'Missing install.cjs next to install.ps1.' }
if (-not (Test-Path -LiteralPath (Join-Path $Project 'package.json'))) { throw "Not an Astro project: $Project" }
Push-Location -LiteralPath $Project
try {
    $arguments = @($installer)
    if ($DryRun) { $arguments += '--dry-run' }
    if ($Undo) { $arguments += '--undo' }
    & node @arguments
    if ($LASTEXITCODE -ne 0) { throw "Installer returned exit code $LASTEXITCODE" }
} finally { Pop-Location }
