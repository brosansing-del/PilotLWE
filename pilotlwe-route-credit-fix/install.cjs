#!/usr/bin/env node
'use strict';
const fs=require('fs');const path=require('path');
const root=process.cwd(); const dry=process.argv.includes('--dry-run'); const undo=process.argv.includes('--undo');
const backup=path.join(root,'.pilotlwe-route-credit-fix-backup');const changes=new Map();
function exists(rel){return fs.existsSync(path.join(root,rel));}
function read(rel){if(!exists(rel))throw Error('Required file not found: '+rel);return fs.readFileSync(path.join(root,rel),'utf8');}
function put(rel,text){if(text!==read(rel))changes.set(rel,{action:'write',value:text});}
function remove(rel){if(exists(rel))changes.set(rel,{action:'delete'});}
function patchHome(){let rel='src/pages/index.astro';let s=read(rel);
 const newLinks=[
 'history/#naxalbari',
 'history/#formation-of-cpi-ml',
 'history/#pwg-mcc',
 'history/#convergence',
 'history/#cpi-maoist',
 // Requested destination for phase 06, despite its different subject.
 'history/#naxalbari'
 ];
 // Transform only phase cards, not unrelated site links.
 let n=0;
 s=s.replace(/(<a\b[^>]*class="phase-card"[^>]*?href=\{pageUrl\(')([^']+)('\)\})/gs,(all,head,old,tail)=>{
   if(n>=newLinks.length)throw Error('More than six phase-card links: stopped');
   return head+newLinks[n++]+tail;
 });
 // Some versions put href before class. Match phase cards by anchors surrounding the numbered blocks.
 if(n!==6){n=0;s=s.replace(/<a\s+class="phase-card"\s+href=\{pageUrl\('([^']+)'\)\}/g,()=>`<a class="phase-card" href={pageUrl('${newLinks[n++]}')}`);}
 if(n!==6)throw Error('Expected six homepage phase cards. Found '+n+'. Current files differ; no changes made.');
 // Replace other visible old background link after phase grid without altering History page.
 s=s.replace(/pageUrl\('background\/'\)/g,"pageUrl('history/')");
 s=s.replace(/Explore full background/g,'Explore full history');
 put(rel,s);
}
function patchVideos(){let rel='src/data/archiveVideos.ts',s=read(rel);
 if(!s.includes('publisher?: string')){
  const marker='  youtubeId: string;';if(!s.includes(marker))throw Error('Cannot locate video type declaration');
  s=s.replace(marker,marker+'\n  publisher?: string;');
 }
 // User-approved title and supplied summary on the exact video ID only.
 const id='uwZY64u-SP0';const re=/\{[^{}]*youtubeId:\s*['"]uwZY64u-SP0['"][^{}]*\}/m;
 const item=s.match(re);
 if(item){let b=item[0];
  const title='Burkapal Massacre: The Brutal Face of CPI (Maoist) Violence';
  const description='A CRPF survivor recounts the Naxalite attack at Burkapal in Sukma on 24 April 2017, when 25 CRPF personnel were killed. The attack occurred as personnel were supporting road-access operations in the area. The testimony reflects the human cost of the violence.';
  b=b.replace(/title:\s*(?:'[^']*'|"[^"]*")/,`title: ${JSON.stringify(title)}`);
  b=b.replace(/description:\s*(?:'[^']*'|"[^"]*")/,`description: ${JSON.stringify(description)}`);
  if(!b.includes(title)||!b.includes(description))throw Error('Burkapal video has a different data structure; stopped');
  s=s.replace(item[0],b);
 } else console.log('NOTE: Burkapal video ID not present; other entries retained');
 put(rel,s);
}
function patchVideoCards(){let rel='src/components/ArchiveVideoCollection.astro',s=read(rel);
 const byline=`<span class="av-status">{video.publisher ? \`Courtesy: \${video.publisher}\` : 'Original video on YouTube'}</span>`;
 s=s.replace(/<span class="av-status">[\s\S]*?<\/span>/,byline);
 // Keep thumbnails and original watch links. Remove purely decorative card numbering.
 s=s.replace(/\s*<span class="av-image-number"[^>]*>[\s\S]*?<\/span>/,'');
 put(rel,s);
}
function patchOldRoutes(){
 const old=[
 'src/pages/background/history/index.astro',
 'src/pages/background/history/naxalbari.astro',
 'src/pages/background/history/naxalbari/index.astro'
 ];
 for(const rel of old)remove(rel);
}
function restore(){let m=path.join(backup,'manifest.json');if(!fs.existsSync(m))throw Error('Backup not found; cannot undo');
 for(const [rel,wasPresent] of JSON.parse(fs.readFileSync(m,'utf8'))){const dest=path.join(root,rel);if(wasPresent){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(backup,'original',rel),dest);}else if(fs.existsSync(dest))fs.unlinkSync(dest);console.log('RESTORED',rel);}
}
function main(){if(undo){restore();return;}patchHome();patchVideos();patchVideoCards();patchOldRoutes();
 console.log('PilotLWE / Homepage routes, old History pages & video attribution');
 console.log('Project: '+root);for(const [rel,c] of changes)console.log((c.action==='delete'?'REMOVE ':'UPDATE ')+rel);
 if(dry){console.log('Dry run complete. Nothing changed.');return;}
 if(!changes.size){console.log('Already up to date.');return;}
 const orig=path.join(backup,'original');fs.mkdirSync(orig,{recursive:true});let manifest=[];
 for(const [rel]of changes){const present=exists(rel);manifest.push([rel,present]);if(present){const dest=path.join(orig,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,rel),dest);}}
 fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2));let done=[];
 try{for(const [rel,c] of changes){if(c.action==='delete')fs.unlinkSync(path.join(root,rel));else fs.writeFileSync(path.join(root,rel),c.value,'utf8');done.push(rel);}}
 catch(e){for(const rel of done){let original=path.join(orig,rel);if(fs.existsSync(original))fs.copyFileSync(original,path.join(root,rel));}throw e;}
 console.log('Applied. Run npm.cmd run build and npm.cmd run dev. No GitHub changes made.');
}
try{main()}catch(e){console.error('STOPPED:',e.message);process.exitCode=1;}
