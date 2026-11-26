'use strict';
/** Restore the most recent installation if its files have not been edited. */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=process.cwd();
const folder=root+'-voices-backups';
const hash=(bytes)=>crypto.createHash('sha256').update(bytes).digest('hex');
if(!fs.existsSync(folder)){console.error('No voices installation backups found.');process.exit(1);}
const dirs=fs.readdirSync(folder).filter(name=>fs.existsSync(path.join(folder,name,'manifest.json'))).sort().reverse();
if(!dirs.length){console.error('No manifest found.');process.exit(1);}
const backup=path.join(folder,dirs[0]);
const manifest=JSON.parse(fs.readFileSync(path.join(backup,'manifest.json'),'utf8'));
if(path.resolve(manifest.projectRoot)!==path.resolve(root)){console.error('This backup belongs to a different project.');process.exit(1);}
let conflicts=[];
for(const item of manifest.files){
 const target=path.join(root,item.relative);
 if(fs.existsSync(target)&&hash(fs.readFileSync(target))!==item.installedSha256) conflicts.push(item.relative);
}
if(conflicts.length){
 console.error('Restoration stopped to protect edits made after installation:');
 conflicts.forEach(p=>console.error('  '+p));
 console.error('Revert those edits separately before rerunning the restore script.');
 process.exit(1);
}
for(const item of manifest.files){
 const target=path.join(root,item.relative);
 const original=path.join(backup,'original',item.relative);
 if(item.existed){fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(original,target);}
 else if(fs.existsSync(target))fs.unlinkSync(target);
 console.log('RESTORED '+item.relative);
}
fs.renameSync(path.join(backup,'manifest.json'),path.join(backup,'manifest.restored.json'));
console.log('Restoration complete. Backup retained at: '+backup);
