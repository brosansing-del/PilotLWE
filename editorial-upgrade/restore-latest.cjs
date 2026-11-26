/** Restore the most recent editorial redesign backup; no git commands. */
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const backupRoot = path.join(path.dirname(root),path.basename(root) + '-editorial-backups');
if (!fs.existsSync(backupRoot)) {console.error('No editorial backups found.');process.exit(1);}
const folders = fs.readdirSync(backupRoot).filter(f => fs.existsSync(path.join(backupRoot,f,'manifest.json'))).sort();
if (!folders.length) {console.error('No valid editorial backups found.');process.exit(1);}
const folder = path.join(backupRoot,folders[folders.length-1]);
const manifest = JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
if (path.resolve(manifest.projectRoot) !== path.resolve(root)) {console.error('Backup is for a different project.');process.exit(1);}
for (const file of manifest.files) {
  const target = path.join(root,file.relativePath);
  const original = path.join(folder,'original',file.relativePath);
  if (file.existed) {fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(original,target);}
  else if (fs.existsSync(target)) fs.unlinkSync(target);
  console.log('Restored: ' + file.relativePath);
}
console.log('\nRestored backup from ' + folder);
