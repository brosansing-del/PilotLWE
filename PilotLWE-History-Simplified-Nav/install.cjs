#!/usr/bin/env node
'use strict';
const fs=require('fs');const path=require('path');
const root=process.cwd();const dry=process.argv.includes('--dry-run');const undo=process.argv.includes('--undo');
const rels=['src/components/Header.astro','src/pages/history/index.astro','src/components/PoliticalOrganisation.astro'];
const backupRoot=path.join(root,'.pilotlwe-history-navigation-backups');const ledger=path.join(backupRoot,'latest.json');
const file=r=>path.join(root,r);
function must(ok,msg){if(!ok)throw Error(msg)}
function replaceOnce(s,find,replace,label){const i=s.indexOf(find);must(i!==-1,'Could not find '+label+'. No changes made.');must(s.indexOf(find,i+find.length)===-1,'Found multiple '+label+' matches. No changes made.');return s.replace(find,replace)}
function read(r){must(fs.existsSync(file(r)),'Missing '+r);return fs.readFileSync(file(r),'utf8')}
function restore(){must(fs.existsSync(ledger),'No rollback ledger found');const data=JSON.parse(fs.readFileSync(ledger,'utf8'));for(const r of data.files){fs.copyFileSync(path.join(data.folder,r),file(r));console.log('RESTORED '+r);}console.log('Rollback complete');}
function updateHeader(s){
  const start=s.indexOf('<!-- HISTORY DROPDOWN -->');must(start>=0,'History dropdown anchor in Header.astro');
  const end=s.indexOf('<!-- DATA & VISUALS DROPDOWN -->',start);must(end>start,'Data & Visuals dropdown anchor in Header.astro');
  const history=`<!-- HISTORY DROPDOWN -->\n      <div class="nav-dropdown">\n        <a class="nav-dropdown-trigger" href={url('history/#naxalbari')}>History</a>\n        <div class="dropdown-menu background-menu">\n          <div class="dropdown-label">HISTORY</div>\n          <a href={url('history/#naxalbari')}><span><strong>Historical Evolution</strong><small>Six phases of the Naxalite movement</small></span></a>\n          <a href={url('history/#political-organisation')}><span><strong>Political Organisation</strong><small>Structure, leadership and internal functioning</small></span></a>\n        </div>\n      </div>\n\n      `;
  return s.slice(0,start)+history+s.slice(end);
}
function updateHistory(s){
  must(s.includes('class="museum-history"'),'Museum History page structure');
  // Remove the Part I/II tabs; navigation is now only in the header dropdown.
  s=s.replace(/\s*<nav class="mh-parts" aria-label="History sections">[\s\S]*?<\/nav>/,'');
  must(!s.includes('<nav class="mh-parts"'),'History tabs removal');
  // Remove selected-tab references and update the organisation selection logic.
  s=s.replace(/^  \.mh-parts\{[^\n]*\}\n/gm,'');
  s=s.replace(/\s*const tabs = \[\.\.\.root\.querySelectorAll<HTMLAnchorElement>\('\[data-history-tab\]'\)\];/,'');
  s=s.replace(/\s*tabs\.forEach\(\(a,i\) => \{[^\n]*\}\);/,'');
  must(!s.includes('tabs.forEach('),'History script tab removal');
  // Support both current and legacy deep links, including #po-topic-N, without extra controls.
  const css=`\n  /* History dropdown is in Header; no duplicate tabs on this page. */\n  .mh-organisation{margin-top:0}\n  .mh-reading{max-width:900px}\n  .mh-prose{max-width:900px}\n  .mh-subsection p{text-align:justify;text-justify:inter-word;hyphens:auto;overflow-wrap:break-word}\n  .mh-archival-photo{max-width:1000px}\n  @media(max-width:700px){.mh-reading,.mh-prose,.mh-archival-photo{max-width:100%}.mh-subsection p{text-align:left}}\n`;
  s=replaceOnce(s,'</style>',css+'</style>','History style block');
  return s;
}
function updateOrg(s){
  must(s.includes('class="po-museum"'),'Political Organisation component structure');
  // Keep all fifteen entries in source order; show them together as a single article.
  const nav=/<nav class="po-topic-nav" aria-label="Organisation topics">[\s\S]*?<\/nav>/;
  must(nav.test(s),'political topic scroller');s=s.replace(nav,'');
  const pager=/<nav class="po-pager" aria-label="Move between organisation sections">[\s\S]*?<\/nav>/;
  must(pager.test(s),'political topic pager');s=s.replace(pager,'');
  s=s.replace('ORGANISATION &amp; LEADERSHIP <span>SECTION {String(i+1).padStart(2,\'0\')}</span>','ORGANISATION &amp; LEADERSHIP');
  s=s.replace(/^  \.po-topic-nav\{[^\n]*\}\n/gm,'');
  s=s.replace(/^  \.po-pager\{[^\n]*\}\n/gm,'');
  // Strip script toggling hidden attributes: all sections remain visible and readable without JS.
  const re=/<script>\s*const root = document\.querySelector<HTMLElement>\('\.po-museum'\);[\s\S]*?<\/script>/;
  must(re.test(s),'political section-selection script');s=s.replace(re,'');
  s=replaceOnce(s,'</style>',`\n  /* Single continuous Political Organisation article; no topic scroller. */\n  .po-reading{max-width:900px;margin:0 auto}\n  .po-article{padding:0 0 28px;margin:0 0 28px;border-bottom:1px solid var(--po-border)}\n  .po-article:last-child{border-bottom:0}\n  .po-article h3{font-size:clamp(24px,2.8vw,32px);margin:12px 0 16px}\n  .po-body p{font-size:18px;line-height:1.8;text-align:justify;text-justify:inter-word;hyphens:auto;overflow-wrap:break-word}\n  .po-meta{opacity:.8}\n  @media(max-width:650px){.po-reading{max-width:100%}.po-body p{font-size:17px;text-align:left}}\n`+'</style>','Political Organisation style block');
  return s;
}
try{
  must(fs.existsSync(file('package.json')),'Run from the PilotLWE project root (D:\\PilotLWE).');
  if(undo){restore();process.exit(0)}
  const old=Object.fromEntries(rels.map(r=>[r,read(r)]));
  if(old[rels[0]].includes('Six phases of the Naxalite movement') && !old[rels[1]].includes('class="mh-parts"') && !old[rels[2]].includes('class="po-topic-nav"')){console.log('Already installed; no changes needed.');process.exit(0)}
  const changed={
    [rels[0]]:updateHeader(old[rels[0]]),
    [rels[1]]:updateHistory(old[rels[1]]),
    [rels[2]]:updateOrg(old[rels[2]]),
  };
  // Guard against incomplete patches before touching files.
  must(changed[rels[1]].includes('data-mh-naxalbari-photo') || !old[rels[1]].includes('data-mh-naxalbari-photo'),'Naxalbari image preserved');
  must(changed[rels[2]].includes('sections.map((section,i)'),'Political text data preserved');
  must(changed[rels[1]].includes('const phases ='),'Historical phases preserved');
  rels.forEach(r=>console.log('UPDATE '+r));
  if(dry){console.log('Dry run passed. Nothing changed.');process.exit(0)}
  const folder=path.join(backupRoot,new Date().toISOString().replace(/[:.]/g,'-'));for(const r of rels){const dest=path.join(folder,r);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,old[r]);}
  const written=[];try{for(const r of rels){fs.writeFileSync(file(r),changed[r]);written.push(r)}}catch(err){for(const r of written)fs.writeFileSync(file(r),old[r]);throw err}
  fs.mkdirSync(backupRoot,{recursive:true});fs.writeFileSync(ledger,JSON.stringify({folder,files:rels},null,2));
  console.log('Installed. Backup saved to '+folder);console.log('Next: npm.cmd run build && npm.cmd run dev');
}catch(err){console.error('Installation stopped: '+err.message);process.exit(1)}
