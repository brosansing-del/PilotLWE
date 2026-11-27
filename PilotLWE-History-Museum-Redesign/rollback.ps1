param([string]$Project = 'D:\PilotLWE')
& (Join-Path $PSScriptRoot 'install.ps1') -Project $Project -Undo
