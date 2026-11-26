THE NAXAL ARCHIVE — MAJOR INCIDENTS ONLY

This package completely replaces the old 1980–2026 fatalities dashboard with the
Major Incidents 2000–2026 premium dashboard. It includes all required files.

INSTALL IN WINDOWS / VS CODE
1. Stop the dev server (Ctrl+C).
2. Extract the ZIP into D:\thenaxalarchive.
3. Run in the VS Code terminal:
   node .\major-incidents-complete-fix\install.cjs --dry-run
   node .\major-incidents-complete-fix\install.cjs
   npm.cmd run build
   npm.cmd run dev
4. Open the Data & Visuals link on the website or navigate to:
   http://localhost:4321/data-visuals/major-incidents/
   If astro.config.mjs has base: '/thenaxalarchive/', use:
   http://localhost:4321/thenaxalarchive/data-visuals/major-incidents/

WHAT CHANGES
- Replaces the old page's 1980–2026 chart and data with a redirect to the new page.
- Creates/updates src/pages/data-visuals/major-incidents.astro.
- Creates/updates src/components/MajorIncidents.astro.
- Creates/updates src/data/majorIncidents.ts.
- Rewrites links in .astro files pointing to the old page, where found.
- Does NOT modify articles, article images, git, or the live site.

ROLL BACK
node .\major-incidents-complete-fix\restore.cjs

IMPORTANT
- This package does not include the old 1980–2026 dataset.
- The old URL remains as a tiny redirect so saved links do not break.
- The Major Incidents figures are transcribed from the user-provided table,
  not independently verified. 2000 and 2026 are partial years.
- The Astro production build must be verified on your own project.
