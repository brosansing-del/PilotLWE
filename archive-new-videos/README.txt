THE NAXAL ARCHIVE - NINE NEW VIDEOS

Adds 4 Victims' Corner and 5 Opinions / Interviews videos to the existing catalogue.
Does not overwrite earlier entries. Safe to run twice. All are reviewed:false until
an editor checks the recordings and source claims. No videos are downloaded.

1. Extract this ZIP into D:\thenaxalarchive, creating folder archive-new-videos.
2. In VS Code terminal, from D:\thenaxalarchive, run:
     node .\archive-new-videos\add-nine-videos.cjs --dry-run
     node .\archive-new-videos\add-nine-videos.cjs
     npm.cmd run build
     npm.cmd run dev
3. Check Opinions and Victims' Corner pages locally.
4. No git commit or push is performed.

If you need to undo ONLY the first successful run and have not changed the catalogue since,
copy src\data\archiveVideos.ts.before-nine-videos.bak back to src\data\archiveVideos.ts.

If the installer says it cannot find src/data/archiveVideos.ts, locate your current
catalogue. Do not create a second archiveVideos.ts: it will not be connected to the pages.
