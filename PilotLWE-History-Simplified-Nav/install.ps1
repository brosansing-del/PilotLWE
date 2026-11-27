param([switch]$DryRun,[switch]$Rollback)
$ErrorActionPreference = 'Stop'
$project = 'D:\PilotLWE'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $project
try {
  $arguments = @((Join-Path $scriptDir 'install.cjs'))
  if ($DryRun) { $arguments += '--dry-run' }
  if ($Rollback) { $arguments += '--undo' }
  & node @arguments
  if ($LASTEXITCODE -ne 0) { throw 'History update failed; see messages above.' }
} finally { Pop-Location }
