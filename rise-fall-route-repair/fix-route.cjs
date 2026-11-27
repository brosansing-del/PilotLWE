#!/usr/bin/env node
'use strict';
// Installs only the missing History > Rise and Fall route, its component and images.
// Does NOT change Header.astro, existing History content or any existing file.
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const source = __dirname;
const dryRun = process.argv.includes('--dry-run');
const required = [
  'src/components/Header.astro',
  'src/pages/history/index.astro',
  'src/layouts/BaseLayout.astro',
  'src/components/Footer.astro',
  'package.json'
];
const page = 'src/pages/history/rise-and-fall.astro';
const component = 'src/components/RiseFallCollage.astro';
const assetsDir = 'public/images/rise-and-fall';
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function show(action, rel) { console.log(`${action.padEnd(13)} ${rel}`); }
try {
  const missing = required.filter(rel => !exists(rel));
  if (missing.length) throw new Error('Not the expected Astro project. Missing: ' + missing.join(', ') + '. Open D:\\PilotLWE in VS Code and run from that folder.');
  const assetFiles = fs.readdirSync(path.join(source, assetsDir)).filter(f => fs.statSync(path.join(source, assetsDir, f)).isFile());
  const items = [page, component, ...assetFiles.map(f => `${assetsDir}/${f}`)];
  let created = 0, preserved = 0;
  for (const rel of items) {
    const from = path.join(source, rel);
    if (!fs.existsSync(from)) throw new Error('Repair ZIP incomplete: ' + rel);
    if (exists(rel)) { show('KEEP EXISTING', rel); preserved++; continue; }
    show(dryRun ? 'WOULD CREATE' : 'CREATE', rel);
    if (!dryRun) {
      const dest = path.join(root, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(from, dest, fs.constants.COPYFILE_EXCL);
    }
    created++;
  }
  const header = fs.readFileSync(path.join(root, 'src/components/Header.astro'), 'utf8');
  if (!header.includes('history/rise-and-fall/')) {
    console.log('\nNOTE: Your History dropdown does not appear to link to history/rise-and-fall/.');
    console.log('The page is installed, but you may need to update the header link separately.');
  }
  if (dryRun) {
    console.log(`\nDry run successful: ${created} file(s) would be created; ${preserved} existing file(s) would be preserved.`);
  } else {
    console.log(`\nRepair finished: ${created} file(s) created; ${preserved} existing file(s) preserved.`);
    console.log('Page file:', path.join(root, page));
    console.log('Next: npm.cmd run build');
    console.log('Then: npm.cmd run dev');
    console.log('Open: http://localhost:4321/PilotLWE/history/rise-and-fall/');
  }
} catch (error) {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
}
