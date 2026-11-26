PILOTLWE — HISTORY PARTS UPDATE

This update separates the six chronological History phases from the independent
Political Organisation & Leadership topic. It does not change the supplied
historical text or hierarchy illustration.

Updates these project files:
  src/pages/history/index.astro
  src/components/PoliticalOrganisation.astro

Key behavior:
- Historical Evolution and Organisation & Leadership are separate parts.
- History continues to show one chronological phase at a time.
- Political Organisation has its own 15-topic list and Previous/Next buttons.
- No more Chapter 07 label for Political Organisation.
- The unnecessary 'An account of the CPI (Maoist) party structure...' sentence is removed.
- /history/#political-organisation opens Part II, while /history/#naxalbari opens Part I.
- Historical text, political analysis and the organisational chart remain unchanged.

HOW TO INSTALL (PowerShell in D:\PilotLWE)
1. Extract ZIP so D:\PilotLWE\pilotlwe-history-separation\install.cjs exists.
2. Stop npm.cmd run dev with Ctrl+C.
3. Run:
   node .\pilotlwe-history-separation\install.cjs --dry-run
4. Then:
   node .\pilotlwe-history-separation\install.cjs
5. Run:
   npm.cmd run build
   npm.cmd run dev
6. Open http://localhost:4321/PilotLWE/history/#political-organisation
   Click Previous/Next topic and both Part tabs.

ROLLBACK:
   node .\pilotlwe-history-separation\install.cjs --undo

The installer backs up its two original files to
D:\PilotLWE\.pilotlwe-history-separation-backup\
It is designed to stop without editing if required files are missing or the
expected page structures cannot be found. It has not run against your actual
Windows project, so check the build before pushing to GitHub.
