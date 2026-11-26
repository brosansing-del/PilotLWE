/** Local-only installer for The Naxal Archive editorial UI. No git/network calls. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');

const root = process.cwd();
const pkg = __dirname;
const dryRun = process.argv.includes('--dry-run');
const relHome = 'src/pages/index.astro';
const homePath = path.join(root, relHome);
const articlesDir = path.join(root,'src','pages','articles');
const fileExists = file => fs.existsSync(path.join(root,file));
const fail = message => { console.error('\nERROR: ' + message); process.exit(1); };

if (!fs.existsSync(homePath) || !fileExists('package.json')) {
  fail('Run this command in your website root (e.g. D:\\thenaxalarchive). src/pages/index.astro or package.json was not found.');
}
const packageJson = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if (!Object.keys({...packageJson.dependencies,...packageJson.devDependencies}).some(name => name === 'astro')) {
  fail('This folder does not appear to contain an Astro project.');
}
if (fileExists('src/pages/articles.astro')) fail('Your site uses src/pages/articles.astro for its articles page. Please share that file so the installer can avoid creating a conflicting route.');
const routes = fs.existsSync(articlesDir) ? fs.readdirSync(articlesDir).filter(name => /^\[.*\]\.astro$/.test(name)) : [];
if (routes.length > 1) fail('Found multiple dynamic article routes: ' + routes.join(', ') + '. Please select the correct route manually.');
const route = routes[0] || '[slug].astro';
const param = route.match(/^\[(?:\.\.\.)?([^\]]+)\]\.astro$/)?.[1] || 'slug';
let routeContent = fs.readFileSync(path.join(pkg,'src/pages/articles/[slug].astro'),'utf8');
if (param !== 'slug') routeContent = routeContent.replace(/params: \{ slug: entry.id \}/,'params: { ' + param + ': entry.id }');

let homeContent = fs.readFileSync(homePath,'utf8');
const importLine = "import ArticleShowcase from '../components/ArticleShowcase.astro';";
if (!homeContent.includes(importLine)) {
  const marker = /^---\s*\r?\n/;
  if (!marker.test(homeContent)) fail('Homepage has no valid Astro frontmatter.');
  homeContent = homeContent.replace(marker, m => m + importLine + '\n');
}
if (!homeContent.includes('<ArticleShowcase articles={articles} />')) {
  const section = /<section\b(?=[^>]*\bid\s*=\s*["']articles["'])[^>]*>[\s\S]*?<\/section>/i;
  if (!section.test(homeContent)) fail('Could not safely find the homepage Articles section. No files were changed.');
  homeContent = homeContent.replace(section,'<ArticleShowcase articles={articles} />');
}
if (!/const articles\s*=/.test(homeContent)) fail('Homepage article collection variable not found. No files were changed.');

const edits = [
  { dest: relHome, content: Buffer.from(homeContent) },
  { dest: 'src/components/ArticleShowcase.astro', source: 'src/components/ArticleShowcase.astro' },
  { dest: 'src/pages/articles/index.astro', source: 'src/pages/articles/index.astro' },
  { dest: 'src/pages/articles/' + route, content: Buffer.from(routeContent) },
  { dest: 'public/images/articles/children-of-maoists.webp', source: 'public/images/articles/children-of-maoists.webp' },
  { dest: 'public/images/articles/whose-liberation.webp', source: 'public/images/articles/whose-liberation.webp' },
];

// No article Markdown edits are needed. All three UI templates already
// support the existing `image` and `cover` metadata fields, avoiding locked
// Markdown files while Astro/VS Code is running on Windows.

const resolveBytes = edit => edit.content || fs.readFileSync(path.join(pkg,edit.source));
const changes = edits.filter(edit => {
  const target = path.join(root,edit.dest);
  return !fs.existsSync(target) || !fs.readFileSync(target).equals(resolveBytes(edit));
});

console.log('\nTHE NAXAL ARCHIVE - EDITORIAL REDESIGN');
console.log('Project: ' + root);
console.log('Article route: src/pages/articles/' + route);
console.log(changes.length + ' file(s) to add / update:');
for (const edit of changes) console.log('  ' + (fileExists(edit.dest) ? 'UPDATE ' : 'CREATE ') + edit.dest);
if (dryRun) {console.log('\nDry-run complete. Nothing was changed.');process.exit(0);}
if (!changes.length) {console.log('\nAlready installed. No files changed.');process.exit(0);}

const timestamp = new Date().toISOString().replace(/[:.]/g,'-');
const backup = path.join(path.dirname(root), path.basename(root) + '-editorial-backups', timestamp + '-' + crypto.randomBytes(3).toString('hex'));
const manifest = {projectRoot:root, files:[], installedAt:new Date().toISOString()};
try {
  for (const edit of changes) {
    const dest = path.join(root,edit.dest);
    const existed = fs.existsSync(dest);
    if (existed) {
      const save = path.join(backup,'original',edit.dest);
      fs.mkdirSync(path.dirname(save),{recursive:true});
      fs.copyFileSync(dest,save);
    }
    manifest.files.push({relativePath:edit.dest,existed});
  }
  fs.mkdirSync(backup,{recursive:true});
  fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2));
  for (const edit of changes) {
    const dest = path.join(root,edit.dest);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    fs.writeFileSync(dest,resolveBytes(edit));
  }
  console.log('\nINSTALLATION COMPLETE - LOCAL ONLY');
  console.log('Backup stored at: ' + backup);
  console.log('Next: npm.cmd run dev');
  console.log('Then: npm.cmd run build');
  console.log('No GitHub changes were made.');
} catch(error) {
  console.error('Installation failed: ' + error.message);
  for (const item of manifest.files) {
    const target = path.join(root,item.relativePath);
    const saved = path.join(backup,'original',item.relativePath);
    try {
      if (item.existed && fs.existsSync(saved)) fs.copyFileSync(saved,target);
      else if (!item.existed && fs.existsSync(target)) fs.unlinkSync(target);
    } catch (_) {}
  }
  process.exit(1);
}
