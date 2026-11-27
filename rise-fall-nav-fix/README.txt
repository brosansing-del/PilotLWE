THE NAXAL ARCHIVE — REMOVE SEVEN-BOX RISE-AND-FALL NAVIGATION

This patch removes the redundant seven-box quick-navigation grid from
src/pages/history/rise-and-fall.astro. It does not modify the actual timeline,
photographs, header, other pages, or historical text.

HOW TO APPLY (PREVIOUS RISE-AND-FALL PAGE ALREADY INSTALLED)
1. Extract this ZIP into D:\PilotLWE.
2. Open the VS Code terminal in D:\PilotLWE.
3. Run:
   node .\rise-fall-nav-fix\remove-milestone-nav.cjs --dry-run
   node .\rise-fall-nav-fix\remove-milestone-nav.cjs
   npm.cmd run build
   npm.cmd run dev
4. Open http://localhost:4321/PilotLWE/history/rise-and-fall/
5. After verifying locally:
   git add src/pages/history/rise-and-fall.astro
   git commit -m "Remove redundant Rise and Fall navigation"
   git push origin main

The script backs up the original page in:
D:\PilotLWE\.rise-fall-navigation-backup\rise-and-fall.astro.before

If the navigation is already removed, it makes no changes.
