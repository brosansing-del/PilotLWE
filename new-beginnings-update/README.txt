PILOTLWE - NEW BEGINNINGS (3 SECTIONS)
=====================================

This is a direct, ONE-PAGE Astro replacement. No installer and no changes to
Header.astro, the homepage, your video catalogue, or any other site sections.

New page organization:
  1. Rehabilitation & Livelihoods (Weapons Down, Lives Up)
  2. Administrative Outreach (Reaching the Last Mile)
  3. Changing State of Democracy (Voting & Civic Participation)

All seven original YouTube video IDs and all five external article links are
retained. Articles sit inside the appropriate section, not a separate list.

GETTING STARTED IN VS CODE (POWERSHELL)
-------------------------------------
1. Extract this ZIP into D:\PilotLWE, so you have a folder:
      D:\PilotLWE\new-beginnings-update\

2. Stop the development server (Ctrl+C). Open VS Code terminal in D:\PilotLWE.

3. Back up the live page:
      New-Item -ItemType Directory -Force .\page-backups | Out-Null
      Copy-Item .\src\pages\new-beginnings\index.astro .\page-backups\new-beginnings-before-three-sections.astro

4. Replace only this page:
      Copy-Item .\new-beginnings-update\src\pages\new-beginnings\index.astro .\src\pages\new-beginnings\index.astro -Force

5. Test:
      npm.cmd run build
      npm.cmd run dev

6. Open:
      http://localhost:4321/PilotLWE/new-beginnings/

Check the shorter opening banner, the three jump links, seven video cards,
five related articles grouped under their headings, and the election-data panel.

RESTORE IF NEEDED:
      Copy-Item .\page-backups\new-beginnings-before-three-sections.astro .\src\pages\new-beginnings\index.astro -Force

ELECTION DATA SOURCES
---------------------
1. Akashvani News, 24 February 2025: third-phase Chhattisgarh panchayat
   voter turnout reported above 81%. This is a STATEWIDE PHASE figure,
   NOT Orchha/Abujhmad turnout.
   https://newsonair.gov.in/hi/%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A4%BF%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A4%B0%E0%A5%80%E0%A4%AF-%E0%A4%AA%E0%A4%82%E0%A4%9A%E0%A4%BE%E0%A4%AF%E0%A4%A4-%E0%A4%9A%E0%A5%81%E0%A4%A8%E0%A4%BE%E0%A4%B5-2/
2. February 2025 Orchha Panchayat election preparations: 21,437 registered
   electors in 36 gram panchayats and 37 polling stations. NOT votes cast.
   https://inn24news.in/last-phase-of-panchayat-elections-tomorrow/

The metrics cannot be compared directly as a change in local voter turnout.

PREVIEWS
--------
preview.html is an offline layout preview; in that preview, YouTube thumbnail
areas use placeholders. On the Astro website, live YouTube thumbnails load
from i.ytimg.com (and show an editorial fallback if unavailable).
preview-desktop.png / preview-mobile.png show the offline layout checks.

No GitHub changes are made by extracting or copying these files.
