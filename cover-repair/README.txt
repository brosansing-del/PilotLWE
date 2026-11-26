THE NAXAL ARCHIVE - MISSING ARTICLE COVER CHECK
================================================

THE PROBLEM
Older articles appear with broken image icons or visible alt text in the new
carousel and article pages. The two newly added covers were bundled in an
older repair, but old articles may refer to files that are not in public/.

FIRST: FIND THE REAL CAUSE (no files changed)
In VS Code terminal, from D:\thenaxalarchive:
    node .\cover-repair\audit.cjs

The report lists each article as:
- OK: referenced local image file exists under public/.
- MISSING: referenced local image does not exist at the expected path.
- EXTERNAL: remote URL cannot be verified by this local audit.
- NO COVER: article has no configured image.

SECOND: OPTIONAL DISPLAY FIX
This stops broken image icons/alt text appearing by replacing failed images
with a styled editorial fallback. It does NOT fabricate missing image files.

    node .\cover-repair\install.cjs --dry-run
    node .\cover-repair\install.cjs
    npm.cmd run build
    npm.cmd run dev

If the audit reports MISSING, copy the correct original image into
public/images/articles/, then set the corresponding Markdown frontmatter
'image:' or 'cover:' to the local image URL.
Example:
    image: "/images/articles/rehabilitation-story.webp"

Your Astro BASE_URL is automatically applied by the installed templates.
Do not add /thenaxalarchive/ manually to frontmatter image paths.

If the audit reports EXTERNAL, the external site may have removed the image or
may block hotlinking. Copy an image you have permission to use into public/.

To undo the optional display fix:
    node .\cover-repair\install.cjs --undo

SAFETY
- This package does not edit any article Markdown files, image files or Git.
- Before patching, it backs up three article display templates outside the
  Git repository under D:\thenaxalarchive-cover-fix-backups\.
- No GitHub publishing is performed.
- If your templates differ materially, installer refuses to modify them.
