THE NAXAL ARCHIVE - CONSISTENT PAGE HEADINGS

GOAL
Apply the large, bold editorial heading style to the principal titles of the
History, Data & Visuals, Opinions, Victims' Corner, Tracking Development and
About Us pages. Long titles use a slightly smaller scale. The homepage, article
text, article detail routes, videos, graphs and navigation are left untouched.

INSTALL (from D:\thenaxalarchive in the VS Code PowerShell terminal)
1. Extract the ZIP into D:\thenaxalarchive so there is a heading-style-upgrade folder.
2. node .\heading-style-upgrade\install.cjs --dry-run
3. Inspect the listed files. If they are correct:
   node .\heading-style-upgrade\install.cjs
4. npm.cmd run build
5. npm.cmd run dev

ROLLBACK (only if you have not edited the changed page files after installation)
   node .\heading-style-upgrade\restore-latest.cjs

BACKUPS
The installer creates versioned backups in heading-style-upgrade/.backups/.
Keep this directory until you finish testing. No GitHub changes are made.

CUSTOMISE SIZE
Open src/styles/naxal-section-headings.css. The regular heading uses
font-size: clamp(64px, 10vw, 128px). Long headings use
clamp(54px, 6.4vw, 92px). Adjust as preferred.

LIMITATION
This package identifies the main H1 in known Astro page files. If a section
renders its main heading in a different component or uses a different file
path, that section is skipped rather than risking an incorrect edit.
