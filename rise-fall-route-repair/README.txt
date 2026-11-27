RISE AND FALL - FIX 404 MISSING ASTRO PAGE

Why the error happens:
The History dropdown links to /history/rise-and-fall/, but the Astro route
src/pages/history/rise-and-fall.astro is missing from your project.

This package restores the standalone page, its RiseFallCollage component,
and 14 local images from the earlier approved page package.
The unwanted seven-box quick navigation is NOT included.

The script does NOT edit Header.astro, existing History pages, or any other
existing files. Existing files are kept unchanged.

1. Extract this ZIP directly into D:\PilotLWE.
   Confirm the file exists:
   D:\PilotLWE\rise-fall-route-repair\fix-route.cjs

2. In VS Code terminal:
   cd D:\PilotLWE
   node .\rise-fall-route-repair\fix-route.cjs --dry-run
   node .\rise-fall-route-repair\fix-route.cjs
   npm.cmd run build

3. Stop the running dev server with Ctrl+C, then restart:
   npm.cmd run dev

4. Visit:
   http://localhost:4321/PilotLWE/history/rise-and-fall/

5. Only after local verification:
   git add src/pages/history/rise-and-fall.astro src/components/RiseFallCollage.astro public/images/rise-and-fall
   git commit -m "Add Rise and Fall history page"
   git push origin main

If npm.cmd run build reports an error, send its first ERROR lines rather
than committing.
