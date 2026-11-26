# The Naxal Archive — separate About Us page

This package moves About Us off the homepage and makes it a **dedicated page**.

The new page uses the visual style you approved: **History in context. People in focus.**, a dark-green Vision & Mission panel, expandable editorial commitments and a contact area. It uses **thenaxalarchieve@gmail.com**.

**New link:** `https://brosansing-del.github.io/thenaxalarchive/about/` after publishing.

## Install using VS Code (Windows)

1. Extract this ZIP into `D:\thenaxalarchive\` so that this file is at `D:\thenaxalarchive\about-us-page\README.md`.
2. Open the VS Code terminal at `D:\thenaxalarchive`.
3. Run:

   ```powershell
   node .\about-us-page\install-about-page.cjs
   npm.cmd run build
   npm.cmd run preview
   ```

4. Open the URL shown by Astro, then click **About Us** in the header. It should open a **full page** rather than scrolling within Home.
5. Return to Home and confirm the About Us content no longer appears on the homepage.
6. If correct, publish:

   ```powershell
   git add src/pages/index.astro src/pages/about/index.astro src/components/Header.astro src/components/AboutSection.astro
   git commit -m "Move About Us to dedicated page"
   git push origin main
   ```

## What the installer changes

- Creates `src/pages/about/index.astro` (new route)
- Adds/replaces `src/components/AboutSection.astro` (the approved design)
- Updates `src/components/Header.astro`: **About Us** now links to `url('about/')`
- Removes `<AboutSection />` from `src/pages/index.astro` if you previously installed the About Us homepage section
- Also removes the known older inline `<section class="about-section" id="about">...</section>` if still present
- Preserves all other homepage sections and the existing header logic
- Creates backups of existing files in your Windows user's `naxalarchive-backups` folder before changing anything

The installer does not run Git or publish the site. It will stop if it finds an unknown existing About page or an unfamiliar inline About section, to avoid deleting content.

If an older inline About section's unused styles remain in `index.astro`, they can be removed later; they do not display content on Home.

## Manual installation alternative

1. Copy `AboutSection.astro` to `src/components/AboutSection.astro`.
2. Copy `about/index.astro` to `src/pages/about/index.astro`.
3. In `src/components/Header.astro`, put `<a href={url('about/')}>About Us</a>` after Tracking Development.
4. Remove `import AboutSection ...` and `<AboutSection />` from the homepage's `src/pages/index.astro`.
5. Build/test before committing.

No other npm packages, external fonts or photos are needed.
