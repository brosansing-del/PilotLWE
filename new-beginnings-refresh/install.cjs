#!/usr/bin/env node
// Non-destructive installer for PilotLWE. Updates only a known page and header label.
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const here = __dirname;
const dry = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const page = path.join(cwd, 'src/pages/seeds-of-change/index.astro');
const header = path.join(cwd, 'src/components/Header.astro');
const template = fs.readFileSync(path.join(here,'files/index.astro'),'utf8');
const backupDir = path.join(cwd, '.new-beginnings-backup');
function stop(msg) { console.error(msg); process.exitCode = 1; }
if (!fs.existsSync(page) || !fs.existsSync(header)) {
  stop('Missing expected Astro files. Run this command from the PilotLWE project root.');
} else if (undo) {
  if (!fs.existsSync(backupDir)) stop('No backup to restore.');
  else {
    for (const [old,bak] of [[page,'page.astro'],[header,'Header.astro']]) {
      if (fs.existsSync(path.join(backupDir,bak))) fs.copyFileSync(path.join(backupDir,bak),old);
    }
    console.log('Previous page and header restored.');
  }
} else {
  const originalPage = fs.readFileSync(page,'utf8');
  const originalHeader = fs.readFileSync(header,'utf8');
  // Preserve any newer video/article additions: only replace the exact known design template.
  // If your page has new content, stop instead of overwriting it.
  const looksLikeKnownPage = originalPage.includes("id: 's8zKJ2IODYk'") &&
    originalPage.includes("id: 'vatiFZ1jc_E'") &&
    originalPage.includes('Reports &amp; Features') &&
    originalPage.includes('Stories of change.') &&
    originalPage.includes('Seeds <em>of Change.</em>');
  const alreadyUpdated = originalPage.includes('New <em>Beginnings.</em>') && !originalPage.includes('Stories of change.');
  if (!looksLikeKnownPage && !alreadyUpdated) {
    stop('Current Seeds of Change page differs from the expected file. Nothing changed. Upload the current index.astro for a safe patch.');
  } else {
    let newHeader = originalHeader;
    // Keep href and URL unchanged; change only visible navigation text.
    newHeader = newHeader.replace(/(>\s*)Seeds of Change(\s*<\/a>)/g, '$1New Beginnings$2');
    newHeader = newHeader.replace(/(>\s*)Life After Surrender(\s*<\/a>)/g, '$1New Beginnings$2');
    const foundNav = /New Beginnings\s*<\/a>/.test(newHeader);
    if (!foundNav) stop('Could not locate the navigation label safely. Nothing changed.');
    else {
      console.log(`${alreadyUpdated ? 'KEEP' : 'UPDATE'} src/pages/seeds-of-change/index.astro`);
      console.log(`${newHeader===originalHeader ? 'KEEP' : 'UPDATE'} src/components/Header.astro`);
      if (dry) console.log('Dry run complete. Nothing changed.');
      else {
        fs.mkdirSync(backupDir,{recursive:true});
        for (const [source,dest] of [[page,'page.astro'],[header,'Header.astro']]) {
          const bak=path.join(backupDir,dest);
          if (!fs.existsSync(bak)) fs.copyFileSync(source,bak);
        }
        if (!alreadyUpdated) fs.writeFileSync(page,template);
        if (newHeader!==originalHeader) fs.writeFileSync(header,newHeader);
        console.log('Updated successfully. Previous files backed up in .new-beginnings-backup');
      }
    }
  }
}
