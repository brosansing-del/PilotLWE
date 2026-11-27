NEW BEGINNINGS - REMOVE QUICK NAVIGATION

Only file to replace in the website:
  src/pages/new-beginnings/index.astro

Changes:
- Removed the three quick-navigation buttons and their horizontal border.
- Removed unused navigation data and CSS.
- Removed leftover hero paragraph margin and tightened spacing before Rehabilitation & Livelihoods.
- Kept all three sections, all seven videos, all five articles, links and styling.
- No other page or component changed.

Windows VS Code steps (PowerShell from D:\PilotLWE):
1. Extract ZIP to D:\PilotLWE.
2. Back up existing file:
   Copy-Item .\src\pages\new-beginnings\index.astro .\new-beginnings-before-no-nav.astro
3. Replace page:
   Copy-Item .\new-beginnings-no-quick-nav\src\pages\new-beginnings\index.astro .\src\pages\new-beginnings\index.astro -Force
4. npm.cmd run build
5. npm.cmd run dev
6. Open http://localhost:4321/PilotLWE/new-beginnings/ and check desktop/mobile.

The ZIP also contains preview.html, a standalone mockup preview.
