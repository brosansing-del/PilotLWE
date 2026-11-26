'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=process.cwd();
const header=path.join(root,'src/components/Header.astro');
const page=path.join(root,'src/pages/history/index.astro');
const source=path.join(__dirname,'history-page.astro');
const dry=process.argv.includes('--dry-run');
function fail(s){console.error('Nothing changed. '+s);process.exit(1)}
if(!fs.existsSync(header)||!fs.existsSync(source)) fail('Missing Header.astro or history-page.astro. Run from the website root.');
const old=fs.readFileSync(header,'utf8');
let next=old;
const historyMenu=`<!-- HISTORY DROPDOWN -->
      <div class="nav-dropdown">
        <a class="nav-dropdown-trigger" href={url('history/')}>History</a>
        <div class="dropdown-menu background-menu">
          <div class="dropdown-label">HISTORY</div>
          <a href={url('history/#naxalbari')}><span><strong>Naxalbari</strong><small>The uprising of 1967 and its agrarian origins</small></span></a>
          <a href={url('history/#formation-of-cpi-ml')}><span><strong>Formation of CPI (ML) and Early Fragmentation</strong><small>From the AICCCR to the divisions of 1972</small></span></a>
          <div class="dropdown-footer"><a href={url('history/')}>Explore all history</a></div>
        </div>
      </div>

      `;
const start=next.search(/<!--\s*(?:BACKGROUND|HISTORY) DROPDOWN\s*-->/i);
const end=next.search(/<!--\s*DATA\s*&\s*VISUALS DROPDOWN\s*-->/i);
if(start>=0&&end>start){next=next.slice(0,start)+historyMenu+next.slice(end)}
else fail('Could not safely find the Background dropdown. Header.astro is needed for a targeted fix.');
// A prior installer only replaced a specific HTML anchor. Cover other link shapes,
// including the mobile menu and absolute URL strings, without touching article data.
const oldRoute=/lwe-fatalities-since-1980/gi;
next=next.replace(oldRoute,'major-incidents');
next=next.replace(/Fatalities\s+in\s+LWE\s+Incidents\s+Since\s+1980/gi,'Major Incidents (2000–2026)');
next=next.replace(/Year-wise civilian,? security-force and extremist deaths/gi,'Year-wise incidents, casualties and initiating actors');
// If the old route was not present but an obsolete wording survives, stop for review.
if(/lwe-fatalities-since-1980|Fatalities\s+in\s+LWE\s+Incidents\s+Since\s+1980/i.test(next)) fail('Unreplaced old link remains. Share Header.astro.');
// Insert the new dashboard link in the Data dropdown if no link exists.
if(!next.includes('major-incidents')) {
 const marker='<div class="dropdown-footer">';
 const ds=next.search(/<!--\s*DATA\s*&\s*VISUALS DROPDOWN\s*-->/i);
 const pos=next.indexOf(marker,ds);
 if(pos<0) fail('Could not locate Data & Visuals dropdown footer.');
 const item=`<a href={url('data-visuals/major-incidents/')}><span><strong>Major Incidents (2000–2026)</strong><small>Year-wise incidents, casualties and initiating actors</small></span></a>\n          `;
 next=next.slice(0,pos)+item+next.slice(pos);
}
if(!next.includes("url('history/')")) fail('History navigation not found after patch.');
if(fs.existsSync(page) && !fs.readFileSync(page,'utf8').includes('HISTORICAL RECORD')) fail('A separate custom History page exists. Not overwriting.');
console.log('History and navigation update');
console.log('UPDATE src/components/Header.astro');
console.log('CREATE/UPDATE src/pages/history/index.astro');
if(dry){console.log('Dry run complete. No files changed.');process.exit(0)}
const backup=path.join(root,'.history-update-backups',new Date().toISOString().replace(/[:.]/g,'-'));
fs.mkdirSync(backup,{recursive:true});
fs.copyFileSync(header,path.join(backup,'Header.astro'));
if(fs.existsSync(page)) fs.copyFileSync(page,path.join(backup,'history-index.astro'));
fs.mkdirSync(path.dirname(page),{recursive:true});
try {fs.writeFileSync(header,next,'utf8');fs.copyFileSync(source,page)}
catch(e){fs.copyFileSync(path.join(backup,'Header.astro'),header);console.error('Header restored after error:',e.message);process.exit(1)}
console.log('Installed. Backup:',backup);
console.log('Run: npm.cmd run build');
