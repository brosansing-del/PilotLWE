#!/usr/bin/env node
'use strict';

/**
 * Safely insert or repair the Rise and Fall of CPI (Maoist) History dropdown link.
 * Only src/components/Header.astro is edited. No page content or CSS is changed.
 * Run from the Astro project root (D:\PilotLWE).
 */
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const file = path.join(root, 'src', 'components', 'Header.astro');
const page = path.join(root, 'src', 'pages', 'history', 'rise-and-fall.astro');
const backup = path.join(root, '.history-dropdown-at-a-glance-backup', 'Header.astro.before');
const dryRun = process.argv.includes('--dry-run');
const target = `href={url('history/rise-and-fall/')}`;

function patch(original) {
  const start = original.search(/<nav\b[^>]*class=["'][^"']*\bmain-nav\b[^"']*["'][^>]*>/i);
  if (start < 0) throw new Error('Main navigation not found. No files changed.');
  const end = original.indexOf('</nav>', start);
  if (end < 0) throw new Error('Main navigation closing tag not found. No files changed.');
  let nav = original.slice(start, end);
  const eol = original.includes('\r\n') ? '\r\n' : '\n';

  const historyLabel = /<div\b[^>]*class=["'][^"']*\bdropdown-label\b[^"']*["'][^>]*>\s*HISTORY\s*<\/div>/i.exec(nav);
  if (!historyLabel) throw new Error('HISTORY dropdown label not found. No files changed.');

  const anchors = [...nav.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)];
  const historical = anchors.filter(m => /<strong>\s*Historical Evolution\s*<\/strong>/i.test(m[0]));
  const rise = anchors.filter(m => /<strong>\s*Rise and Fall of CPI\s*\(Maoist\)\s*<\/strong>/i.test(m[0]));
  if (historical.length !== 1 || rise.length > 1) {
    throw new Error('History dropdown entries are not unique. No files changed.');
  }
  if (historical[0].index < historyLabel.index) {
    throw new Error('Unexpected History dropdown structure. No files changed.');
  }

  let action;
  if (rise.length === 1) {
    const old = rise[0][0];
    const hrefPattern = /\bhref\s*=\s*(?:\{[^}]*\}|"[^"]*"|'[^']*')/i;
    if (!hrefPattern.test(old)) throw new Error('Existing Rise and Fall item has no link. No files changed.');
    const replacement = old.replace(hrefPattern, target).replace(/<small>[\s\S]*?<\/small>/i, '<small>At a Glance</small>');
    nav = nav.slice(0, rise[0].index) + replacement + nav.slice(rise[0].index + old.length);
    action = replacement === old ? 'already correct' : 'repair existing menu link';
  } else {
    const preceding = nav.slice(0, historical[0].index);
    const indentation = /\n([ \t]*)$/.exec(preceding)?.[1] || '          ';
    const insert = [
      `<a ${target}>`,
      `  <span>`,
      `    <strong>Rise and Fall of CPI (Maoist)</strong>`,
      `    <small>At a Glance</small>`,
      `  </span>`,
      `</a>`,
    ].map((line, i) => i === 0 ? line : indentation + line).join(eol) + eol + indentation;
    nav = nav.slice(0, historical[0].index) + insert + nav.slice(historical[0].index);
    action = 'add missing menu link';
  }
  const result = original.slice(0, start) + nav + original.slice(end);
  const updatedNav = result.slice(start, result.indexOf('</nav>', start));
  const newRise = [...updatedNav.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)]
    .filter(m => /<strong>\s*Rise and Fall of CPI\s*\(Maoist\)\s*<\/strong>/i.test(m[0]));
  if (newRise.length !== 1 || !newRise[0][0].includes(target) || !newRise[0][0].includes('At a Glance')) {
    throw new Error('Verification failed. No files changed.');
  }
  return { result, action };
}

try {
  if (!fs.existsSync(file)) throw new Error('src/components/Header.astro not found. Open VS Code in D:\\PilotLWE and run again.');
  const original = fs.readFileSync(file, 'utf8');
  const { result, action } = patch(original);
  console.log(`History dropdown: ${action}.`);
  console.log('Expected order: Rise and Fall of CPI (Maoist) / Historical Evolution / Political Organisation');
  if (!fs.existsSync(page)) {
    console.warn('WARNING: src/pages/history/rise-and-fall.astro is missing. The menu can appear, but its link will return 404 until the page is installed.');
  }
  if (result === original) {
    console.log('Header already correct. No changes needed.');
  } else if (dryRun) {
    console.log('Dry run passed. Would update only src/components/Header.astro.');
  } else {
    if (fs.existsSync(backup)) {
      throw new Error('Backup already exists at .history-dropdown-at-a-glance-backup. Inspect it before applying another change.');
    }
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.writeFileSync(backup, original, 'utf8');
    fs.writeFileSync(file, result, 'utf8');
    if (fs.readFileSync(file, 'utf8') !== result) throw new Error('File verification failed. Restore from backup.');
    console.log('Updated src/components/Header.astro.');
    console.log('Backup: .history-dropdown-at-a-glance-backup/Header.astro.before');
  }
  console.log('Next: npm.cmd run build; npm.cmd run dev; check the History dropdown.');
} catch (err) {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
}
