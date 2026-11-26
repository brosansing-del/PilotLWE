PILOTLWE - FOUR-ISSUE WEBSITE CORRECTION

Use this package with your local PilotLWE Astro project.
No GitHub operations are performed.

Updates:
1. Removes the Tracking Development navigation link from Header.astro.
2. Removes the Tracking Development homepage section, plus unpopulated Key Indicators placeholders (if present).
3. Replaces the large green/charcoal History hero with a compact heading. The History page shows one chapter at a time with Previous and Next buttons. Existing chapter text remains unchanged. The Political Organisation chapter (when installed) is also included in the sequence, and its diagram remains.
4. Changes the YouTube video uwZY64u-SP0 card to the editorial title and description supplied for Burkapal.

IMPORTANT: This package does not delete your project or historical text. It does not automatically remove the CPI (Maoist) hierarchy graphic, because it was explicitly requested for Political Organisation.

STEPS in VS Code PowerShell (from PilotLWE project root):
  node .\pilotlwe-polish-fix\install.cjs --dry-run
  node .\pilotlwe-polish-fix\install.cjs
  npm.cmd run build
  npm.cmd run dev

Rollback (after one application):
  node .\pilotlwe-polish-fix\install.cjs --undo

The installer creates .pilotlwe-polish-backup before modifying files.
If your local project is different from the supplied code versions, it stops without overwriting your work.

Test the following:
- Header no longer has Tracking Development.
- Homepage no longer has its Tracking Development section or blank indicators.
- History shows only Naxalbari first; selecting chapter 2 or Next shows CPI(ML).
- Homepage Naxalbari link opens the relevant History chapter; #political-organisation opens the Political Organisation chapter.
- Victims' Corner now displays Burkapal title, description and original video link.

Note: This has been tested with the supplied code samples; the complete Astro build must be checked on your computer.
