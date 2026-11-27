THE NAXAL ARCHIVE — HISTORY PAGE: TITLE + DIAGRAM FIT

Requested changes only:
  - Hide "History of the Naxalite Movement" while viewing
    /history/#political-organisation and its organisation topics.
  - Preserve that heading for the main six-phase History view.
  - Fit the entire hierarchy diagram to the inside of its border,
    removing the blank space on the left and right without cropping.
  - Keep all existing content, captions, headings, and navigation.
  - No other website pages or global styles are changed.

FILES CHANGED BY THE INSTALLER:
  src/pages/history/index.astro
  src/components/PoliticalOrganisation.astro

INSTALL IN VS CODE / WINDOWS POWERSHELL:

1. Extract this ZIP to D:\PilotLWE\, so the installer is:
   D:\PilotLWE\history-organisation-image-fix\install.cjs

2. In the VS Code terminal run:
   cd D:\PilotLWE
   node .\history-organisation-image-fix\install.cjs --dry-run

3. If the dry run passes, run:
   node .\history-organisation-image-fix\install.cjs
   npm.cmd run build
   npm.cmd run dev

4. Check the page:
   http://localhost:4321/PilotLWE/history/#political-organisation

5. If everything looks correct, commit:
   git add src/pages/history/index.astro src/components/PoliticalOrganisation.astro
   git commit -m "Remove redundant History title and fit organisation diagram"
   git push origin main

RESTORE THE ORIGINAL FILES:
   node .\history-organisation-image-fix\install.cjs --undo

The installer creates backups in:
   D:\PilotLWE\.history-organisation-image-fix-backup\

IMPORTANT: This installer recognises the known Astro History page and
PoliticalOrganisation component. If your local files have been restructured,
it stops without editing. In that case, upload those two files so the
change can be adapted to your current version.
