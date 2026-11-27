THE NAXAL ARCHIVE: HISTORY DROPDOWN LINK FIX

Fixes the missing "Rise and Fall of CPI (Maoist)" entry with the subtitle "At a Glance".
Links to /PilotLWE/history/rise-and-fall/ using the site's Astro BASE_URL helper.
Changes ONLY src/components/Header.astro; does not alter page content, layout or CSS.

1. Extract the ZIP into D:\PilotLWE so the folder history-dropdown-at-a-glance-fix exists.
2. Open VS Code > Terminal > New Terminal.
3. Run:
   cd D:\PilotLWE
   node .\history-dropdown-at-a-glance-fix\patch-header.cjs --dry-run
4. If the dry run passes:
   node .\history-dropdown-at-a-glance-fix\patch-header.cjs
   npm.cmd run build
   npm.cmd run dev
5. Open http://localhost:4321/PilotLWE/ and hover over History.

EXPECTED MENU:
  Rise and Fall of CPI (Maoist)
    At a Glance
  Historical Evolution
    Six phases of the Naxalite movement
  Political Organisation
    Structure, leadership and internal functioning

Check that src/pages/history/rise-and-fall.astro exists. If not, install the
previous Rise and Fall page package first or the new link will return 404.

To undo this change, copy
  .history-dropdown-at-a-glance-backup\Header.astro.before
to
  src\components\Header.astro

No GitHub changes are made automatically. Commit only after local testing.
