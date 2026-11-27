param([switch]$DryRun, [switch]$Rollback)
$ErrorActionPreference = 'Stop'
$project = 'D:\PilotLWE'
$scriptFolder = Split-Path -Parent $MyInvocation.MyCommand.Path
$page = Join-Path $project 'src\pages\history\index.astro'
$imageTarget = Join-Path $project 'public\images\history\naxalbari-cpiml.png'
$imageSource = Join-Path $scriptFolder 'assets\naxalbari-cpiml.png'
$backupDir = Join-Path $project '.history-photo-backup'
$backedPage = Join-Path $backupDir 'index.astro'
$backedImage = Join-Path $backupDir 'naxalbari-cpiml.png'
$marker = 'data-mh-naxalbari-photo'

if ($Rollback) {
  if (!(Test-Path -LiteralPath $backedPage)) { throw 'No backup found. Nothing restored.' }
  Copy-Item -LiteralPath $backedPage -Destination $page -Force
  if (Test-Path -LiteralPath $backedImage) {
    Copy-Item -LiteralPath $backedImage -Destination $imageTarget -Force
  } elseif (Test-Path -LiteralPath $imageTarget) {
    Remove-Item -LiteralPath $imageTarget
  }
  Write-Host 'Restored the prior History page and image.'
  exit 0
}

if (!(Test-Path -LiteralPath $page)) { throw "History page not found: $page" }
if (!(Test-Path -LiteralPath $imageSource)) { throw "Image not found: $imageSource" }
$raw = [System.IO.File]::ReadAllText($page)
if ($raw.Contains($marker)) { Write-Host 'Already installed. No changes required.'; exit 0 }

$target = '              {chapterGroups(chapter).length ? ('
if (!$raw.Contains($target)) { throw 'The current History page does not match the museum redesign structure. No changes made.' }
$insert = @'
              {chapter.id === 'naxalbari' && (
                <figure class="mh-archival-photo" data-mh-naxalbari-photo>
                  <img src={`${import.meta.env.BASE_URL}images/history/naxalbari-cpiml.png`} alt="Archival group photograph provided for the Naxalbari history section" loading="lazy" decoding="async" />
                  <figcaption>Courtesy: <a href="https://cpiml.org/" target="_blank" rel="noopener noreferrer">CPIML.org</a></figcaption>
                </figure>
              )}
'@
$updated = $raw.Replace($target, $insert + $target)
$cssMarker = '  .mh-pager{'
if (!$updated.Contains($cssMarker)) { throw 'Could not find History styling anchor. No changes made.' }
$extraCss = @'
  .mh-subsection p { text-align:justify; text-justify:inter-word; hyphens:auto; overflow-wrap:break-word; }
  .mh-archival-photo { margin:0 0 32px; max-width:780px; }
  .mh-archival-photo img { display:block; width:100%; height:auto; max-height:460px; object-fit:contain; background:#e8e0d4; border:1px solid var(--mh-line); }
  .mh-archival-photo figcaption { padding-top:9px; color:#625c52; font:500 12px/1.5 system-ui,sans-serif; }
  .mh-archival-photo figcaption a { color:var(--mh-rust); text-underline-offset:3px; }
'@
$updated = $updated.Replace($cssMarker, $extraCss + $cssMarker)

Write-Host 'Proposed changes:'
Write-Host "  Photo -> $imageTarget"
Write-Host "  History page -> $page"
Write-Host '  Naxalbari figure with CPIML.org credit; justified history paragraphs'
if ($DryRun) { Write-Host 'Dry run complete. No files changed.'; exit 0 }

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
if (!(Test-Path -LiteralPath $backedPage)) { Copy-Item -LiteralPath $page -Destination $backedPage }
if ((Test-Path -LiteralPath $imageTarget) -and !(Test-Path -LiteralPath $backedImage)) { Copy-Item -LiteralPath $imageTarget -Destination $backedImage }
New-Item -ItemType Directory -Path (Split-Path -Parent $imageTarget) -Force | Out-Null
Copy-Item -LiteralPath $imageSource -Destination $imageTarget -Force
[System.IO.File]::WriteAllText($page, $updated, [System.Text.UTF8Encoding]::new($false))
Write-Host 'Installed. Run npm.cmd run build to verify.'
