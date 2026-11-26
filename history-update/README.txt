HISTORY AND NAVIGATION UPDATE - REVISED INSTALLER

Fixes the previously reported: "A second outdated navigation link remains".
This update changes all old route references inside Header.astro and replaces
outdated menu wording, including potential mobile menu entries.

1. Extract ZIP into D:\thenaxalarchive, replacing history-update files.
2. Stop npm dev server (Ctrl+C).
3. Run:
   node .\history-update\install.cjs --dry-run
   node .\history-update\install.cjs
   npm.cmd run build
   npm.cmd run dev
4. Check the History menu, the new History page, and Data & Visuals dropdown.

The installer creates timestamped backups under .history-update-backups.
It does not modify article files, dataset files or your GitHub repository.
If it cannot recognize your Header structure, it will stop without changes.
