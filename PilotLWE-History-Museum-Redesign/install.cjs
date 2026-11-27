#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const base = __dirname;
const dry = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const historyRel = 'src/pages/history/index.astro';
const orgRel = 'src/components/PoliticalOrganisation.astro';
const illustrationRel = 'public/images/history/cpi-maoist-hierarchy.png';
const backupRoot = path.join(root,'.pilotlwe-history-museum-backups');
const ledger = path.join(backupRoot,'latest.json');
const marker='HISTORY_MUSEUM_V1';
const abs=(rel)=>path.join(root,rel);
const read=(rel)=>{if(!fs.existsSync(abs(rel)))throw Error('Missing required project file: '+rel);return fs.readFileSync(abs(rel),'utf8');};
function extractArray(code,name){
  const startRe=new RegExp('\\bconst\\s+'+name+'\\s*=\\s*\\[');
  const match=startRe.exec(code);
  if(!match)throw Error('Cannot find the "const '+name+' = [...]" collection in existing project. No changes were made.');
  const begin=match.index;
  const bracket=code.indexOf('[',begin);
  let depth=0,quote='',escaped=false,inComment=false;
  for(let i=bracket;i<code.length;i++){
    const c=code[i],n=code[i+1];
    if(inComment){if(c==='\n')inComment=false;continue;}
    if(quote){if(escaped){escaped=false;continue;}if(c==='\\'){escaped=true;continue;}if(c===quote)quote='';continue;}
    if(c==='/'&&n==='/'){inComment=true;i++;continue;}
    if(c==='\''||c==='"'||c==='`'){quote=c;continue;}
    if(c==='[')depth++;
    if(c===']'&&--depth===0){let end=i+1;while(/\s/.test(code[end]||''))end++;if(code[end]===';')end++;return code.slice(begin,end);}
  }
  throw Error('Unable to locate end of '+name+' array; no changes made.');
}
function rollback(){
  if(!fs.existsSync(ledger))throw Error('No backup record found at '+ledger);
  const meta=JSON.parse(fs.readFileSync(ledger,'utf8'));
  for(const entry of meta.entries){
    const dest=abs(entry.rel);
    if(entry.existed){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(meta.folder,entry.rel),dest);console.log('RESTORED '+entry.rel);}
    else if(fs.existsSync(dest)){fs.unlinkSync(dest);console.log('REMOVED new file '+entry.rel);}
  }
  console.log('Rollback complete.');
}
try{
  if(undo){rollback();process.exit(0);}
  if(!fs.existsSync(abs('package.json'))||!fs.existsSync(abs('astro.config.mjs')))throw Error('Run this installer from the PilotLWE Astro project root, e.g. D:\\PilotLWE.');
  const history=read(historyRel);
  const org=read(orgRel);
  if(history.includes(marker) && org.includes(marker)){console.log('Already installed; no changes made.');process.exit(0);}
  if((history.includes(marker)!==org.includes(marker)))throw Error('Partial prior installation detected; use --undo or inspect files before rerunning.');
  const chapters=extractArray(history,'chapters');
  const sections=extractArray(org,'sections');
  // Require known historical anchors before replacing content, ensuring no accidental data loss.
  if(/<img\b|<figure\b/.test(history))throw Error('History page contains inline images or figures not represented in the saved chapter arrays. Please review these manually before replacing; no changes made.');
  if(!chapters.includes('naxalbari')||!chapters.includes('formation-of-cpi-ml'))throw Error('Historical collection differs; no files changed.');
  if(!sections.includes('The Party')||!sections.includes('paragraphs'))throw Error('Political Organisation data differs; no files changed.');
  const templateHistory=fs.readFileSync(path.join(base,'templates','index.astro.tpl'),'utf8');
  const templateOrg=fs.readFileSync(path.join(base,'templates','PoliticalOrganisation.astro.tpl'),'utf8');
  const newHistory=templateHistory.replace('__PRESERVED_CHAPTER_ARRAY__',chapters+'\n// '+marker);
  const newOrg=templateOrg.replace('__PRESERVED_POLITICAL_ARRAY__',sections+'\n// '+marker);
  const illustrationSource=path.join(base,'assets','cpi-maoist-hierarchy.png');
  const updates=[{rel:historyRel,bytes:Buffer.from(newHistory)},{rel:orgRel,bytes:Buffer.from(newOrg)}];
  if(!fs.existsSync(abs(illustrationRel))&&fs.existsSync(illustrationSource))updates.push({rel:illustrationRel,bytes:fs.readFileSync(illustrationSource)});
  console.log('PilotLWE History redesign');
  console.log('Existing historical chapter collection and political analysis: preserved from live project files');
  updates.forEach(v=>console.log(`${fs.existsSync(abs(v.rel))?'UPDATE':'CREATE'} ${v.rel}`));
  if(dry){console.log('Dry run complete. No changes made.');process.exit(0);}
  const folder=path.join(backupRoot,new Date().toISOString().replace(/[:.]/g,'-'));
  const entries=updates.map(v=>({rel:v.rel,existed:fs.existsSync(abs(v.rel))}));
  for(const entry of entries){if(entry.existed){const save=path.join(folder,entry.rel);fs.mkdirSync(path.dirname(save),{recursive:true});fs.copyFileSync(abs(entry.rel),save);}}
  // Write atomically per file; restore the backup on failure.
  const changed=[];
  try{
    for(const v of updates){fs.mkdirSync(path.dirname(abs(v.rel)),{recursive:true});const tmp=abs(v.rel)+'.museum-install-tmp';fs.writeFileSync(tmp,v.bytes);fs.renameSync(tmp,abs(v.rel));changed.push(v.rel);}
  }catch(error){for(const rel of changed){const prev=entries.find(e=>e.rel===rel);if(prev?.existed)fs.copyFileSync(path.join(folder,rel),abs(rel));else if(fs.existsSync(abs(rel)))fs.unlinkSync(abs(rel));}throw error;}
  fs.mkdirSync(backupRoot,{recursive:true});
  fs.writeFileSync(ledger,JSON.stringify({folder,entries,created:new Date().toISOString()},null,2));
  console.log('Installation complete. Backup: '+folder);
  console.log('Next: npm.cmd run build; npm.cmd run dev');
}catch(e){console.error('Installation stopped: '+e.message);process.exit(1);}
