#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = process.cwd();
const self = __dirname;
const backupRoot = path.join(root, '.victims-media-update-backup');
const manifestFile = path.join(backupRoot, 'manifest.json');
const files = [
  'src/pages/victims-corner/index.astro',
  'src/components/VictimsMediaGallery.astro',
  'src/data/victimsArticles.ts',
];
const arg = process.argv[2] || '';
const dry = arg === '--dry-run';
const undo = arg === '--undo';
const hash = (x) => crypto.createHash('sha256').update(x).digest('hex');
const read = (x) => fs.readFileSync(x);
function stop(message) { console.error(message); process.exit(1); }
if (!fs.existsSync(path.join(root,'package.json')) || !fs.existsSync(path.join(root,'src','pages'))) {
  stop('Run this from your PilotLWE project root (must contain package.json and src/pages).');
}
if (undo) {
  if (!fs.existsSync(manifestFile)) stop('No previous installation manifest found; nothing restored.');
  const manifest = JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  for (const item of manifest.items) {
    const dest = path.join(root, item.rel);
    if (item.original) {
      const backup = path.join(backupRoot,'original',item.rel);
      if (!fs.existsSync(backup)) stop(`Missing backup: ${item.rel}`);
      fs.mkdirSync(path.dirname(dest),{recursive:true});
      fs.copyFileSync(backup,dest);
      console.log('RESTORE', item.rel);
    } else if (fs.existsSync(dest)) {
      if (hash(read(dest)) !== item.installedHash) stop(`File changed since installation; will not delete: ${item.rel}`);
      fs.unlinkSync(dest);
      console.log('REMOVE', item.rel);
    }
  }
  fs.rmSync(backupRoot,{recursive:true,force:true});
  console.log('Rollback complete.');
  process.exit(0);
}
const plan = files.map(rel => {
  const src = path.join(self,rel), dest = path.join(root,rel);
  if (!fs.existsSync(src)) stop('Missing package file: '+src);
  return {rel,src,dest,exists:fs.existsSync(dest),changed:!fs.existsSync(dest)||hash(read(src))!==hash(read(dest))};
});
console.log('Victims\' Corner ONLY. archiveVideos.ts and ArchiveVideoCollection.astro remain untouched.');
for(const p of plan) console.log((p.changed?(p.exists?'UPDATE':'CREATE'):'UNCHANGED').padEnd(12),p.rel);
if (dry) {console.log('Dry run completed; no files modified.');process.exit(0);}
if(fs.existsSync(manifestFile)) {
  if(plan.every(p=>!p.changed)) {console.log('Already installed; no changes.');process.exit(0);}
  stop('Existing installation backup found. Run --undo first or remove the old package after reviewing your changes.');
}
if (!fs.existsSync(path.join(root,'src','data','archiveVideos.ts'))) stop('Missing src/data/archiveVideos.ts: this gallery reads your existing video records.');
fs.mkdirSync(backupRoot,{recursive:true});
const manifest = {items:[]};
try {
  for (const p of plan) {
    if (!p.changed) continue;
    const original = p.exists;
    if (original) {
      const back = path.join(backupRoot,'original',p.rel);
      fs.mkdirSync(path.dirname(back),{recursive:true});
      fs.copyFileSync(p.dest,back);
    }
    fs.mkdirSync(path.dirname(p.dest),{recursive:true});
    fs.copyFileSync(p.src,p.dest);
    manifest.items.push({rel:p.rel,original,installedHash:hash(read(p.dest))});
    console.log('WROTE',p.rel);
  }
  fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2));
  console.log('Done. Run npm.cmd run build then npm.cmd run dev.');
} catch (err) { console.error('Installation failed:',err.message);process.exit(1); }
