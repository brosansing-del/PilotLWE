# PilotLWE - Victims’ Corner compact layout and priority-card fix

Only two files in `src` are replaced:
- `src/pages/victims-corner/index.astro` — compact header; removes redundant breadcrumb and Explore link; keeps the requested section label/heading/intro
- `src/components/VictimsMediaGallery.astro` — changes Selected coverage to Reports & Testimonies; puts the Akash Rao video in the upper-left (identified by `Vh2MLbve1XA` or Akash Rao in title); hides only the `Courtesy: TheVJMovement` credit in Victims’ Corner; retains other credits

## Important: where to edit the video content
- `D:\PilotLWE\src\data\archiveVideos.ts` — edit the original `title`, `description`, `youtubeId`, `publisher`, optional `date` / `location` for video cards. All video cards on the homepage and Opinions also read this shared catalogue, so check changes before publication. Do **not** edit `archive-videos-before-credits.ts`; that's a backup.
- `D:\PilotLWE\src\data\victimsArticles.ts` — add/change Victims’ Corner articles, including `title`, `description`, `publisher`, `url`.
- `D:\PilotLWE\src\components\VictimsMediaGallery.astro` — Victims’ Corner card layout, order and filters only.
- `D:\PilotLWE\src\pages\victims-corner\index.astro` — Victims’ Corner hero text and spacing.

## Install (VS Code PowerShell, from `D:\PilotLWE`)
1. Stop dev server (Ctrl+C).
2. Extract this zip into `D:\PilotLWE`. It creates `victims-corner-refinement`.
3. Back up current files outside src:
   ```powershell
   New-Item -ItemType Directory -Force .\page-backups
   Copy-Item .\src\pages\victims-corner\index.astro .\page-backups\victims-index-before-polish.astro
   Copy-Item .\src\components\VictimsMediaGallery.astro .\page-backups\VictimsMediaGallery-before-polish.astro
   ```
4. Replace only these files:
   ```powershell
   Copy-Item .\victims-corner-refinement\src\pages\victims-corner\index.astro .\src\pages\victims-corner\index.astro -Force
   Copy-Item .\victims-corner-refinement\src\components\VictimsMediaGallery.astro .\src\components\VictimsMediaGallery.astro -Force
   ```
5. `npm.cmd run build` then `npm.cmd run dev`.
6. Open `http://localhost:4321/PilotLWE/victims-corner/` (or your Astro dev server's address). Test filters and cards. The Akash Rao record must already exist in `archiveVideos.ts`; if missing, it cannot display.

## Restore
```powershell
Copy-Item .\page-backups\victims-index-before-polish.astro .\src\pages\victims-corner\index.astro -Force
Copy-Item .\page-backups\VictimsMediaGallery-before-polish.astro .\src\components\VictimsMediaGallery.astro -Force
```

No GitHub action is performed by this ZIP. All videos, URLs, card descriptions and external articles are read from your existing data files without rewriting them. No other page is touched.
