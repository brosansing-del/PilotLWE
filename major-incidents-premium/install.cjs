#!/usr/bin/env node
'use strict';
/** Install Major Incidents section into an existing Astro Data & Visuals page.
 * Runs from the Astro project root, e.g. node .\major-incidents-upgrade\install.cjs
 * --dry-run: report changes without writing
 * --page src/pages/data-visuals.astro: specify the target page explicitly
 */
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const packageRoot = __dirname;
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const explicitPageIndex = args.indexOf('--page');
const explicitPage = explicitPageIndex >= 0 ? args[explicitPageIndex + 1] : null;
const read = (file) => fs.readFileSync(file, 'utf8');
const norm = (file) => path.relative(root, file).replace(/\\/g, '/');
const contentSource = path.join(packageRoot, 'src', 'components', 'MajorIncidents.astro');
const dataSource = path.join(packageRoot, 'src', 'data', 'majorIncidents.ts');
const componentTarget = path.join(root, 'src', 'components', 'MajorIncidents.astro');
const dataTarget = path.join(root, 'src', 'data', 'majorIncidents.ts');

function collectAstro(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? collectAstro(full) : entry.isFile() && entry.name.endsWith('.astro') ? [full] : [];
  });
}
function choosePage() {
  if (explicitPageIndex >= 0 && !explicitPage) throw Error('Please specify the page path after --page');
  if (explicitPage) {
    const full = path.resolve(root, explicitPage);
    if (!full.startsWith(path.join(root, 'src', 'pages') + path.sep) || !full.endsWith('.astro') || !fs.existsSync(full))
      throw Error(`Page must be an existing Astro file under src/pages: ${explicitPage}`);
    return full;
  }
  const candidates = collectAstro(path.join(root, 'src', 'pages')).filter(f => {
    const rel = norm(f);
    return /data|visual|fatalit|conflict|trend|statistic/i.test(rel);
  });
  const ranked = candidates.map(f => {
    const body = read(f);
    let score = 0;
    if (/deaths\s+linked\s+to\s+LWE\s+incidents/i.test(body)) score += 12;
    if (/fatalities\s+since\s+1980/i.test(body)) score += 7;
    if (/deaths\s+reported\s+per\s+year/i.test(body)) score += 6;
    if (/Data\s*&\s*Visuals/i.test(body)) score += 3;
    if (/getCollection|chart|svg|canvas/i.test(body)) score += 1;
    return { f, score };
  }).sort((a,b) => b.score - a.score);
  if (ranked.length === 1) return ranked[0].f;
  if (ranked.length > 1 && ranked[0].score >= 6 && ranked[0].score > ranked[1].score) return ranked[0].f;
  const names = candidates.map(norm).join('\n  ');
  throw Error('Could not safely identify your Data & Visuals page.\n' +
    (names ? `Possible pages:\n  ${names}\n` : 'No likely page filenames were found.\n') +
    'Re-run with --page src/pages/YOUR-PAGE.astro (use the actual path).');
}
function updatePage(file) {
  let s = read(file);
  const alreadyImported = /import\s+MajorIncidents\s+from\s+['"][^'"]*MajorIncidents\.astro['"]/.test(s);
  const alreadyRendered = /<MajorIncidents\s*\/>/.test(s);
  if (!s.startsWith('---')) throw Error(`Page ${norm(file)} has no opening Astro frontmatter (---). Please add the component manually.`);
  const end = s.indexOf('\n---', 3);
  if (end < 0) throw Error(`Page ${norm(file)} has no closing frontmatter (---).`);
  if (!alreadyImported) s = s.slice(0, end) + "\nimport MajorIncidents from '../components/MajorIncidents.astro';" + s.slice(end);
  // Use the relative import that works for pages in nested directories.
  const relativeImport = path.relative(path.dirname(file), componentTarget).replace(/\\/g,'/');
  const modulePath = relativeImport.startsWith('.') ? relativeImport : './' + relativeImport;
  s = s.replace(/import MajorIncidents from ['"][^'"]*MajorIncidents\.astro['"];/, `import MajorIncidents from '${modulePath}';`);
  if (!alreadyRendered) {
    const closingMain = s.lastIndexOf('</main>');
    const closingLayout = s.lastIndexOf('</BaseLayout>');
    const point = closingMain >= 0 ? closingMain : closingLayout;
    if (point < 0) throw Error(`Cannot find </main> or </BaseLayout> in ${norm(file)}. Please insert <MajorIncidents /> manually.`);
    s = s.slice(0,point) + '\n  <!-- Major Incidents: separate 2000–2026 series -->\n  <MajorIncidents />\n\n  ' + s.slice(point);
  }
  return s;
}
function main() {
  if (!fs.existsSync(path.join(root, 'astro.config.mjs')) && !fs.existsSync(path.join(root, 'astro.config.ts')))
    throw Error('Run from the Astro project root (folder containing astro.config.mjs).');
  const page = choosePage();
  const changes = [
    { target: componentTarget, content: read(contentSource) },
    // Preserve any existing data file: this is a visual redesign, not a data replacement.
    ...(!fs.existsSync(dataTarget) ? [{ target: dataTarget, content: read(dataSource) }] : []),
    { target: page, content: updatePage(page) },
  ].filter(({target,content}) => !fs.existsSync(target) || read(target) !== content);
  console.log('\nTHE NAXAL ARCHIVE — MAJOR INCIDENTS (2000–2026)');
  console.log('Project:',root);
  console.log('Data & Visuals page:',norm(page));
  if (!changes.length) { console.log('Already installed. No changes needed.'); return; }
  for (const c of changes) console.log(`  ${fs.existsSync(c.target)?'UPDATE':'CREATE'} ${norm(c.target)}`);
  if (dryRun) { console.log('\nDry run complete. Nothing was changed.'); return; }
  const backupDir = path.join(root,'.naxal-major-incidents-backups', new Date().toISOString().replace(/[:.]/g,'-'));
  const manifest=[];
  const written=[];
  try {
    for (const c of changes) {
      const existed=fs.existsSync(c.target);
      if(existed) {
        const backup=path.join(backupDir,norm(c.target));
        fs.mkdirSync(path.dirname(backup),{recursive:true});
        fs.copyFileSync(c.target,backup);
      }
      manifest.push({file:norm(c.target),existed});
    }
    for (const c of changes) {
      fs.mkdirSync(path.dirname(c.target),{recursive:true});
      fs.writeFileSync(c.target,c.content,'utf8');
      written.push(c.target);
    }
    fs.mkdirSync(backupDir,{recursive:true});
    fs.writeFileSync(path.join(backupDir,'manifest.json'),JSON.stringify({timestamp:new Date().toISOString(),changes:manifest},null,2));
    console.log(`\nInstalled successfully. Backups: ${norm(backupDir)}`);
    console.log('Next: npm.cmd run build');
  } catch (err) {
    for (const c of manifest) {
      const dest=path.join(root,c.file);
      const backup=path.join(backupDir,c.file);
      try { if(c.existed) fs.copyFileSync(backup,dest); else if(written.includes(dest)) fs.unlinkSync(dest); }
      catch(e) { console.error('Rollback failed for',c.file,e.message); }
    }
    throw err;
  }
}
try { main(); } catch (e) { console.error('\nInstallation stopped:',e.message);process.exitCode=1; }
