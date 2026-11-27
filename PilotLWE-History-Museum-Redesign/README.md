# PilotLWE — History of the Naxalite Movement (redesign)

## Scope

Replaces only:

- `src/pages/history/index.astro`
- `src/components/PoliticalOrganisation.astro`

If the organisational diagram is absent, also installs `public/images/history/cpi-maoist-hierarchy.png` from the previously editor-supplied hierarchy illustration. **Other pages, navigation, language tools and article/video data are untouched.**

Unlike earlier fixed-file packages, this installer extracts the `chapters` and `sections` arrays from your **current** local files and injects them into the redesigned page and component. The original paragraphs are not rewritten or shortened. Four phase summaries already present in the homepage material are used only if those phases are missing from the History array.

## Install (PowerShell / VS Code)

1. Extract this ZIP. Keep `PilotLWE-History-Museum-Redesign` together with its `templates` and `assets` folders.
2. In VS Code terminal, run:

```powershell
cd D:\PilotLWE
powershell -NoProfile -ExecutionPolicy Bypass -File '.\PilotLWE-History-Museum-Redesign\install.ps1' -DryRun
```

3. If it reports the two files to update and no error:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File '.\PilotLWE-History-Museum-Redesign\install.ps1'
npm.cmd run build
npm.cmd run dev
```

4. Check:
   - `http://localhost:4321/PilotLWE/history/#naxalbari`
   - `http://localhost:4321/PilotLWE/history/#formation-of-cpi-ml`
   - `http://localhost:4321/PilotLWE/history/#pwg-mcc`
   - `http://localhost:4321/PilotLWE/history/#convergence`
   - `http://localhost:4321/PilotLWE/history/#cpi-maoist`
   - `http://localhost:4321/PilotLWE/history/#contraction`
   - `http://localhost:4321/PilotLWE/history/#political-organisation`
   - `http://localhost:4321/PilotLWE/history/#po-topic-1`

`/PilotLWE/` comes from your Astro base config; don't hardcode it into links. The page uses hash anchors so existing routes remain valid.

## Roll back

```powershell
cd D:\PilotLWE
powershell -NoProfile -ExecutionPolicy Bypass -File '.\PilotLWE-History-Museum-Redesign\rollback.ps1'
```

The installer creates a timestamped backup in `D:\PilotLWE\.pilotlwe-history-museum-backups` and an inventory in `latest.json`. Rollback restores both original Astro files and removes the diagram only if the installer itself added it.

## Design decisions

- No breadcrumb, redundant kicker, oversized hero, left chapter sidebar, or decorative cards.
- Two compact top tabs; six-milestone horizontal timeline with active state; one chapter at a time; Previous / Next.
- Body text at 18px with ~1.8 line height and a maximum 780px prose width; larger screens centered.
- Full chapter paragraphs are separated into named topics without changing text.
- The Political Organisation content is **not** treated as a seventh historical phase. It has fifteen independently navigable sections, with the infographic in an **optional expand/collapse panel**.
- Supplied historical photographs and the red timeline graphic are copied to `editorial-image-review/`, **not** `public/`. Their date, provenance, permissions and attribution require verification before publishing. The existing supplied organisational schematic is labelled as illustrative, not photographic evidence.
- No modification to global header, translation widget, GitHub settings, or other sections.

## Testing notes

Installer dry-run, repeat-run and rollback have been tested against the historical source and Political Organisation files previously supplied in the conversation. The complete Astro production build must be run in your current Windows project because that local dependency tree is not available here.

## Safety

If the expected `chapters` or `sections` data arrays cannot be found, installation aborts without changes. Make sure any edits to those arrays are saved before running the installer. Review the `git diff` before committing.
