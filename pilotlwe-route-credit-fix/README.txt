PILOTLWE ROUTE AND VIDEO ATTRIBUTION FIX

1. Extract ZIP into D:\PilotLWE (folder pilotlwe-route-credit-fix).
2. Run:
   node .\pilotlwe-route-credit-fix\install.cjs --dry-run
   node .\pilotlwe-route-credit-fix\install.cjs
   npm.cmd run build
   npm.cmd run dev

Homepage phase 01-05 open matching History chapters.
IMPORTANT: As explicitly requested, phase 06 opens History / Naxalbari. To make
phase 06 open its own chapter instead, replace its homepage href with:
  pageUrl('history/#contraction')

The two obsolete pages are removed from Astro routes:
  src/pages/background/history/index.astro
  src/pages/background/history/naxalbari/index.astro
and old file-style naxalbari.astro if present.

For actual publishers (NDTV, etc.) rather than invented source names:
  node .\pilotlwe-route-credit-fix\fetch-publishers.cjs
This asks YouTube's public oEmbed metadata for the author_name per video ID.
It requires an internet connection, may fail for unavailable/blocked videos,
and NEVER invents the publisher. Unknown names display 'Original video on YouTube'.
You may add e.g. publisher: 'NDTV' manually only AFTER verifying the specific video.

Undo the installer:
  node .\pilotlwe-route-credit-fix\install.cjs --undo

No git commit/push is performed.
