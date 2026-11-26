#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=process.cwd();
const base=path.join(root,'.naxal-major-incidents-backups');
try {
  const folders=fs.readdirSync(base).sort().reverse();
  const folder=folders.find(f=>fs.existsSync(path.join(base,f,'manifest.json')));
  if(!folder)throw Error('No backup manifest found.');
  const dir=path.join(base,folder);
  const {changes}=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
  console.log('Restoring backup:',folder);
  for(const c of changes) {
    const dest=path.join(root,c.file);
    if(c.existed) {fs.copyFileSync(path.join(dir,c.file),dest);console.log('RESTORE',c.file);}
    else if(fs.existsSync(dest)) {fs.unlinkSync(dest);console.log('REMOVE',c.file);}
  }
  console.log('Restored. Run npm.cmd run build to verify.');
} catch(e) {console.error('Restore stopped:',e.message);process.exitCode=1;}
