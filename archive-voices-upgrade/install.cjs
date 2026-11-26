'use strict';
/**
 * Local-only reversible website patch. No Git commands, network actions or
 * content collection schema changes are performed.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const kit = __dirname;
const dryRun = process.argv.includes('--dry-run');
const strict = (msg) => { console.error('Nothing changed. ' + msg); process.exit(1); };
const join = (relative) => path.join(root, relative);
const exists = (relative) => fs.existsSync(join(relative));
const read = (relative) => fs.readFileSync(join(relative), 'utf8');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');

if (!exists('package.json') || !exists('src/components/Header.astro') || !exists('src/pages/index.astro') || !exists('src/pages/articles/index.astro')) {
  strict('Run from the Astro website root. Header.astro, homepage, articles listing, or package.json is missing.');
}
const packageJson = JSON.parse(read('package.json'));
if (!Object.keys({...packageJson.dependencies, ...packageJson.devDependencies}).includes('astro')) {
  strict('package.json does not list Astro.');
}
if (exists('src/pages/victims-corner.astro')) strict('A Victims Corner page already exists at src/pages/victims-corner.astro. Please review that route before installing.');

function addFrontmatterImport(input, importLine) {
  if (input.includes(importLine)) return input;
  if (!/^---\s*\r?\n/.test(input)) strict('An Astro file is missing its opening --- frontmatter marker.');
  return input.replace(/^---\s*\r?\n/, (m) => m + importLine + '\n');
}
function insertBeforeMainClose(input, snippet, needle) {
  if (input.includes(needle)) return input;
  const close = input.lastIndexOf('</main>');
  if (close < 0) strict('Cannot identify closing </main> to insert a video section.');
  return input.slice(0, close) + '\n    ' + snippet + '\n  ' + input.slice(close);
}

function updateHeader(input) {
  const navAnchor = /(<a\b[^>]*href\s*=\s*\{url\(['"]articles\/['"]\)\}[^>]*>)([\s\S]*?)(<\/a>)/gi;
  let recognized = false;
  let next = input.replace(navAnchor, (all, open, body, close) => {
    const label = body.replace(/<[^>]*>/g, '').trim();
    if (label !== 'Articles' && label !== 'Opinions') return all;
    recognized = true;
    return open + 'Opinions' + close;
  });
  if (!recognized) strict('Could not safely find the existing Articles navigation link in Header.astro. No files modified.');
  if (!next.includes("url('victims-corner/')") && !next.includes('url("victims-corner/")')) {
    let inserted = false;
    next = next.replace(navAnchor, (all, open, body, close) => {
      if (inserted || body.replace(/<[^>]*>/g, '').trim() !== 'Opinions') return all;
      inserted = true;
      return all + "\n      <a href={url('victims-corner/')}>Victims&rsquo; Corner</a>";
    });
    if (!inserted) strict('Could not insert the Victims Corner link after Opinions.');
  }
  if (!next.includes('ARCHIVE VIDEO NAV COMPACT')) {
    const styleEnd = next.lastIndexOf('</style>');
    if (styleEnd >= 0) {
      next = next.slice(0, styleEnd)
        + '  /* ARCHIVE VIDEO NAV COMPACT */\n'
        + '  @media (min-width: 901px) and (max-width: 1320px) { .header-inner{gap:16px} .main-nav{gap:clamp(9px,1.2vw,18px)} .main-nav > a,.nav-dropdown-trigger{font-size:12px} }\n'
        + next.slice(styleEnd);
    }
  }
  return next;
}

function updateArticlesIndex(input) {
  let next = addFrontmatterImport(input, "import ArchiveVideoCollection from '../../components/ArchiveVideoCollection.astro';");
  next = next.replace('Stories, context <em>&amp; perspective.</em>', 'Perspectives <em>&amp; Voices.</em>');
  next = next.replace(/(<span>)\s*Articles\s*(<\/span>)/i, '$1Opinions$2');
  next = next.replace('ARTICLES IN<br/>THE ARCHIVE', 'PIECES IN<br/>THE ARCHIVE');
  next = next.replace('ARTICLES IN<br />THE ARCHIVE', 'PIECES IN<br />THE ARCHIVE');
  next = next.replace('<BaseLayout>', '<BaseLayout title="Opinions | The Naxal Archive" description="Perspectives, analysis and interviews from The Naxal Archive.">');
  next = next.replace('Explore the events, ideas and lived experiences behind the history of the Naxalite movement.', 'Explore analyses, opinions and interviews about the history, ideas and human experiences behind Left-Wing Extremism.');
  return insertBeforeMainClose(next, '<!-- ARCHIVE VOICES: interviews -->\n    <ArchiveVideoCollection mode="interviews" />', '<ArchiveVideoCollection mode="interviews" />');
}

function updateHome(input) {
  let next = addFrontmatterImport(input, "import ArchiveVideoCollection from '../components/ArchiveVideoCollection.astro';");
  return insertBeforeMainClose(next, '<!-- ARCHIVE VOICES: homepage preview -->\n    <ArchiveVideoCollection mode="home" />', '<ArchiveVideoCollection mode="home" />');
}

function updateShowcase(input) {
  return input.replace(/Explore all articles/g, 'Explore opinions')
    .replace(/Featured articles/g, 'Featured opinions')
    .replace(/Latest articles/g, 'Latest opinions');
}

const edits = [
  { relative: 'src/components/Header.astro', bytes: Buffer.from(updateHeader(read('src/components/Header.astro'))) },
  { relative: 'src/pages/index.astro', bytes: Buffer.from(updateHome(read('src/pages/index.astro'))) },
  { relative: 'src/pages/articles/index.astro', bytes: Buffer.from(updateArticlesIndex(read('src/pages/articles/index.astro'))) },
  { relative: 'src/data/archiveVideos.ts', source: 'src/data/archiveVideos.ts', newOnly: true },
  { relative: 'src/components/ArchiveVideoCollection.astro', source: 'src/components/ArchiveVideoCollection.astro', newOnly: true },
  { relative: 'src/pages/victims-corner/index.astro', source: 'src/pages/victims-corner/index.astro', newOnly: true },
];
if (exists('src/components/ArticleShowcase.astro')) {
  edits.push({ relative: 'src/components/ArticleShowcase.astro', bytes: Buffer.from(updateShowcase(read('src/components/ArticleShowcase.astro'))) });
}
for (const edit of edits) {
  if (edit.source) edit.bytes = fs.readFileSync(path.join(kit,edit.source));
  if (edit.newOnly && exists(edit.relative) && !fs.readFileSync(join(edit.relative)).equals(edit.bytes)) {
    strict('A custom file already exists at ' + edit.relative + '. Not overwriting it.');
  }
}
const changes = edits.filter((edit) => !exists(edit.relative) || !fs.readFileSync(join(edit.relative)).equals(edit.bytes));

console.log('THE NAXAL ARCHIVE - OPINIONS AND VICTIMS CORNER');
console.log('Project: ' + root);
console.log('The existing /articles/ paths are preserved. Only display labels change.');
console.log(changes.length + ' file(s) to add / update:');
for (const edit of changes) console.log('  ' + (exists(edit.relative) ? 'UPDATE ' : 'CREATE ') + edit.relative);
if (dryRun) {console.log('Dry run complete. Nothing changed.');process.exit(0);}
if (!changes.length) {console.log('Already installed. Nothing changed.');process.exit(0);}

const folder = root + '-voices-backups';
const stamp = new Date().toISOString().replace(/[:.]/g,'-');
const backup = path.join(folder,stamp + '-' + crypto.randomBytes(3).toString('hex'));
const manifest = {projectRoot:root,installedAt:new Date().toISOString(),files:[]};
try {
  for (const edit of changes) {
    const existsBefore = exists(edit.relative);
    const item = {relative:edit.relative,existed:existsBefore,installedSha256:sha(edit.bytes)};
    if (existsBefore) {
      const original = path.join(backup,'original',edit.relative);
      fs.mkdirSync(path.dirname(original),{recursive:true});
      fs.copyFileSync(join(edit.relative),original);
    }
    manifest.files.push(item);
  }
  fs.mkdirSync(backup,{recursive:true});
  fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2));
  for (const edit of changes) {
    fs.mkdirSync(path.dirname(join(edit.relative)),{recursive:true});
    fs.writeFileSync(join(edit.relative),edit.bytes);
  }
} catch(error) {
  for (const item of manifest.files) {
    try {
      const target=join(item.relative);
      const saved=path.join(backup,'original',item.relative);
      if (item.existed && fs.existsSync(saved)) fs.copyFileSync(saved,target);
      else if (!item.existed && fs.existsSync(target)) fs.unlinkSync(target);
    } catch(e) {console.error('Could not restore a file:', item.relative, e.message);}
  }
  console.error('Installation stopped and rollback attempted:',error.message);
  process.exit(1);
}
console.log('Local installation complete. No GitHub actions were performed.');
console.log('Backup: ' + backup);
console.log('Next: npm.cmd run build && npm.cmd run dev');
