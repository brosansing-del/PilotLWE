PILOTLWE - NEW BEGINNINGS: SMALL CLEANUP (27 NOV 2026)

WHAT CHANGED
- Deleted the entire election statistics panel (81%+ turnout and 21,437 electors), including the comparison note and its unused CSS.
- Changed the three section labels from "Related reporting" to "Further Reading".
- Preserved three content sections, all seven YouTube video entries, their titles, descriptions, and all five external articles.
- Only src/pages/new-beginnings/index.astro needs replacing. The Header and other pages stay unchanged.

INSTALL LOCALLY IN VS CODE (PowerShell)
1. Extract ZIP and copy its folder to D:\PilotLWE\new-beginnings-cleanup\ or simply take index.astro from the ZIP.
2. Run from D:\PilotLWE:

   New-Item -ItemType Directory -Force .\page-backups
   Copy-Item .\src\pages\new-beginnings\index.astro .\page-backups\new-beginnings-before-cleanup.astro
   Copy-Item .\new-beginnings-cleanup\src\pages\new-beginnings\index.astro .\src\pages\new-beginnings\index.astro -Force
   npm.cmd run build
   npm.cmd run dev

3. Open http://localhost:4321/PilotLWE/new-beginnings/
4. Check: panel gone; 'Further Reading' appears once under each of the three sections; seven videos and five articles still present.

ROLLBACK
   Copy-Item .\page-backups\new-beginnings-before-cleanup.astro .\src\pages\new-beginnings\index.astro -Force

Note: Local Astro build still needs checking in your project. No GitHub changes made.
