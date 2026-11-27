THE NAXAL ARCHIVE - HISTORY / POLITICAL ORGANISATION FIX V3

WHY V3?
The earlier script expected a specific History page structure and stopped with
"Unexpected History page structure". V3 does not modify or depend on
src/pages/history/index.astro. It locates the hierarchy diagram's Astro
component and applies only the requested visual changes.

CHANGES
1. Hides the exact heading "History of the Naxalite Movement" while the URL
   points to #political-organisation or #po-topic-1, etc. The title remains
   available in the regular History view.
2. Makes the diagram fill the inside of its existing border without sidebars
   or cropping; image proportions are preserved.
3. Leaves the historical text, navigation, image file, and captions intact.

INSTALL
1. Extract the ZIP to D:\PilotLWE\ so you have
   D:\PilotLWE\history-organisation-image-fix-v3\install.cjs
2. In VS Code terminal:
   cd D:\PilotLWE
   node .\history-organisation-image-fix-v3\install.cjs --dry-run
3. If it says "Dry run passed", run:
   node .\history-organisation-image-fix-v3\install.cjs
   npm.cmd run build
   npm.cmd run dev
4. Open:
   http://localhost:4321/PilotLWE/history/#political-organisation
5. If correct, commit:
   git add src/components/PoliticalOrganisation.astro
   git commit -m "Fit organisation diagram and hide duplicate History title"
   git push origin main

RESTORE
   node .\history-organisation-image-fix-v3\install.cjs --undo

A copy of the original component is saved in:
   D:\PilotLWE\.history-organisation-v3-backup\

IMPORTANT
Do not run the old install.cjs again. V3 is separate.
If V3 cannot find the diagram component, upload the current
src/components/PoliticalOrganisation.astro and src/pages/history/index.astro
for an exact patch. No changes are made when validation fails.
