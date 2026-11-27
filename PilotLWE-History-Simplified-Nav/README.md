# History navigation simplification — PilotLWE

Scope: ONLY `src/components/Header.astro`, `src/pages/history/index.astro`, and `src/components/PoliticalOrganisation.astro`.

## Changes

- History dropdown now contains **Historical Evolution** and **Political Organisation** only.
- History page no longer duplicates these two options as tabs.
- Historical Evolution retains six clickable phases and Previous/Next controls.
- Political Organisation is one continuous article, preserving all existing sections and the hierarchy illustration; removes 15-topic horizontal scroll and per-topic navigation.
- Naxalbari photo and its credit are preserved if they are present in the current page.
- All other header navigation, language controls and site components are untouched.

## Install

1. Extract into `D:\PilotLWE\PilotLWE-History-Simplified-Nav\`.
2. In PowerShell from `D:\PilotLWE`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\PilotLWE-History-Simplified-Nav\install.ps1 -DryRun
powershell -NoProfile -ExecutionPolicy Bypass -File .\PilotLWE-History-Simplified-Nav\install.ps1
npm.cmd run build
npm.cmd run dev
```

3. Check `/PilotLWE/history/#naxalbari`, `/PilotLWE/history/#cpi-maoist`, and `/PilotLWE/history/#political-organisation`.

## Rollback

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\PilotLWE-History-Simplified-Nav\install.ps1 -Rollback
```

A dated backup is stored under `.pilotlwe-history-navigation-backups`. Do not run rollback after making further edits to the three updated files without saving those edits first.

If the dry run stops, the current project structure differs from the supplied museum-page version; the installer does not force modifications.
