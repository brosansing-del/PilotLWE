# PilotLWE — Victims' Corner media coverage update

This is intentionally limited to Victims' Corner. `src/data/archiveVideos.ts` and the shared `ArchiveVideoCollection.astro` are not changed because they also drive homepage and Opinions video lists.

New or updated files:
- `src/pages/victims-corner/index.astro` (replacement)
- `src/components/VictimsMediaGallery.astro` (new)
- `src/data/victimsArticles.ts` (new, empty until victim-related article links are supplied)

## Install in VS Code (D:\\PilotLWE)
1. Unzip this package. Make sure `victims-media-update` is inside your project folder.
2. Stop Astro (`Ctrl+C`).
3. Run `node .\\victims-media-update\\install.cjs --dry-run`.
4. If the dry-run lists only the three expected files, run `node .\\victims-media-update\\install.cjs`.
5. Run `npm.cmd run build`, then `npm.cmd run dev`.
6. Open `http://localhost:4321/PilotLWE/victims-corner/` (or the address Astro prints).
7. Test All Stories / Videos / Articles. Articles will show a clear empty state until you add links to `src/data/victimsArticles.ts`.

## Add a Victims' Corner article
Edit `src/data/victimsArticles.ts` and add objects to `victimsArticles`, e.g.:

```ts
{
  title: 'Verified article title',
  url: 'https://publisher.example/article',
  publisher: 'Verified publication name',
  description: 'Short source-attributed summary',
  date: 'Apr 2017',
  location: 'Sukma, Chhattisgarh',
  image: '/images/articles/optional-cover.jpg',
}
```

These are **examples**, not an article included in this package.

Existing videos show incident date/location only if those fields have been explicitly added to the video entry; this package does not extract or guess dates/locations from prose.

## Rollback
Run `node .\\victims-media-update\\install.cjs --undo` to restore the pre-install page and remove the two newly installed files if they were created by this package. Installer backups are saved in `.victims-media-update-backup/` at the project root. Do not run `git clean` before reviewing changes.
