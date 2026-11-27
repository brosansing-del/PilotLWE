#!/usr/bin/env node
'use strict';

/**
 * Add a standalone History > Rise and Fall of CPI (Maoist) page.
 * Patches only the History dropdown in the existing Header.astro.
 * No existing History content or other navigation is overwritten.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const sourceRoot = __dirname;
const dryRun = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const backupRoot = path.join(root, '.rise-fall-collage-backup');
const headerRelative = 'src/components/Header.astro';
const headerPath = path.join(root, headerRelative);
const assetsRelative = 'public/images/rise-and-fall';
const files = [
  'src/components/RiseFallCollage.astro',
  'src/pages/history/rise-and-fall.astro',
  ...fs.readdirSync(path.join(sourceRoot, assetsRelative)).map(name => `${assetsRelative}/${name}`),
];

function sha(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }
function fail(message) { throw new Error(message); }
function patchHeader(text) {
  const allAnchors = [...text.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)];
  const rise = allAnchors.filter(m => /<strong>\s*Rise and Fall of CPI\s*\(Maoist\)\s*<\/strong>/i.test(m[0]));
  if (rise.length > 1) fail('More than one Rise and Fall dropdown item found. No files changed.');
  const newHref = `href={url('history/rise-and-fall/')}`;
  if (rise.length === 1) {
    const original = rise[0][0];
    if (!/\bhref\s*=/.test(original)) fail('The existing Rise and Fall item has no href. No files changed.');
    const revised = original.replace(/\bhref\s*=\s*(?:\{url\(['"][^'"]+['"]\)\}|"[^"]*"|'[^']*')/, newHref)
      .replace(/<small>[\s\S]*?<\/small>/i, '<small>At a Glance</small>');
    if (!revised.includes(newHref)) fail('Could not safely update the existing Rise and Fall link.');
    return text.slice(0, rise[0].index) + revised + text.slice(rise[0].index + original.length);
  }
  const historical = allAnchors.filter(m => /<strong>\s*Historical Evolution\s*<\/strong>/i.test(m[0]));
  if (historical.length !== 1) fail('Could not uniquely locate the Historical Evolution dropdown item. No files changed.');
  const newAnchor = [
    `          <a ${newHref}>`,
    `            <span>`,
    `              <strong>Rise and Fall of CPI (Maoist)</strong>`,
    `              <small>At a Glance</small>`,
    `            </span>`,
    `          </a>`,
    `          `,
  ].join('\n');
  return text.slice(0, historical[0].index) + newAnchor + text.slice(historical[0].index);
}

function checkProject() {
  for (const relative of [headerRelative, 'src/pages/history/index.astro', 'src/layouts/BaseLayout.astro', 'src/components/Footer.astro']) {
    if (!fs.existsSync(path.join(root, relative))) fail(`Missing ${relative}. Run this from the correct Astro project folder (e.g. D:\\PilotLWE).`);
  }
}

function restore() {
  const manifestPath = path.join(backupRoot, 'manifest.json');
  if (!fs.existsSync(manifestPath)) fail('No backup from this installer was found. Nothing changed.');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const currentHeader = fs.readFileSync(headerPath);
  if (sha(currentHeader) !== manifest.headerAfterHash) fail('Header.astro changed since installation. Restore manually or back up your newer edits first.');
  for (const relative of manifest.createdFiles) {
    const p = path.join(root, relative);
    if (!fs.existsSync(p) || sha(fs.readFileSync(p)) !== manifest.fileHashes[relative]) {
      fail(`Cannot safely undo because ${relative} was modified or removed.`);
    }
  }
  if (dryRun) { console.log('Undo dry run passed. Nothing changed.'); return; }
  fs.copyFileSync(path.join(backupRoot, 'Header.astro.before'), headerPath);
  for (const relative of manifest.createdFiles) fs.unlinkSync(path.join(root, relative));
  fs.rmSync(backupRoot, { recursive: true, force: true });
  console.log('Reverted this installer; restored the original Header.astro.');
}

try {
  if (undo) { restore(); process.exit(0); }
  checkProject();
  const originalHeader = fs.readFileSync(headerPath, 'utf8');
  const newHeader = patchHeader(originalHeader);
  const toCreate = [];
  for (const relative of files) {
    const source = path.join(sourceRoot, relative);
    const destination = path.join(root, relative);
    if (!fs.existsSync(source)) fail(`Package is incomplete: ${relative}`);
    if (fs.existsSync(destination)) {
      if (sha(fs.readFileSync(destination)) !== sha(fs.readFileSync(source))) {
        fail(`Existing file differs: ${relative}. No files changed. Back it up before replacing.`);
      }
    } else {
      toCreate.push(relative);
    }
  }
  const changeHeader = originalHeader !== newHeader;
  if (!toCreate.length && !changeHeader) {
    console.log('Already installed. Nothing to change.');
    process.exit(0);
  }
  if (fs.existsSync(backupRoot)) fail('Existing installer backup found. Run --undo or inspect .rise-fall-collage-backup first.');
  console.log('History > Rise and Fall of CPI (Maoist)');
  if (changeHeader) console.log(dryRun ? 'WOULD UPDATE' : 'UPDATE', headerRelative);
  for (const relative of toCreate) console.log(dryRun ? 'WOULD ADD' : 'ADD', relative);
  if (dryRun) { console.log('Dry run passed. No files changed.'); process.exit(0); }
  fs.mkdirSync(backupRoot, { recursive: true });
  fs.writeFileSync(path.join(backupRoot, 'Header.astro.before'), originalHeader);
  const created = [];
  try {
    if (changeHeader) fs.writeFileSync(headerPath, newHeader, 'utf8');
    for (const relative of toCreate) {
      const dest = path.join(root, relative);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(sourceRoot, relative), dest);
      created.push(relative);
    }
    const hashes = Object.fromEntries(created.map(relative => [relative, sha(fs.readFileSync(path.join(root, relative)))]));
    fs.writeFileSync(path.join(backupRoot, 'manifest.json'), JSON.stringify({
      headerAfterHash: sha(fs.readFileSync(headerPath)), createdFiles: created, fileHashes: hashes,
    }, null, 2));
  } catch (error) {
    fs.writeFileSync(headerPath, originalHeader, 'utf8');
    for (const relative of created) fs.rmSync(path.join(root, relative), { force: true });
    fs.rmSync(backupRoot, { recursive: true, force: true });
    throw error;
  }
  console.log('\nInstallation complete. Run npm.cmd run build and npm.cmd run dev.');
  console.log('Preview: http://localhost:4321/PilotLWE/history/rise-and-fall/');
  console.log('No Git commit has been made.');
} catch (error) {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
}
