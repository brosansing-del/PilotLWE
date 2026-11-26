#!/usr/bin/env node
'use strict';
/** Install only the Major Incidents dashboard; remove old fatalities content. */
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const pkg = __dirname;
const dryRun = process.argv.includes('--dry-run');
const read = p => fs.readFileSync(p, 'utf8');
const exists = p => fs.existsSync(p);
const rel = p => path.relative(root, p).replace(/\\/g, '/');

function allAstro(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? allAstro(p) : d.isFile() && p.endsWith('.astro') ? [p] : [];
  });
}

function main() {
  if (!exists(path.join(root, 'astro.config.mjs')) && !exists(path.join(root, 'astro.config.ts'))) {
    throw new Error('Open D:\\thenaxalarchive in VS Code and run this from the Astro project root (astro.config.mjs).');
  }
  for (const required of ['src/layouts/BaseLayout.astro','src/components/Header.astro','src/components/Footer.astro']) {
    if (!exists(path.join(root, required))) throw new Error(`Missing ${required}. No files changed.`);
  }
  const files = [
    'src/components/MajorIncidents.astro',
    'src/data/majorIncidents.ts',
    'src/pages/data-visuals/major-incidents.astro',
    'src/pages/data-visuals/lwe-fatalities-since-1980.astro',
  ];
  const changes = files.map(name => ({name, dest:path.join(root,name), content:read(path.join(pkg,name))}));
  // Replace links to the deleted chart, and change the visible navigation label.
  for (const file of [...allAstro(path.join(root,'src','pages')), ...allAstro(path.join(root,'src','components'))]) {
    const name = rel(file);
    if (files.includes(name)) continue;
    const original = read(file);
    if (!original.includes('lwe-fatalities-since-1980')) continue;
    const updated = original
      .replace(/lwe-fatalities-since-1980/g, 'major-incidents')
      .replace(/Deaths linked to LWE incidents since 1980/gi, 'Major Incidents (2000–2026)')
      .replace(/Fatalities since 1980/gi, 'Major Incidents (2000–2026)');
    changes.push({name, dest:file, content:updated});
  }
  const pending = changes.filter(c => !exists(c.dest) || read(c.dest) !== c.content);
  console.log('\nTHE NAXAL ARCHIVE — MAJOR INCIDENTS ONLY (2000–2026)');
  console.log('Project:',root);
  console.log('Old 1980 chart removed. Old URL becomes a redirect.');
  if (!pending.length) {console.log('Already installed. Nothing to change.');return;}
  for (const c of pending) console.log(`  ${exists(c.dest)?'UPDATE':'CREATE'} ${c.name}`);
  if (dryRun) {console.log('\nDry run complete. No files changed.');return;}
  const backupRoot = path.join(root,'.major-incidents-only-backups');
  const backup = path.join(backupRoot,new Date().toISOString().replace(/[:.]/g,'-'));
  const manifest = pending.map(c=>({name:c.name,existed:exists(c.dest)}));
  let started = false;
  try {
    for (const c of pending) if (exists(c.dest)) {
      const copy = path.join(backup,c.name);
      fs.mkdirSync(path.dirname(copy),{recursive:true});
      fs.copyFileSync(c.dest,copy);
    }
    fs.mkdirSync(backup,{recursive:true});
    fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2));
    started = true;
    for (const c of pending) {
      fs.mkdirSync(path.dirname(c.dest),{recursive:true});
      fs.writeFileSync(c.dest,c.content,'utf8');
    }
    console.log('\nInstalled successfully.');
    console.log('Backups:',rel(backup));
    console.log('Next: npm.cmd run build');
    console.log('Then: npm.cmd run dev');
    console.log('Page: /data-visuals/major-incidents/ (may include Astro base path)');
  } catch (e) {
    if (started) for (const item of manifest) {
      const dest=path.join(root,item.name);
      try {if(item.existed) fs.copyFileSync(path.join(backup,item.name),dest); else if(exists(dest)) fs.unlinkSync(dest);} catch (err) {console.error('Could not roll back',item.name,err.message);}
    }
    throw e;
  }
}
try {main();} catch(e) {console.error('Installation stopped:',e.message);process.exitCode=1;}
