#!/usr/bin/env node
'use strict';

// History > Political Organisation: scoped heading and image-fit update.
// V3 intentionally does not inspect or modify src/pages/history/index.astro.
// The earlier installer failed on legitimate History-page variations.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const marker = 'PILOTLWE_ORGANISATION_HEADING_IMAGE_V3';
const backupDir = path.join(root, '.history-organisation-v3-backup');
const manifestPath = path.join(backupDir, 'manifest.json');

function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }
function fileText(relative) { return fs.readFileSync(path.join(root, relative), 'utf8'); }
function relative(p) { return path.relative(root, p).split(path.sep).join('/'); }

function astroFiles(dir, found = []) {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) astroFiles(full, found);
    else if (entry.isFile() && entry.name.endsWith('.astro')) found.push(relative(full));
  }
  return found;
}

function selectFile() {
  const preferred = 'src/components/PoliticalOrganisation.astro';
  if (fs.existsSync(path.join(root, preferred))) {
    const text = fileText(preferred);
    if (/political-organisation|cpi-maoist-hierarchy|po-figure/i.test(text)) return preferred;
  }
  const matches = astroFiles(path.join(root, 'src')).filter(p => {
    const text = fileText(p);
    return /cpi-maoist-hierarchy/i.test(text) && /po-figure|political-organisation/i.test(text);
  });
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) throw new Error('More than one Astro file contains the hierarchy diagram: ' + matches.join(', ') + '. No changes made.');
  throw new Error('Could not find the Political Organisation diagram component. No changes made. Please share src/components/PoliticalOrganisation.astro.');
}

const patch = String.raw`
<!-- ${marker}: Scoped visual fix. No historical text is changed. -->
<style is:global>
/* Expand the diagram naturally to the full inside width of its border. */
#political-organisation figure.po-figure,
#political-organisation .po-figure {
  box-sizing: border-box !important;
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  overflow: hidden !important;
}
#political-organisation .po-figure > a,
#political-organisation .po-figure > picture,
#political-organisation .po-figure a:has(> img),
#political-organisation .po-figure picture {
  display: block !important;
  width: 100% !important;
  max-width: none !important;
}
#political-organisation figure.po-figure img,
#political-organisation .po-figure img,
#political-organisation img[src*="cpi-maoist-hierarchy"] {
  display: block !important;
  box-sizing: border-box !important;
  width: 100% !important;
  height: auto !important;
  max-width: none !important;
  max-height: none !important;
  min-height: 0 !important;
  aspect-ratio: auto !important;
  object-fit: fill !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
}
/* The general title remains visible for the other History chapters. */
html.po-organisation-view .po-general-history-heading {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
<script is:inline>
// ${marker}: hide the exact redundant heading only for organisation hashes.
(() => {
  function init() {
    const section = document.getElementById('political-organisation');
    if (!section) return;
    const generalHeading = Array.from(document.querySelectorAll('h1, h2'))
      .find(el => {
        if (section.contains(el)) return false;
        const title = (el.textContent || '').replace(/\s+/g, ' ').trim().replace(/[.]+$/, '').toLowerCase();
        return title === 'history of the naxalite movement';
      });
    if (generalHeading) generalHeading.classList.add('po-general-history-heading');

    function sync() {
      const hash = decodeURIComponent(location.hash.slice(1));
      const isOrganisation = hash === 'political-organisation' || /^po-topic-\d+$/.test(hash);
      document.documentElement.classList.toggle('po-organisation-view', isOrganisation);
    }
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    window.addEventListener('history-part-change', sync);
    // Some History navigation uses pushState without a hashchange event.
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href*="#"]');
      if (link) requestAnimationFrame(sync);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
</script>
`;

function restore() {
  if (!fs.existsSync(manifestPath)) throw new Error('No V3 backup exists. Nothing changed.');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const target = path.join(root, manifest.file);
  const backup = path.join(backupDir, 'original.astro');
  if (!fs.existsSync(backup) || !fs.existsSync(target)) throw new Error('Backup or target file is missing. Nothing changed.');
  const now = fs.readFileSync(target, 'utf8');
  if (sha256(now) !== manifest.updatedHash) {
    throw new Error('The updated file was edited after installation. Refusing to overwrite your later changes.');
  }
  if (dryRun) { console.log('WOULD RESTORE', manifest.file); return; }
  fs.copyFileSync(backup, target);
  console.log('RESTORED', manifest.file);
}

try {
  if (undo) { restore(); process.exit(0); }
  const file = selectFile();
  const original = fileText(file);
  if (original.includes(marker)) {
    console.log('V3 is already installed in', file, '. Nothing changed.');
    process.exit(0);
  }
  const updated = original.trimEnd() + '\n' + patch + '\n';
  console.log(dryRun ? 'WOULD UPDATE' : 'UPDATE', file);
  if (dryRun) {
    console.log('Dry run passed. No files changed.');
    process.exit(0);
  }
  if (fs.existsSync(manifestPath)) {
    throw new Error('A V3 backup already exists. Run --undo first. Nothing changed.');
  }
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, 'original.astro'), original, 'utf8');
  fs.writeFileSync(manifestPath, JSON.stringify({file, originalHash:sha256(original), updatedHash:sha256(updated)}, null, 2));
  try { fs.writeFileSync(path.join(root, file), updated, 'utf8'); }
  catch (error) { fs.writeFileSync(path.join(root, file), original, 'utf8'); throw error; }
  console.log('Done. Diagram fits the border. Redundant History title is hidden only in the organisation view.');
  console.log('Backup: .history-organisation-v3-backup');
} catch (error) {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
}
