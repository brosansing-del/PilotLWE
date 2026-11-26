/*
 * The Naxal Archive - standalone About Us page migration
 * Run from project root: node .\about-us-page\install-about-page.cjs
 * Uses only built-in Node.js modules; does not run Git or deploy anything.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const root = process.cwd();
const indexFile = path.join(root, 'src', 'pages', 'index.astro');
const headerFile = path.join(root, 'src', 'components', 'Header.astro');
const componentFile = path.join(root, 'src', 'components', 'AboutSection.astro');
const aboutPageFile = path.join(root, 'src', 'pages', 'about', 'index.astro');
const alternatePageFile = path.join(root, 'src', 'pages', 'about.astro');
const componentSource = path.join(__dirname, 'AboutSection.astro');
const pageSource = path.join(__dirname, 'about', 'index.astro');

function fail(message) {
  console.error('\nNo files were changed. ' + message + '\n');
  process.exit(1);
}
for (const file of [indexFile, headerFile, componentSource, pageSource]) {
  if (!fs.existsSync(file)) fail('Missing: ' + file);
}
if (fs.existsSync(alternatePageFile)) {
  fail('src/pages/about.astro already exists. Check that route before creating src/pages/about/index.astro.');
}
if (fs.existsSync(aboutPageFile) &&
    !fs.readFileSync(aboutPageFile, 'utf8').includes('About Us standalone page: The Naxal Archive')) {
  fail('src/pages/about/index.astro already exists and was not made by this installer.');
}

const oldIndex = fs.readFileSync(indexFile, 'utf8');
const oldHeader = fs.readFileSync(headerFile, 'utf8');
let index = oldIndex;
let header = oldHeader;

// Remove the previous homepage-based AboutSection component, if present.
index = index.replace(/^\s*import\s+AboutSection\s+from\s+['"]\.\.\/components\/AboutSection\.astro['"];?\s*\r?\n/gm, '\n');
index = index.replace(/\s*<!--\s*ABOUT US SECTION\s*-->\s*/g, '\n');
index = index.replace(/^[ \t]*<AboutSection\s*\/>[ \t]*\r?\n/gm, '');

// Optionally migrate the older inlined About/Contact section from earlier drafts.
const aboutSectionOpen = /<section\b(?=[^>]*\bid\s*=\s*['"]about['"])(?=[^>]*\bclass\s*=\s*['"][^'"]*\b(?:about-section|na-about)\b[^'"]*['"])[^>]*>/i;
const foundSection = aboutSectionOpen.exec(index);
if (foundSection) {
  const start = foundSection.index;
  const closing = index.indexOf('</section>', start + foundSection[0].length);
  if (closing < 0) fail('Could not find the closing tag of the old About section.');
  const body = index.slice(start + foundSection[0].length, closing);
  if (/<section\b/i.test(body)) fail('Old inline About section contains nested sections. Remove it manually first.');
  index = index.slice(0, start) + index.slice(closing + '</section>'.length);
}
// Abort rather than deleting unknown content from the homepage.
if (/id\s*=\s*['"]about['"]/.test(index) || /<AboutSection\b/.test(index)) {
  fail('An additional About section is still present in src/pages/index.astro. Remove it manually first.');
}
if (!index.includes('</main>')) fail('Could not find </main> in homepage.');

// Update the navigation link or add it after Tracking Development.
const aboutAnchors = [...header.matchAll(/<a\b[^>]*>\s*About Us\s*<\/a>/g)];
if (aboutAnchors.length > 1) fail('More than one About Us navigation link was found.');
if (aboutAnchors.length === 1) {
  const original = aboutAnchors[0][0];
  if (!/\bhref\s*=/.test(original)) fail('Existing About Us link is missing href.');
  const replacement = original.replace(/\bhref\s*=\s*(?:\{url\([^)]*\)\}|['"][^'"]*['"])/, "href={url('about/')}");
  if (replacement === original && !original.includes("url('about/')")) fail('Could not update existing About Us href.');
  header = header.replace(original, replacement);
} else {
  const trackingLink = /(<a\s+href=\{url\(['"]#development['"]\)\}[^>]*>\s*Tracking Development\s*<\/a>)/;
  if (!trackingLink.test(header)) fail('Tracking Development link not found in Header.astro.');
  header = header.replace(trackingLink, "$1\n      <a href={url('about/')}>About Us</a>");
}

// Back up original files outside the Git repository before writing anything.
const backupDir = path.join(os.homedir(), 'naxalarchive-backups',
  'about-page-' + new Date().toISOString().replace(/[:.]/g, '-'));
fs.mkdirSync(backupDir, { recursive: true });
for (const [src, name] of [[indexFile, 'index.astro'], [headerFile, 'Header.astro'],
  [componentFile, 'AboutSection.astro'], [aboutPageFile, 'about-index.astro']]) {
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(backupDir, name));
}

// Write only these specific project files. Safe to re-run without duplicate links.
if (index !== oldIndex) fs.writeFileSync(indexFile, index, 'utf8');
if (header !== oldHeader) fs.writeFileSync(headerFile, header, 'utf8');
fs.mkdirSync(path.dirname(aboutPageFile), { recursive: true });
fs.copyFileSync(componentSource, componentFile);
fs.copyFileSync(pageSource, aboutPageFile);

console.log('\nStandalone About Us page installed.');
console.log('  Page: src/pages/about/index.astro');
console.log('  Component: src/components/AboutSection.astro');
console.log('  Header: About Us -> /about/ (with Astro BASE_URL)');
console.log('  Homepage: old About Us component/section removed if found');
console.log('  Backups: ' + backupDir);
console.log('\nVerify: npm.cmd run build && npm.cmd run preview');
console.log('On GitHub Pages: /thenaxalarchive/about/');
