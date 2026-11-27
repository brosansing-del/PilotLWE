#!/usr/bin/env node
'use strict';
/** Remove only the seven-box quick navigation from an already installed page. */
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pageRelative = 'src/pages/history/rise-and-fall.astro';
const page = path.join(root, pageRelative);
const backup = path.join(root, '.rise-fall-navigation-backup', 'rise-and-fall.astro.before');
const dryRun = process.argv.includes('--dry-run');

try {
  if (!fs.existsSync(page)) throw new Error(`Missing ${pageRelative}. Run from D:\\PilotLWE after installing the page.`);
  const original = fs.readFileSync(page, 'utf8');
  if (!original.includes('class="rf-milestones"')) {
    if (/rf-milestones|const milestones\s*=/.test(original)) throw new Error('Partially edited milestone navigation. Review the page manually; no changes made.');
    console.log('Seven-box navigation is already absent. Nothing changed.');
    process.exit(0);
  }
  if (!original.includes('<RiseFallCollage />')) throw new Error('Unexpected page structure: collage component not found. Nothing changed.');
  let updated = original.replaceAll('\r\n','\n');
  const beforeData = updated;
  updated = updated.replace(/\nconst milestones = \[\n(?:[^\n]*\n)*?\];\n/, '\n');
  if (updated === beforeData || updated.includes('const milestones =')) throw new Error('Could not safely remove milestone data. Nothing changed.');
  const beforeNav = updated;
  updated = updated.replace(/\n\s*<nav class="rf-milestones"[^>]*>[\s\S]*?<\/nav>\s*\n/, '\n\n');
  if (updated === beforeNav || updated.includes('<nav class="rf-milestones"')) throw new Error('Could not safely remove milestone links. Nothing changed.');
  updated = updated.replace('.rf-more a,.rf-milestones a', '.rf-more a');
  updated = updated.replace(/\.rf-milestones[^{}]*\{[^{}]*\}/g, '');
  updated = updated.replace(/@media\(max-width:950px\)\{\s*\}\s*/g, '');
  updated = updated.replace(/\n\s*\n\s*\n+/g, '\n\n');
  if (/rf-milestones|const milestones\s*=/.test(updated)) throw new Error('Unexpected remaining milestone code. Nothing changed.');
  if (!updated.includes('<RiseFallCollage />') || !updated.includes('rf-more')) throw new Error('Unexpected page structure after edit. Nothing changed.');
  if (dryRun) {
    console.log('Dry run passed: would remove the seven-box navigation from', pageRelative);
    console.log('The seven historical stages, photographs and other sections would remain.');
    process.exit(0);
  }
  if (fs.existsSync(backup)) throw new Error('An earlier navigation backup already exists. Inspect .rise-fall-navigation-backup first.');
  fs.mkdirSync(path.dirname(backup), {recursive:true});
  fs.writeFileSync(backup, original, 'utf8');
  fs.writeFileSync(page, updated, 'utf8');
  console.log('Removed seven-box quick navigation from', pageRelative);
  console.log('Backup:', path.relative(root, backup));
  console.log('Next: npm.cmd run build, then npm.cmd run dev.');
} catch (error) {
  console.error('ERROR:', error.message);
  process.exitCode = 1;
}
