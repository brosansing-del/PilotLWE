#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=process.cwd();
const base=path.join(root,'.major-incidents-only-backups');
if(!fs.existsSync(base)){console.error('No backups found.');process.exit(1);}
const dirs=fs.readdirSync(base).sort().reverse();
const backup=dirs.map(d=>path.join(base,d)).find(d=>fs.existsSync(path.join(d,'manifest.json')));
if(!backup){console.error('No complete backup found.');process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(path.join(backup,'manifest.json'),'utf8'));
console.log('Restoring',backup);
for(const item of manifest){
 const dest=path.join(root,item.name);
 if(item.existed){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(backup,item.name),dest);}
 else if(fs.existsSync(dest)) fs.unlinkSync(dest);
 console.log(' ',item.name);
}
console.log('Restored. Run npm.cmd run build.');
