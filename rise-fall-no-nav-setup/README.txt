THE NAXAL ARCHIVE — RISE AND FALL (WITHOUT SEVEN-BOX QUICK NAVIGATION)

This update removes the redundant seven-period quick-navigation grid:
1967, 1969, 1970s–90s, 2004, 2010–13, 2024–26, March 2026.
The actual illustrated historical narrative remains intact.

IF YOU ALREADY INSTALLED THE PREVIOUS RISE-AND-FALL PACKAGE:

1. Extract this ZIP into D:\PilotLWE so you have:
   D:\PilotLWE\rise-fall-no-nav-setup\remove-milestone-nav.cjs
2. Open the D:\PilotLWE project in VS Code.
3. Run these commands in the terminal:
   cd D:\PilotLWE
   node .\rise-fall-no-nav-setup\remove-milestone-nav.cjs --dry-run
   node .\rise-fall-no-nav-setup\remove-milestone-nav.cjs
   npm.cmd run build
   npm.cmd run dev
4. Open http://localhost:4321/PilotLWE/history/rise-and-fall/
   Check that the introduction flows directly into the illustrated timeline.
5. After checking locally, commit:
   git add src/pages/history/rise-and-fall.astro
   git commit -m "Remove redundant Rise and Fall quick navigation"
   git push origin main

The patch only edits src/pages/history/rise-and-fall.astro.
It creates a backup at .rise-fall-navigation-backup/rise-and-fall.astro.before.
It does not change other pages, the Header, photographs, or history narrative.

IF YOU HAVE NOT INSTALLED THE PREVIOUS PACKAGE:

1. Extract this ZIP into D:\PilotLWE.
2. Run:
   cd D:\PilotLWE
   node .\rise-fall-no-nav-setup\install.cjs --dry-run
   node .\rise-fall-no-nav-setup\install.cjs
   npm.cmd run build
   npm.cmd run dev
3. Preview locally and commit the added files after verifying.

This package also contains the updated Astro page and local preview.
The current site base path is assumed to be /PilotLWE/.
