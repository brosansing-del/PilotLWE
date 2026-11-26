'use strict';
/* Safe, local-only, reversible heading style installer for The Naxal Archive. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const kit = __dirname;
const dry = process.argv.includes('--dry-run');
const STYLE = 'src/styles/naxal-section-headings.css';
const pageCandidates = [
  'src/pages/history/index.astro',
  'src/pages/history.astro',
  'src/pages/background/index.astro',
  'src/pages/background.astro',
  'src/pages/data-visuals/index.astro',
  'src/pages/data-visuals/major-incidents.astro',
  'src/pages/opinions/index.astro',
  'src/pages/articles/index.astro',
  'src/pages/victims-corner/index.astro',
  'src/pages/victims-corner.astro',
  'src/pages/tracking-development/index.astro',
  'src/pages/tracking-development.astro',
  'src/pages/about/index.astro',
  'src/pages/about.astro',
  'src/components/AboutSection.astro',
  'src/components/MajorIncidents.astro'
];

const abs = (p) => path.join(root, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), 'utf8');
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
function fatal(s) { console.error('Nothing changed. ' + s); process.exit(1); }
if (!exists('package.json') || !exists('src/pages/index.astro')) fatal('Run this from the website root (D:\\thenaxalarchive).');
if (!fs.existsSync(path.join(kit, 'naxal-section-headings.css'))) fatal('The CSS file is missing from the update package.');
const css = fs.readFileSync(path.join(kit, 'naxal-section-headings.css'));
const writes = [];
let seen = 0;
let skip = [];
for (const file of pageCandidates) {
  if (!exists(file)) continue;
  let before = read(file);
  // Only modify known Astro page files with proper frontmatter and a literal H1.
  if (!/^---\s*\r?\n/.test(before) || !before.includes('\n---')) { skip.push(file + ' (frontmatter not found)'); continue; }
  const headingTag = file === 'src/components/MajorIncidents.astro' ? 'h2' : 'h1';
  const headingPattern = headingTag === 'h2' ? /<h2\b(?=[^>]*id=['\"]mi-heading['\"])([^>]*)>/i : /<h1\b([^>]*)>/i;
  const openHeading = headingPattern.exec(before);
  if (!openHeading) { skip.push(file + ' (no matching page heading found)'); continue; }
  seen++;
  const headingInnerPattern = headingTag === 'h2' ? /<h2\b[^>]*id=['\"]mi-heading['\"][^>]*>([\s\S]*?)<\/h2>/i : /<h1\b[^>]*>([\s\S]*?)<\/h1>/i;
  const inner = headingInnerPattern.exec(before);
  const plain = inner ? inner[1].replace(/<[^>]+>/g, ' ').replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim() : '';
  const type = file.startsWith('src/components/') || plain.length >= 27 || /<br\b/i.test(inner?.[1] || '') ? 'long' : 'short';
  let after = before;
  // Set only the title attribute, never rewrite any page text.
  after = after.replace(headingPattern, (whole, attrs) => {
    if (/data-na-section-heading\s*=/.test(attrs)) return whole.replace(/data-na-section-heading\s*=\s*['"][^'"]*['"]/, `data-na-section-heading="${type}"`);
    return `<${headingTag}${attrs} data-na-section-heading="${type}">`;
  });
  const relativeImport = path.relative(path.dirname(abs(file)), abs(STYLE)).replace(/\\/g, '/');
  const importPath = relativeImport.startsWith('.') ? relativeImport : './' + relativeImport;
  const importLine = `import '${importPath}';`;
  if (!after.includes(importLine)) {
    after = after.replace(/^---\s*\r?\n/, (m) => m + importLine + '\n');
  }
  if (before !== after) writes.push({ file, content: Buffer.from(after), prev: Buffer.from(before) });
}
if (!seen) fatal('No supported page titles were found. Please share the relevant Astro page files.');
if (!exists(STYLE) || !fs.readFileSync(abs(STYLE)).equals(css)) {
  writes.unshift({ file: STYLE, content: css, prev: exists(STYLE) ? fs.readFileSync(abs(STYLE)) : null });
}
console.log('THE NAXAL ARCHIVE - CONSISTENT SECTION HEADINGS');
console.log('Project: ' + root);
console.log('Style: bold, large serif titles with responsive sizing');
console.log('Pages scanned: ' + seen);
console.log('Changes: ' + writes.length);
for (const w of writes) console.log('  ' + (w.prev === null ? 'CREATE ' : 'UPDATE ') + w.file);
for (const s of skip) console.log('  SKIP   ' + s);
console.log('Homepage and full article text are not modified.');
if (dry) { console.log('Dry run complete. Nothing was changed.'); process.exit(0); }
if (!writes.length) { console.log('Already installed. No changes needed.'); process.exit(0); }
const backupRoot = path.join(kit, '.backups');
const suffix = new Date().toISOString().replace(/[:.]/g, '-');
const destination = path.join(backupRoot, suffix);
const manifest = { timestamp: suffix, root, files: [] };
fs.mkdirSync(destination, { recursive: true });
for (let i = 0; i < writes.length; i++) {
  const w = writes[i];
  if (w.prev !== null) {
    const filename = String(i).padStart(3,'0') + '.bak';
    fs.writeFileSync(path.join(destination, filename), w.prev);
    manifest.files.push({ file: w.file, exists: true, backup: filename, installedSha256: hash(w.content) });
  } else manifest.files.push({ file: w.file, exists: false, backup: null, installedSha256: hash(w.content) });
}
fs.writeFileSync(path.join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2));
let applied = [];
try {
  for (const w of writes) {
    fs.mkdirSync(path.dirname(abs(w.file)), { recursive: true });
    fs.writeFileSync(abs(w.file), w.content);
    applied.push(w);
  }
  console.log('Installation complete. Backup: ' + destination);
} catch (e) {
  let rollbackErrors = [];
  for (const w of applied.reverse()) {
    try { if (w.prev === null) fs.unlinkSync(abs(w.file)); else fs.writeFileSync(abs(w.file), w.prev); }
    catch (re) { rollbackErrors.push(w.file + ': ' + re.message); }
  }
  console.error('Installation failed: ' + e.message);
  if (rollbackErrors.length) console.error('Rollback problems:\n' + rollbackErrors.join('\n'));
  process.exit(1);
}
