#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const dry = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const files = ['src/pages/history/index.astro', 'src/components/PoliticalOrganisation.astro'];
const backups = path.join(root, '.pilotlwe-history-separation-backup');
const marker = 'PILOTLWE_SEPARATED_HISTORY';
function read(rel) {let p=path.join(root,rel);if(!fs.existsSync(p))throw Error('Missing file: '+rel);return fs.readFileSync(p,'utf8')}
function undoAction(){let m=path.join(backups,'manifest.json');if(!fs.existsSync(m))throw Error('No backup found.');let arr=JSON.parse(fs.readFileSync(m,'utf8'));for(let rel of arr){let to=path.join(root,rel);fs.copyFileSync(path.join(backups,'files',rel),to);console.log('RESTORED',rel)}}
function historyPatch(t){
  if(t.includes(marker)) return t;
  if(!t.includes('history-layout') || !t.includes('history-chapter')) throw Error('History layout is different; no changes made.');
  if(!t.includes('<PoliticalOrganisation />')) throw Error('PoliticalOrganisation component reference not found in History page.');
  // Remove the former buggy pager CSS and JS. These were inserted by the prior local repair.
  t=t.replace(/<style is:global>\s*\/\* PILOTLWE_HISTORY_PAGER \*\/[\s\S]*?<\/style>/g,'');
  t=t.replace(/<script>\s*\/\/ PILOTLWE_HISTORY_PAGER[\s\S]*?<\/script>/g,'');
  // Remove old standalone chapter pager and replace with a dedicated historical pager.
  t=t.replace(/<nav class="history-pager history-shell" id="history-page-controls"[\s\S]*?<\/nav>/g,'');
  // Fix old per-chapter class default: use the original first chapter shown, others hidden after JS starts.
  t=t.replace(/class:list=\{\['history-chapter', \{'chapter-visible': chapter\.number === '01'\}\]\}/g,'class="history-chapter"');
  // Our part navigation is outside historical layout, so visible with either mode.
  const partNav=`<nav class="history-part-tabs" aria-label="History sections">
          <a href="#naxalbari" data-history-part="evolution">PART I <strong>Historical Evolution</strong></a>
          <a href="#political-organisation" data-history-part="organisation">PART II <strong>Organisation &amp; Leadership</strong></a>
        </nav>`;
  if(t.includes('<div class="history-layout">')) t=t.replace('<div class="history-layout">',partNav+'\n      <div class="history-layout">');
  else throw Error('Could not locate the history content layout.');
  // Insert six-phase pager within historical layout and outside the organisation component.
  const pos=t.indexOf('<PoliticalOrganisation />');
  if(pos<0) throw Error('PoliticalOrganisation missing.');
  t=t.slice(0,pos)+`<nav class="history-pager history-shell" id="history-page-controls" aria-label="Historical phase navigation">
           <button type="button" id="history-prev">← Previous phase</button>
           <span id="history-counter" aria-live="polite">Phase 1</span>
           <button type="button" id="history-next">Next phase →</button>
         </nav>\n         `+t.slice(pos);
  // Move new pager BEFORE the component; default wrapper remains in main. The same mode logic hides it when organisation is active.
  // One-chapter display is enabled only after JS executes; prevents blank page on no-JS clients.
  t+=`\n<style is:global>\n/* ${marker} */
.history-part-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:28px 0 0;padding:8px;background:#eae2d7;border:1px solid #d7c9ba}
.history-part-tabs a{display:flex;flex-direction:column;gap:5px;min-width:230px;flex:1;padding:16px 20px;color:#75685d;text-decoration:none;font:800 10px/1.4 system-ui,sans-serif;letter-spacing:.12em}
.history-part-tabs strong{font:700 clamp(17px,1.8vw,22px)/1.3 Georgia,serif;letter-spacing:0;color:#262a2b}
.history-part-tabs a.is-active{background:#fffaf3;box-shadow:inset 0 -3px #a45232;color:#a45232}
.history-page.history-js .history-chapter:not(.chapter-visible){display:none!important}
.history-page.history-js.organisation-selected .history-layout,.history-page.history-js.organisation-selected #history-page-controls{display:none!important}
.history-page.history-js:not(.organisation-selected) #political-organisation{display:none!important}
.history-page .history-layout{padding-top:34px}
.history-page .history-toc a.is-selected{color:#a45232!important;border-left:3px solid #a45232;background:#efe3d5;padding-left:10px!important}
.history-pager{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:26px;padding-bottom:46px;margin-top:12px;border-top:1px solid #d8cfc2}
.history-pager button{border:1px solid #34383a;background:#292d30;color:#fff9ef;padding:12px 18px;font:700 12px system-ui,sans-serif;cursor:pointer}
.history-pager button:hover:not(:disabled){background:#a45232}.history-pager button:disabled{opacity:.38;cursor:not-allowed}
.history-pager span{font:700 12px system-ui,sans-serif;color:#6c6054}
@media(max-width:680px){.history-part-tabs a{min-width:0;flex-basis:100%}.history-pager{flex-wrap:wrap}.history-pager span{order:-1;flex:1 0 100%;text-align:center}.history-pager button{flex:1}}
</style>
<script>
 // ${marker}
 (() => {
   const root=document.querySelector('.history-page');
   if(!root)return;
   const chapters=[...root.querySelectorAll('.history-chapter')];
   const political=document.getElementById('political-organisation');
   const sidebar=[...root.querySelectorAll('.history-toc a[href^="#"]')];
   const parts=[...root.querySelectorAll('[data-history-part]')];
   const prev=document.getElementById('history-prev');
   const next=document.getElementById('history-next');
   const counter=document.getElementById('history-counter');
   if(!chapters.length)return;
   let current=0;
   function render(scroll=false){
     const hash=decodeURIComponent(location.hash.replace(/^#/,''));
     const isOrganisation=hash==='political-organisation'||hash.startsWith('po-topic-');
     root.classList.toggle('organisation-selected',isOrganisation);
     if(!isOrganisation){
       const index=chapters.findIndex(el=>el.id===hash);
       if(index>=0)current=index;
       chapters.forEach((el,i)=>el.classList.toggle('chapter-visible',i===current));
       if(prev)prev.disabled=current===0;
       if(next)next.disabled=current===chapters.length-1;
       if(counter)counter.textContent='Phase '+(current+1)+' of '+chapters.length;
     }
     parts.forEach(el=>{let active=el.dataset.historyPart===(isOrganisation?'organisation':'evolution');el.classList.toggle('is-active',active);if(active)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current')});
     sidebar.forEach(el=>{let href=el.getAttribute('href');let active=href==='#'+(isOrganisation?'political-organisation':chapters[current].id);el.classList.toggle('is-selected',active)});
     if(scroll){let target=isOrganisation?political:root.querySelector('.history-layout');target?.scrollIntoView({block:'start',behavior:'smooth'});}
   }
   function navigate(hash){history.pushState(null,'',hash);render(true);window.dispatchEvent(new Event('history-part-change'));}
   prev?.addEventListener('click',()=>{if(current>0)navigate('#'+chapters[current-1].id)});
   next?.addEventListener('click',()=>{if(current<chapters.length-1)navigate('#'+chapters[current+1].id)});
   for(let link of [...parts,...sidebar]){link.addEventListener('click',ev=>{let href=link.getAttribute('href')||'';if(href.startsWith('#')&&(href==='#political-organisation'||chapters.some(ch=>href==='#'+ch.id))){ev.preventDefault();navigate(href)}})}
   window.addEventListener('hashchange',()=>render(false));
   root.classList.add('history-js');
   render(false);
 })();
</script>\n`;
  return t;
}
function politicalPatch(t){
 if(t.includes(marker))return t;
 if(!t.includes('class="po-item"')||!t.includes('id="political-organisation"'))throw Error('Political Organisation component structure unexpected.');
 // Remove the exact unwanted explanatory line.
 t=t.replace(/\s*<p>An account of the CPI \(Maoist\) party structure and the relationship between organisational committees, military institutions and mass organisations, based on the supplied constitutional analysis\.<\/p>/,'');
 t=t.replace('HISTORY / ORGANISATION','HISTORY / PART II');
 t=t.replace('IN THIS CHAPTER','EXPLORE 15 TOPICS');
 // Simple subtopic pager. Preserve entire text and diagram; JS shows one topic at a time after page loads.
 const pager=`<nav class="po-pager" aria-label="Organisation topic navigation">
            <button type="button" id="po-prev">← Previous topic</button>
            <span id="po-progress" aria-live="polite">Topic 1 of 15</span>
            <button type="button" id="po-next">Next topic →</button>
          </nav>`;
 if(!t.includes('class="po-content"'))throw Error('Political Organisation content area not found.');
 t=t.replace(/(<div class="po-content">\s*\{sections\.map\([\s\S]*?\)\}\s*)(<\/div>)/,(_,inner,close)=>inner+pager+close);
 // CSS :global because component's class is dynamically set in browser by JavaScript.
 t+=`\n<style is:global>\n/* ${marker} */
#political-organisation .po-heading>p:last-child:not(.po-kicker){display:none}
#political-organisation.po-js .po-item:not(.po-selected){display:none!important}
#political-organisation .po-toc a.po-active{background:#eee2d4;color:#9a4b2b;border-left:3px solid #a45232;padding-left:11px;font-weight:700}
#political-organisation .po-figure{max-width:920px;margin-left:auto;margin-right:auto}
#political-organisation .po-figure img{max-height:520px;object-fit:contain}
#political-organisation .po-pager{display:flex;align-items:center;justify-content:space-between;gap:15px;padding-top:20px;border-top:1px solid #dacfc0}
#political-organisation .po-pager button{padding:12px 16px;border:1px solid #34383a;background:#292d30;color:#fff9ef;cursor:pointer;font:700 12px system-ui,sans-serif}
#political-organisation .po-pager button:disabled{opacity:.35;cursor:not-allowed}
#political-organisation .po-pager button:hover:not(:disabled){background:#a45232}
#political-organisation .po-pager span{font:700 12px system-ui,sans-serif;color:#6c6054}
@media(max-width:600px){#political-organisation .po-pager{flex-wrap:wrap}#political-organisation .po-pager span{order:-1;flex:1 0 100%;text-align:center}#political-organisation .po-pager button{flex:1}}
</style>
<script>
 // ${marker}
 (()=>{
   const section=document.getElementById('political-organisation');if(!section)return;
   const items=[...section.querySelectorAll('.po-item')];
   const links=[...section.querySelectorAll('.po-toc a[href^="#po-topic-"]')];
   const prev=section.querySelector('#po-prev');const next=section.querySelector('#po-next');const progress=section.querySelector('#po-progress');
   if(!items.length)return;
   let selected=0;
   function update(){
     const match=location.hash.match(/^#po-topic-(\\d+)$/);
     if(match) selected=Math.max(0,Math.min(items.length-1,Number(match[1])-1));
     items.forEach((el,i)=>el.classList.toggle('po-selected',i===selected));
     links.forEach((el,i)=>{el.classList.toggle('po-active',i===selected);if(i===selected)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current')});
     if(prev)prev.disabled=selected===0;if(next)next.disabled=selected===items.length-1;
     if(progress)progress.textContent='Topic '+(selected+1)+' of '+items.length;
   }
   function navigate(i){selected=i;history.pushState(null,'','#po-topic-'+(i+1));update();section.querySelector('.po-layout')?.scrollIntoView({behavior:'smooth',block:'start'});window.dispatchEvent(new Event('hashchange'));}
   prev?.addEventListener('click',()=>{if(selected>0)navigate(selected-1)});
   next?.addEventListener('click',()=>{if(selected<items.length-1)navigate(selected+1)});
   links.forEach((el,i)=>el.addEventListener('click',e=>{e.preventDefault();navigate(i)}));
   window.addEventListener('hashchange',update);window.addEventListener('history-part-change',update);
   section.classList.add('po-js');update();
 })();
</script>\n`;
 return t;
}
try{
 if(undo){undoAction();process.exit(0)}
 const original=files.map(f=>[f,read(f)]);
 const updated=new Map([[files[0],historyPatch(original[0][1])],[files[1],politicalPatch(original[1][1])]]);
 const changes=[...updated].filter(([f,t])=>t!==original.find(([g])=>g===f)[1]);
 console.log('PilotLWE History separation —',root);for(const [f] of changes)console.log('UPDATE',f);
 if(dry){console.log('Dry run complete. Nothing changed.');process.exit(0)}
 if(!changes.length){console.log('Already installed. Nothing changed.');process.exit(0)}
 if(fs.existsSync(path.join(backups,'manifest.json')))throw Error('Backup already exists. Save or undo the prior install before reapplying.');
 for(const [rel,txt] of original){if(!changes.some(([f])=>f===rel))continue;const dest=path.join(backups,'files',rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,txt)}
 fs.writeFileSync(path.join(backups,'manifest.json'),JSON.stringify(changes.map(([f])=>f),null,2));
 try{for(const [rel,text] of changes)fs.writeFileSync(path.join(root,rel),text)}catch(err){for(const [rel] of changes)fs.copyFileSync(path.join(backups,'files',rel),path.join(root,rel));throw err}
 console.log('Updated. Now run npm.cmd run build.');
}catch(err){console.error('Installation stopped:',err.message);process.exitCode=1}
