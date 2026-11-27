#!/usr/bin/env node
'use strict';

// Scoped, reversible fix for the History > Political Organisation view.
// Run from the root of the Astro project: node history-organisation-image-fix/install.cjs
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const historyPath = 'src/pages/history/index.astro';
const organisationPath = 'src/components/PoliticalOrganisation.astro';
const files = [historyPath, organisationPath];
const backupRoot = path.join(root, '.history-organisation-image-fix-backup');
const markerHistory = 'PILOTLWE_ORG_HIDE_GENERAL_TITLE_V2';
const markerImage = 'PILOTLWE_ORG_EDGE_TO_EDGE_IMAGE_V2';

function read(rel) {
  const absolute = path.join(root, rel);
  if (!fs.existsSync(absolute)) throw new Error(`File not found: ${rel}. Nothing changed.`);
  return fs.readFileSync(absolute, 'utf8');
}

function normalizeTitle(raw) {
  return raw.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().toLowerCase();
}

function patchHistory(original) {
  if (original.includes(markerHistory)) return original;
  if (!original.includes('history-page') || !original.includes('PoliticalOrganisation')) {
    throw new Error('Unexpected History page structure. Nothing changed.');
  }

  const headings = [...original.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];
  const target = headings.find(m => normalizeTitle(m[0]) === 'history of the naxalite movement');
  let changed = original;
  if (target) {
    const opening = target[0].match(/^<h1\b[^>]*>/i)[0];
    if (!/\bhistory-general-title\b/.test(opening)) {
      const openingNew = /\bclass\s*=/.test(opening)
        ? opening.replace(/\bclass\s*=\s*(["'])(.*?)\1/i, (_, q, classes) => `class=${q}${classes} history-general-title${q}`)
        : opening.replace(/>$/, ' class="history-general-title">');
      changed = changed.replace(target[0], openingNew + target[0].slice(opening.length));
    }
  } else if (!original.includes('history-general-title')) {
    throw new Error('Could not identify the exact general History heading. Nothing changed.');
  }

  // Keep the title for the six-phase history view; hide it only in Part II.
  changed += `\n<style is:global>\n/* ${markerHistory} */\n.history-page.organisation-selected .history-general-title {\n  display: none !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n</style>\n<script>\n// ${markerHistory}: also supports a direct link to Part II.\n(() => {\n  const page = document.querySelector('.history-page');\n  if (!page) return;\n  function syncOrganisationTitle() {\n    const hash = decodeURIComponent(window.location.hash.slice(1));\n    const organisation = hash === 'political-organisation' || /^po-topic-\\d+$/.test(hash);\n    page.classList.toggle('organisation-selected', organisation);\n  }\n  syncOrganisationTitle();\n  window.addEventListener('hashchange', syncOrganisationTitle);\n  window.addEventListener('history-part-change', syncOrganisationTitle);\n})();\n</script>\n`;
  return changed;
}

function patchOrganisation(original) {
  if (original.includes(markerImage)) return original;
  if (!original.includes('id="political-organisation"') || !/class=["']po-figure["']/.test(original)) {
    throw new Error('Could not find the organisation image container. Nothing changed.');
  }
  if (!original.includes('cpi-maoist-hierarchy')) {
    throw new Error('Could not identify the organisation hierarchy image. Nothing changed.');
  }
  // The old max-height:520px/object-fit:contain combination caused sidebars.
  // Keep the figure width and the entire diagram; let its height follow the image ratio.
  return original + `\n<style is:global>\n/* ${markerImage} */\n#political-organisation figure.po-figure {\n  box-sizing: border-box;\n  padding: 0 !important;\n  overflow: hidden;\n  border: 1px solid #d8d0c5;\n}\n#political-organisation figure.po-figure > a,\n#political-organisation figure.po-figure > picture {\n  display: block;\n  width: 100%;\n}\n#political-organisation figure.po-figure img {\n  display: block !important;\n  width: 100% !important;\n  height: auto !important;\n  max-width: 100% !important;\n  max-height: none !important;\n  object-fit: contain !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n</style>\n`;
}

function restore() {
  const manifestFile = path.join(backupRoot, 'manifest.json');
  if (!fs.existsSync(manifestFile)) throw new Error('No backup from this installer was found.');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  for (const rel of manifest.files) {
    if (dryRun) console.log('WOULD RESTORE', rel);
    else {
      fs.copyFileSync(path.join(backupRoot, 'files', rel), path.join(root, rel));
      console.log('RESTORED', rel);
    }
  }
}

try {
  if (undo) {
    restore();
    process.exit(0);
  }
  // Read and validate both files before making any changes.
  const originals = new Map(files.map(rel => [rel, read(rel)]));
  const replacements = new Map([
    [historyPath, patchHistory(originals.get(historyPath))],
    [organisationPath, patchOrganisation(originals.get(organisationPath))],
  ]);
  const changes = files.filter(rel => originals.get(rel) !== replacements.get(rel));
  if (!changes.length) {
    console.log('This update is already installed. Nothing changed.');
    process.exit(0);
  }
  for (const rel of changes) console.log(dryRun ? 'WOULD UPDATE' : 'UPDATE', rel);
  if (dryRun) {
    console.log('Dry run passed. No files changed.');
    process.exit(0);
  }
  if (fs.existsSync(path.join(backupRoot, 'manifest.json'))) {
    throw new Error('A backup from this installer already exists. Restore it with --undo first. Nothing changed.');
  }
  for (const rel of changes) {
    const destination = path.join(backupRoot, 'files', rel);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, originals.get(rel), 'utf8');
  }
  fs.writeFileSync(path.join(backupRoot, 'manifest.json'), JSON.stringify({files: changes}, null, 2));
  for (const rel of changes) fs.writeFileSync(path.join(root, rel), replacements.get(rel), 'utf8');
  console.log('Done. The generic heading is hidden in the Political Organisation view, and the chart fills its border.');
  console.log('Original files are backed up in .history-organisation-image-fix-backup.');
} catch (err) {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
}
