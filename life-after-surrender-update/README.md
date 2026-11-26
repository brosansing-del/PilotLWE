THE NAXAL ARCHIVE — LIFE AFTER SURRENDER: SEVEN VIDEO STORIES

This package adds 7 supplied YouTube links to a dedicated page with two groups:
- Rehabilitation & Livelihoods (3 videos)
- Communities & Civic Life (4 videos)

PREPARE
1. In VS Code, open D:\thenaxalarchive.
2. Back up src\pages\life-after-surrender\index.astro if it already exists.
3. Extract the zip into your project directory (merge src folder).

FILES
src/pages/life-after-surrender/index.astro
src/data/surrenderVideos.ts

PREVIEW
npm.cmd run build
npm.cmd run dev
Open http://localhost:4321/life-after-surrender/

NOTES
- No change to the Header navigation is needed if you have already added Life After Surrender.
- The video links open their source recordings on YouTube in another tab.
- YouTube thumbnail images are loaded from i.ytimg.com; the page shows a branded visual fallback when unavailable.
- All descriptions are based on submitted headlines. reviewed:false flags the need for editorial verification of details.
- The last four videos are categorized as community change, not personal surrender stories. This prevents their content from being misrepresented.
- Add more items in src/data/surrenderVideos.ts to grow the collection.
- No GitHub files are changed by this downloadable package until you copy them to your project and commit/push.
