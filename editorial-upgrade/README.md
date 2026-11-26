# The Naxal Archive — editorial redesign (local preview)

This package improves three views together:
1. Homepage article preview: image-led editorial carousel, next/previous buttons, swipe, and article selectors.
2. Articles page: featured article, cover-card grid, and category filters.
3. Whole article page: cover image, readable body, pull quotes, reading progress, and further reading.

It uses the existing Astro content collection. It DOES NOT publish or commit to GitHub. Open `preview.html` in your browser to compare mockups of all three layouts before installing.

## Install on Windows

1. Extract the ZIP inside `D:\thenaxalarchive`. The folder should be `D:\thenaxalarchive\editorial-upgrade\`.
2. Open VS Code terminal in `D:\thenaxalarchive`.
3. Optional check first:
   `node .\editorial-upgrade\install.cjs --dry-run`
4. Install locally:
   `node .\editorial-upgrade\install.cjs`
5. Preview:
   `npm.cmd run dev`
6. Open the local homepage and select articles, then test `/articles/` and `/articles/whose-liberation-after-all/`.
7. Validate the production build:
   `npm.cmd run build`

Do not commit or push until you are happy with the layout.

## Safe rollback

`node .\editorial-upgrade\restore-latest.cjs`

Backups are saved OUTSIDE your Git repo in `D:\thenaxalarchive-editorial-backups\...`.
The installer modifies the homepage article section and the article routes. The originals are backed up before replacement. Other homepage sections are untouched.

## Content and image fields

The homepage previously read `cover`, but the new articles used `image`. This redesign checks both, and adds `cover` to the two supplied article Markdown files. Cover images are installed under `public/images/articles/`.

Existing publication dates, article text, and their section labels are not changed by the installer.

## Notes

- The installer identifies existing article routes named `[slug].astro`, `[...slug].astro`, or `[id].astro`. It refuses multiple dynamic route files.
- It needs the source project's Astro dependencies already installed. `npm.cmd run build` remains the final compatibility check.
- If the original website uses a very different content schema or page layout, use the restore command and share the build error and `src/content/config.ts` or `src/content.config.ts`.
- Quoted testimonies and the statistic about sterilisation reversals should be checked against named sources before public release.
- Using a custom domain may require an Astro `base` setting update separately; this package follows the current project's `BASE_URL`.
