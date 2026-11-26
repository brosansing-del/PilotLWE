THE NAXAL ARCHIVE - LOCAL ARTICLE REPAIR
========================================

What it fixes
1. Astro syntax error (Expected ')' but found ...) in src/pages/articles/[id].astro:
   removes an inline TypeScript generic cast from article markup.
2. Blank cover image in the homepage article preview:
   ensures both selected images have valid public assets and stable paths.
3. Uses the same cover images on the Articles listing and full article pages.

What it DOES NOT modify
- src/content/articles/*.md (your article text or frontmatter)
- src/pages/index.astro (homepage design)
- CSS layout or sections elsewhere
- GitHub or the live website

Steps on Windows
1. Stop `npm.cmd run dev` (Ctrl+C) if it is running.
2. Extract this ZIP into D:\thenaxalarchive so the folder is
   D:\thenaxalarchive\editorial-repair\ .
3. In VS Code terminal (PS D:\thenaxalarchive>):

   node .\editorial-repair\repair.cjs --dry-run
   node .\editorial-repair\repair.cjs
   npm.cmd run build
   npm.cmd run dev

4. Check the homepage carousel image, /articles/ and both full article pages.

If you need to undo the repair:
   node .\editorial-repair\repair.cjs --undo

Automatic backups are stored outside your Git repository,
under D:\thenaxalarchive-editorial-repair-backups\ .

If the image is still blank after a successful build:
- Open each image directly in your local browser, using the site's base URL.
- For base '/', test http://localhost:4321/images/articles/whose-liberation.webp
- For base '/thenaxalarchive/', test http://localhost:4321/thenaxalarchive/images/articles/whose-liberation.webp
- Share your astro.config.mjs and the image URL shown by browser Inspect.

Technical note: this patch fixes the specific errors shown in your screenshots.
The actual current Windows repo was not accessible for a full Astro build here.
