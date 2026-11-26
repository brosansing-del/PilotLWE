'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.cwd();
const backups = path.join(__dirname, '.backups');
if (!fs.existsSync(backups)) { console.error('No backups found.'); process.exit(1); }
const directories = fs.readdirSync(backups, {withFileTypes: true}).filter(x => x.isDirectory()).map(x => x.name).sort();
if (!directories.length) { console.error('No backups found.'); process.exit(1); }
const folder = path.join(backups, directories[directories.length-1]);
const manifest = JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
if (manifest.root !== root) { console.error('This backup belongs to a different project.'); process.exit(1); }
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
for (const file of manifest.files) {
  const target = path.join(root, file.file);
  if (!fs.existsSync(target) || hash(fs.readFileSync(target)) !== file.installedSha256) {
    console.error('Cannot restore automatically: ' + file.file + ' has changed since installation.');
    console.error('No files were modified. Review this backup manually: ' + folder);
    process.exit(1);
  }
}
for (const file of manifest.files) {
  const target = path.join(root, file.file);
  if (file.exists) fs.writeFileSync(target, fs.readFileSync(path.join(folder, file.backup)));
  else fs.unlinkSync(target);
  console.log((file.exists ? 'RESTORE ' : 'REMOVE ') + file.file);
}
console.log('Previous files restored.');
