THE NAXAL ARCHIVE - REMOVE 1980 FATALITIES DASHBOARD

1. Back up src/pages/data-visuals/lwe-fatalities-since-1980.astro outside src.
2. Delete src/pages/data-visuals/lwe-fatalities-since-1980.astro.
3. Copy major-incidents.astro to src/pages/data-visuals/major-incidents.astro.
4. Use VS Code Ctrl+Shift+F to find all references to:
   lwe-fatalities-since-1980
   Update old links to:
   major-incidents
5. Run npm.cmd run build, then npm.cmd run dev.
6. Visit /data-visuals/major-incidents/ (prefixed by Astro BASE_URL if configured).

The existing src/components/MajorIncidents.astro must already exist.
No article or dataset files are changed by these steps.
