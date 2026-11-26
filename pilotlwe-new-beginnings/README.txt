PilotLWE - New Beginnings direct page replacement

1. Backup the existing file:
   D:\PilotLWE\src\pages\seeds-of-change\index.astro
2. Copy src/pages/seeds-of-change/index.astro from this package over that file.
3. Change the Header.astro navigation label "Seeds of Change" to "New Beginnings" while retaining href "seeds-of-change/".
4. In a PowerShell terminal opened in D:\PilotLWE:
   npm.cmd run build
   npm.cmd run dev
5. Open http://localhost:4321/PilotLWE/seeds-of-change/

All seven video links and all five report links remain in the new page.
No GitHub action is performed.
