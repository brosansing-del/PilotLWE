THE NAXAL ARCHIVE — APPROVED UPDATES (LOCAL VS CODE)

WHAT CHANGES
1. Adds Seeds of Change at /seeds-of-change/ in place of the visible Life After Surrender navigation item.
   Sections: Weapons Down, Lives Up; Reaching the Last Mile.
   Seven existing video links + five externally linked reports (publisher attributed).
2. Adds History > Political Organisation and Leadership, including full supplied 15-topic text and user-supplied diagram.
3. Adds one Victims' Corner video (uwZY64u-SP0) and two Opinions videos (nJTdvrmsYHA and u1iESYYp3VI) to the existing catalogue.
4. Updates original five video entries with non-numbered descriptive captions; replaces the visible 'Summary awaiting review' status with a generic original-uploader courtesy line.
5. Leaves the original /life-after-surrender/ URL and its files intact for backward compatibility. New navigation points to Seeds of Change.

INSTALL
1. Unzip archive-update folder to D:\thenaxalarchive\archive-update
2. Open VS Code terminal in D:\thenaxalarchive
3. Stop Astro dev server (Ctrl+C)
4. node .\archive-update\install.cjs --dry-run
5. node .\archive-update\install.cjs
6. npm.cmd run build
7. npm.cmd run dev

CHECK
- Seeds of Change in header; new page /seeds-of-change/
- Both headings and seven video thumbnails
- Reports & Features with five original publication links
- History dropdown > Political Organisation and Leadership
- History page /history/#political-organisation shows diagram and all 15 sections
- Victims' Corner: original five no longer display numerical titles or 'Summary awaiting review'; Human Cost of Conflict video added
- Opinions: former IED specialist and democracy in conflict-zone clips added

UNDO
node .\archive-update\install.cjs --undo

IMPORTANT
The installer expects the earlier Opinions/Victims Corner component and video catalogue to be present in src/components/ArchiveVideoCollection.astro and src/data/archiveVideos.ts.
It preserves previously added catalogue entries, skips duplicate video IDs, and creates backups in .archive-update-backups outside src.
Source attribution is generic ('original YouTube publisher') where the exact channel is not known. Please confirm individual publishers and claims prior to public release.
The 15-part Political Organisation text is derived from your attached draft. The diagram is user supplied.
No GitHub commit, push or production deployment is performed by this installer.
