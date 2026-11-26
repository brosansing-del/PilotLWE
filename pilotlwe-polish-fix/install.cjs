#!/usr/bin/env node
'use strict';
const fs=require('fs'), path=require('path');
const root=process.cwd(), dry=process.argv.includes('--dry-run'), undo=process.argv.includes('--undo');
const store=path.join(root,'.pilotlwe-polish-backup');
const change=new Map();
function read(p){const abs=path.join(root,p); if(!fs.existsSync(abs)) throw Error('Required file missing: '+p); return fs.readFileSync(abs,'utf8');}
function update(p,t){if(t!==read(p))change.set(p,t);}
function backupRestore(){const manifest=path.join(store,'manifest.json');if(!fs.existsSync(manifest))throw Error('No backup manifest found');let files=JSON.parse(fs.readFileSync(manifest));for(let p of files){fs.copyFileSync(path.join(store,'saved',p),path.join(root,p));console.log('RESTORED',p)} }
function patchHeader(){const p='src/components/Header.astro';let t=read(p);let before=t;
 // Remove any stand-alone Tracking Development anchor, regardless of helper format.
 t=t.replace(/^\s*<a\b[^>]*>\s*Tracking Development\s*<\/a>\s*$/gm,'');
 t=t.replace(/^\s*<a\b[^>]*>\s*Tracking Development\s*<\/a>/gm,'');
 if(/>\s*Tracking Development\s*<\/a>/.test(t)) throw Error('Could not safely remove Tracking Development link in Header');
 // Refrain from editing any other navbar structure; existing active status remains.
 update(p,t);
}
function patchHome(){let p='src/pages/index.astro',t=read(p);
 // remove old development section while keeping other homepage sections.
 const devStart=t.search(/<section\b[^>]*class="[^"]*section-dark[^"]*"[^>]*id="development"/);
 if(devStart>=0){const endComment=t.indexOf('<!-- ======================================================',devStart); if(endComment>=0) t=t.slice(0,devStart)+t.slice(endComment);else throw Error('Could not safely isolate Tracking Development homepage section');}
 else if(/Tracking Development/.test(t)) throw Error('Unexpected Tracking Development markup in index.astro');
 // remove empty stats cards / unpopulated key-indicators section (if still present).
 if(t.includes('These figures will be populated from validated datasets')){
  const start=t.lastIndexOf('<section class="section shell">',t.indexOf('These figures will be populated'));
  const end=t.indexOf('</section>',t.indexOf('These figures will be populated'));
  if(start>=0&&end>start){t=t.slice(0,start)+t.slice(end+'</section>'.length);}
  else throw Error('Cannot isolate unpopulated Key Indicators block');
 }
 // Ensure no stale import for the removed indicator cards, harmless but clean.
 if(!t.includes('<StatCard'))t=t.replace(/^import StatCard from [^\n]*\n/m,'');
 update(p,t);
}
function patchHistory(){const p='src/pages/history/index.astro';let t=read(p);
 if(!t.includes('class="history-chapter"')&&!t.includes('class:list={[\'history-chapter\'')) throw Error('Cannot locate History chapter markup');
 // Replace the old oversized decorative banner with a compact text-only header.
 if(t.includes('<header class="history-hero">')){
  t=t.replace(/<header class="history-hero">[\s\S]*?<\/header>/,`<header class="history-compact-intro"><span class="history-kicker">THE NAXAL ARCHIVE / HISTORY</span><h1>Explore the historical record.</h1><p>Choose a chapter below. Use Previous and Next to continue reading without scrolling through the entire history.</p></header>`);
 }
 // Remove old reading guide to reduce unnecessary vertical space.
 t=t.replace(/\s*<div class="reading-intro"[\s\S]*?<\/div>/,'');
 // Make the first chapter visible without JavaScript while hiding the rest on first load.
 t=t.replace('class="history-chapter"',`class:list={['history-chapter', {'chapter-visible': chapter.number === '01'}]}`);
 // Insert next/previous controls just after history-layout (using unique anchor before shell closes).
 if(!t.includes('id="history-page-controls"')){
   const anchor='  </main>';
   if(!t.includes(anchor)) throw Error('Cannot locate History main closing point');
   t=t.replace(anchor,`    <nav class="history-pager history-shell" id="history-page-controls" aria-label="Move between History chapters"><button type="button" id="history-prev">← Previous chapter</button><span id="history-counter" aria-live="polite">Chapter 1 of 7</span><button type="button" id="history-next">Next chapter →</button></nav>\n${anchor}`);
 }
 if(!t.includes('id="political-organisation"')&&!t.includes('<PoliticalOrganisation />')){
   console.warn('Political Organisation not yet installed; pager will adapt to available chapters.');
 }
 // Place all CSS and client script outside Astro frontmatter.
 if(!t.includes('PILOTLWE_HISTORY_PAGER')){
 t+=`\n<style is:global>\n/* PILOTLWE_HISTORY_PAGER */\n.history-page .history-chapter:not(.chapter-visible),.history-page #political-organisation:not(.chapter-visible){display:none!important}\n.history-page .history-hero{display:none!important}\n.history-compact-intro{padding:26px 0 30px;border-bottom:1px solid #d6cabc}\n.history-compact-intro .history-kicker{font:800 10px/1.4 system-ui,sans-serif;letter-spacing:.16em;color:#96502f}\n.history-compact-intro h1{font:700 clamp(30px,4vw,52px)/1.1 Georgia,serif;letter-spacing:-.035em;margin:14px 0;color:#20272b}\n.history-compact-intro p{font:16px/1.6 Georgia,serif;color:#645e57;max-width:750px;margin:0}\n.history-page .history-layout{padding-top:28px}\n.history-page .history-content .history-chapter{margin:0;border:0;padding-bottom:24px}\n.history-page .history-toc a.is-selected{color:#9d4b2b!important;background:#eee1d1;font-weight:800!important;border-left:3px solid #a45232;padding-left:12px!important}\n.history-pager{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:25px 0 44px;margin-top:24px;border-top:1px solid #d8cfc2}\n.history-pager button{border:1px solid #a45232;background:#272b2e;color:#fffaf0;padding:13px 16px;font:700 12px/1.3 system-ui,sans-serif;cursor:pointer}\n.history-pager button:hover:not(:disabled){background:#a45232}.history-pager button:disabled{opacity:.35;cursor:not-allowed}\n.history-pager span{font:700 12px system-ui,sans-serif;color:#665e54}\n@media(max-width:600px){.history-pager{flex-wrap:wrap}.history-pager span{order:-1;flex-basis:100%;text-align:center}.history-pager button{flex:1}.history-page .history-layout{padding-top:14px}}\n</style>\n<script>\n // PILOTLWE_HISTORY_PAGER\n const chapters = [...document.querySelectorAll('.history-page .history-chapter, .history-page #political-organisation')];\n const prev = document.getElementById('history-prev');\n const next = document.getElementById('history-next');\n const counter = document.getElementById('history-counter');\n const links = [...document.querySelectorAll('.history-page .history-toc a[href^="#"]')];\n let current = 0;\n const findIndex = (hash) => chapters.findIndex(el => el.id === decodeURIComponent(hash.replace(/^#/,'')) || (hash.startsWith('#po-topic-') && el.id === 'political-organisation'));\n function showChapter(index,{scroll=true}={}) {\n   if(index<0 || index>=chapters.length)return;\n   current=index;\n   chapters.forEach((el,i)=>el.classList.toggle('chapter-visible',i===index));\n   links.forEach(a=>{const active=a.getAttribute('href') === '#'+chapters[index].id;a.classList.toggle('is-selected',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});\n   if(prev instanceof HTMLButtonElement)prev.disabled=index===0;\n   if(next instanceof HTMLButtonElement)next.disabled=index===chapters.length-1;\n   if(counter)counter.textContent='Chapter '+(index+1)+' of '+chapters.length;\n   if(scroll)document.querySelector('.history-compact-intro')?.scrollIntoView({behavior:'smooth',block:'start'});\n }\n function selectFromHash(){const i=findIndex(window.location.hash);showChapter(i>=0?i:0,{scroll:false});}\n prev?.addEventListener('click',()=>{if(current>0){history.replaceState(null,'','#'+chapters[current-1].id);showChapter(current-1);}});\n next?.addEventListener('click',()=>{if(current<chapters.length-1){history.replaceState(null,'','#'+chapters[current+1].id);showChapter(current+1);}});\n links.forEach(a=>a.addEventListener('click',e=>{const i=findIndex(a.hash);if(i>=0){e.preventDefault();history.pushState(null,'',a.hash);showChapter(i);}}));\n window.addEventListener('hashchange',selectFromHash);\n selectFromHash();\n</script>\n`;
 }
 update(p,t);
}
function patchVideos(){const p='src/data/archiveVideos.ts';let t=read(p);
 // Target only the exact user-supplied video ID, not other footage.
 const key='uwZY64u-SP0';const match=new RegExp(String.raw`\{[^{}]*youtubeId:\s*['"]${key}['"][^{}]*\}`,'m');
 const found=t.match(match);if(!found)throw Error('Cannot find Human Cost of Conflict video entry (uwZY64u-SP0).');
 let block=found[0];const title='Burkapal Massacre: The Brutal Face of CPI (Maoist) Violence';
 const desc='A CRPF survivor recounts the horrific Naxalite attack in Sukma’s Burkapal that claimed the lives of 25 brave jawans. The brutal attack on personnel protecting road construction exposes the destructive nature of Maoist violence, its opposition to development and devastating human cost.';
 block=block.replace(/title:\s*(?:'[^']*'|"[^"]*")/,`title: ${JSON.stringify(title)}`);
 block=block.replace(/description:\s*(?:'[^']*'|"[^"]*")/,`description: ${JSON.stringify(desc)}`);
 if(!block.includes(title)||!block.includes(desc))throw Error('Could not update Burkapal title and description safely');
 t=t.replace(found[0],block);update(p,t);
}
function run(){if(undo){backupRestore();return}patchHeader();patchHome();patchHistory();patchVideos();console.log('PilotLWE review fix | project: '+root);console.log('Files to change: '+change.size);for(const p of change.keys())console.log('UPDATE '+p);if(dry){console.log('Dry run: nothing changed.');return;}if(!change.size){console.log('No changes needed.');return;}fs.mkdirSync(path.join(store,'saved'),{recursive:true});let done=[];for(const p of change.keys()){const target=path.join(store,'saved',p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,p),target);}fs.writeFileSync(path.join(store,'manifest.json'),JSON.stringify([...change.keys()],null,2));try{for(const [p,t]of change){fs.writeFileSync(path.join(root,p),t);done.push(p);}}catch(e){for(const p of done)fs.copyFileSync(path.join(store,'saved',p),path.join(root,p));throw e;}console.log('Updated. Check npm.cmd run build and npm.cmd run dev.');}
try{run()}catch(e){console.error('Stopped without applying changes:',e.message);process.exitCode=1;}
