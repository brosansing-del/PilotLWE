# The Naxal Archive — Major Incidents Premium Redesign

This updates the **Major Incidents (2000–2026)** section under **Data & Visuals**. It does not change the earlier fatalities chart, article pages, or existing dataset values.

## What's new

- Deep-green illustrated editorial header and clear source/coverage notes
- Four colour-coded KPI cards that update with the year range
- Responsive year controls and accessible three-tab navigation
- A refined interactive trend chart with selected metric and peak-year summary
- Donut visualisations with category labels for killed, injured and incident initiation
- Full year-wise data table with frozen year column and CSV export
- Mobile layout and keyboard-accessible controls

## Local installation on Windows

1. Extract this ZIP into `D:\thenaxalarchive`. A folder named `major-incidents-premium` should appear.
2. In VS Code, open the terminal in `D:\thenaxalarchive`.
3. Run a dry run:

   `node .\major-incidents-premium\install.cjs --dry-run`

4. If it identifies the correct Data & Visuals page, install:

   `node .\major-incidents-premium\install.cjs`

5. Check the production build and preview locally:

   `npm.cmd run build`

   `npm.cmd run dev`

If the installer cannot find the Data & Visuals page, specify its exact path:

`node .\major-incidents-premium\install.cjs --page src/pages/YOUR-PAGE.astro --dry-run`

Then rerun the same command without `--dry-run`.

## Backups and rollback

The installer creates backups under `.naxal-major-incidents-backups/`. To restore the most recent installation:

`node .\major-incidents-premium\restore-latest.cjs`

Do not run `git reset --hard` or `git clean -fd` to undo this change.

## Important notes

- **The installer preserves `src/data/majorIncidents.ts` if it already exists.** Only the visual component is replaced; a missing data file is created from the supplied dataset.
- The source table covers 6 March 2000–17 November 2026; both endpoint years are partial.
- This major-incident series must not be combined with the separate fatalities series starting in 1980.
- Source figures were transcribed from the screenshot provided by the user and have not been independently verified.
- The preview HTML is a standalone visual and interaction test. The production Astro build must still be checked in the user's own project.
- No GitHub commit or push is performed.
