# The Naxal Archive | Opinions and Victims' Corner

This is a **local Astro update**. It does not run Git commands, deploy the site, or modify your existing article Markdown files.

## What it changes

- Renames the main navigation item **Articles** to **Opinions**.
- Preserves `/articles/` and all existing `/articles/<slug>/` URLs to avoid breaking previously shared links.
- Changes the Articles listing heading to **Perspectives & Voices**.
- Adds the four contributor-supplied post-surrender interviews to the Opinions listing.
- Adds a separate main navigation item **Victims' Corner**.
- Creates `/victims-corner/` with the heading **The Human Cost of Conflict** and the five supplied YouTube videos.
- Adds a small **Voices from the Archive** preview to the homepage, linking to both sections.
- Stores all nine video entries in one easily updated file: `src/data/archiveVideos.ts`.
- Displays video thumbnails from YouTube with a built-in image fallback if a thumbnail cannot load.
- Keeps all videos on YouTube rather than downloading or rehosting them.

## Installation in VS Code (Windows)

1. Extract the package ZIP to `D:\thenaxalarchive` so that the folder `archive-voices-upgrade` appears at the project root.
2. Open the VS Code terminal in `D:\thenaxalarchive`. Stop the dev server first with `Ctrl + C` if it is still running.
3. Check the proposed changes without editing files:

   ```powershell
   node .\archive-voices-upgrade\install.cjs --dry-run
   ```

4. Apply the update:

   ```powershell
   node .\archive-voices-upgrade\install.cjs
   ```

5. Build and preview:

   ```powershell
   npm.cmd run build
   npm.cmd run dev
   ```

6. Open the homepage, `/articles/` (now labelled **Opinions**), and `/victims-corner/`. If the site uses an Astro `base` prefix, open these pages through the site's navigation menu instead of entering a root-relative URL.

### How to update videos later

Edit `src/data/archiveVideos.ts`. For each new YouTube video, add an entry with the YouTube 11-character ID, title, category (`interview` or `victim`), context and a reviewed description. The pages will include the new entry automatically on the next Astro build. For the homepage preview to show the newest featured story in each category, place the new entry before older entries of the same category.

You can revise the `title`, `context` and `description` when a video has been reviewed. Set `reviewed: true` **only after** you have checked the original material. The initial five Victims' Corner videos intentionally use temporary labels because the supplied material did not establish all of their identifying details.

### Safe rollback

The installer stores a backup in a sibling folder outside the website project (`D:\thenaxalarchive-voices-backups\...`). To restore the prior website **before editing the installed files**, run:

```powershell
node .\archive-voices-upgrade\restore-latest.cjs
```

It refuses to overwrite changes made after installation. It does not run Git or touch the live website.

### Important editorial checks

- The nine YouTube IDs were transcribed from the contributor-provided screenshot. Check the original videos, their availability and publication details before the final public release.
- The initial blurbs describe the supplied categories and persons; they are **not** video transcripts or verified summaries of specific claims.
- Video thumbnails are fetched from `i.ytimg.com` on the visitor's device, so internet access is required for the images. An elegant fallback appears if they are unavailable.
- Some conflict-related videos may contain disturbing imagery. Consider reviewing them before promoting them on the homepage.

### Files changed by the installer

- `src/components/Header.astro`
- `src/pages/index.astro`
- `src/pages/articles/index.astro`
- `src/components/ArticleShowcase.astro` (if present)

### Files added by the installer

- `src/data/archiveVideos.ts`
- `src/components/ArchiveVideoCollection.astro`
- `src/pages/victims-corner/index.astro`

No content schema changes, article removals, external npm dependencies, or image downloads are required.

## Preview files

The included desktop and mobile preview images were rendered using the package's CSS. The screenshots use thumbnail crops from the supplied reference image, rather than live YouTube access. The live website will use each YouTube video's actual thumbnail URL.

The previews were checked for horizontal overflow at desktop and phone widths. Because the current Windows project is not available in this environment, the Astro production build still needs to run locally in your project.
