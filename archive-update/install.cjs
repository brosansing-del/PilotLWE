#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const root=process.cwd(),pkg=__dirname;
const dry=process.argv.includes('--dry-run'), undo=process.argv.includes('--undo');
const backupRoot=path.join(root,'.archive-update-backups');
function read(rel){return fs.readFileSync(path.join(root,rel),'utf8')}
function exists(rel){return fs.existsSync(path.join(root,rel))}
function source(rel){return fs.readFileSync(path.join(pkg,'files',rel))}
function abort(message){console.error('Stopped safely:',message);process.exitCode=1;}
const destinations=new Map();
const put=(rel,data)=>destinations.set(rel,Buffer.isBuffer(data)?data:Buffer.from(data,'utf8'));
function replaceOrThrow(text,re,rep,tag){if(!re.test(text))throw Error('Could not identify '+tag);return text.replace(re,rep)}
function editHeader(){
 let rel='src/components/Header.astro',t=read(rel);
 if(!t.includes('Seeds of Change')){
   t=t.replace(/Life After Surrender/g,'Seeds of Change');
   t=t.replace(/life-after-surrender\//g,'seeds-of-change/');
 }
 if(!t.includes('political-organisation')){
   const anchor=/(<div class="dropdown-footer"><a href=\{url\('history\/['"]?\)\}>Explore all history<\/a><\/div>)/;
   if(!anchor.test(t)) throw Error('Could not find History dropdown insertion point in Header.astro');
   t=t.replace(anchor,`<a href={url('history/#political-organisation')}><span><strong>Political Organisation and Leadership</strong><small>Committees, central authority, discipline and military structure</small></span></a>\n          $1`);
 }
 put(rel,t);
}
function editHistory(){
 let rel='src/pages/history/index.astro',t=read(rel);
 if(!t.includes("import PoliticalOrganisation from")){
   t=replaceOrThrow(t,/^---\s*\n/,"---\nimport PoliticalOrganisation from '../../components/PoliticalOrganisation.astro';\n",'History frontmatter');
 }
 if(!t.includes('<PoliticalOrganisation />')) {
   t=replaceOrThrow(t,/(\s*<\/main>)/,'\n    <PoliticalOrganisation />$1','History main end');
 }
 if(!t.includes('href="#political-organisation"')){
   t=replaceOrThrow(t,/(<a class="history-back")/,`<a class="history-political-link" href="#political-organisation">Political Organisation &amp; Leadership →</a>\n            $1`,'History table of contents');
   t=t.replace('</style>',`.history-political-link{display:block;padding:18px 4px;border-top:1px solid #d8d0c0;color:#995235;text-decoration:none;font:700 14px/1.4 Georgia,serif}.history-political-link:hover{text-decoration:underline}\n</style>`);
 }
 put(rel,t);
}
const older={
 'security-force-story-01':['Security-force personnel: A video report','A source video documenting the impact of violence on security personnel. The original recording provides the account and further incident details.'],
 'security-force-story-02':['Security personnel and conflict: Field account','A YouTube news report included in the security-force victims collection. View the original report for its named witnesses and location details.'],
 'security-force-story-03':['Surviving Violence: A Personal Account','A video account concerning a person affected by violence in the conflict. The original footage and source reporting provide the detailed testimony.'],
 'security-force-story-04':['Security-force casualties: Report from the field','A video report concerning an attack affecting security personnel. See the original upload for the reported casualties and location.'],
 'security-force-story-05':['Lives lost in a Maoist attack: News report','Coverage of the human consequences of a reported Maoist attack. The linked video should be consulted for the incident-specific details.']
};
function editVideoData(){
 const rel='src/data/archiveVideos.ts';let t=read(rel);
 for(const [slug,[title,description]] of Object.entries(older)){
  const marker=`slug: '${slug}'`;
  if(!t.includes(marker))continue;
  const start=t.indexOf(marker),end=t.indexOf('\n  },',start);
  if(end<0)throw Error('Malformed video entry for '+slug);
  let block=t.slice(start,end);
  if(!/title: (?:'[^']*'|"[^"]*")/.test(block)||!/description: (?:'[^']*'|"[^"]*")/.test(block))throw Error('Unexpected format for '+slug);
  block=block.replace(/title: (?:'[^']*'|"[^"]*")/,`title: ${JSON.stringify(title)}`)
    .replace(/description: (?:'[^']*'|"[^"]*")/,`description: ${JSON.stringify(description)}`);
  t=t.slice(0,start)+block+t.slice(end);
 }
 const additions=[
  {slug:'human-cost-of-conflict-video',kind:'victim',title:'The Human Cost of Conflict',context:'Victims’ Corner / Video report',description:'A video supplied as part of the archive’s record of people affected by Maoist violence. Consult the original recording for specific accounts and circumstances.',youtubeId:'uwZY64u-SP0',reviewed:false},
  {slug:'bastar-odisha-former-ied-expert',kind:'interview',title:'Conversation with a Former Maoist IED Specialist',context:'Opinions / Bastar–Odisha border',description:'An interview described by the contributor as a discussion with a former Maoist IED specialist active near the Bastar–Odisha border.',youtubeId:'nJTdvrmsYHA',reviewed:false},
  {slug:'state-of-democracy-conflict-zone',kind:'interview',title:'State of Democracy in a Conflict Zone',context:'Opinions / YouTube Short',description:'A short-form video about democratic life in conflict-affected regions, linked for viewers to examine the original account.',youtubeId:'u1iESYYp3VI',reviewed:false}
 ];
 for(const x of additions){
  if(t.includes(`youtubeId: '${x.youtubeId}'`)||t.includes(`youtubeId: "${x.youtubeId}"`))continue;
  let obj=Object.entries(x).map(([k,v])=>`    ${k}: ${typeof v==='string'?JSON.stringify(v):v},`).join('\n');
  const match=/export const archiveVideos: ArchiveVideo\[\] = \[/;
  if(!match.test(t))throw Error('Cannot find video catalogue declaration');
  t=t.replace(match,`export const archiveVideos: ArchiveVideo[] = [\n  {\n${obj}\n  },`);
 }
 put(rel,t);
}
function editVideoCards(){
 const rel='src/components/ArchiveVideoCollection.astro';let t=read(rel);
 t=t.replace(/\s*<span class="av-image-number"[^>]*>.*?<\/span>/s,'');
 t=t.replace(/<span class="av-status">\{video\.reviewed \? 'Editorial summary reviewed' : 'Summary awaiting review'\}<\/span>/,
  '<span class="av-status">Courtesy: original YouTube publisher</span>');
 if(t.includes('Summary awaiting review')) throw Error('Could not remove pending-review text in ArchiveVideoCollection');
 put(rel,t);
}
function build(){
 if(!exists('src/components/Header.astro')||!exists('src/pages/history/index.astro'))throw Error('Your Header or History page was not found.');
 if(!exists('src/data/archiveVideos.ts')||!exists('src/components/ArchiveVideoCollection.astro'))throw Error('Video catalogue/component missing. Install the earlier Opinions & Victims Corner package first.');
 editHeader();editHistory();editVideoData();editVideoCards();
 put('src/pages/seeds-of-change/index.astro',source('src/pages/seeds-of-change/index.astro'));
 put('src/components/PoliticalOrganisation.astro',source('src/components/PoliticalOrganisation.astro'));
 put('public/images/history/cpi-maoist-hierarchy.png',source('public/images/history/cpi-maoist-hierarchy.png'));
}
function execute(){
 if(undo){
  const manifestPath=path.join(backupRoot,'latest.json');if(!fs.existsSync(manifestPath))return abort('No latest backup manifest exists.');
  const entries=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  for(const entry of entries){let dest=path.join(root,entry.rel);
   if(entry.existed)fs.copyFileSync(path.join(backupRoot,'latest',entry.rel),dest);
   else if(fs.existsSync(dest))fs.unlinkSync(dest);
   console.log('RESTORED',entry.rel);
  }return;
 }
 try{build();}catch(e){return abort(e.message)}
 const changes=[...destinations].filter(([rel,data])=>!exists(rel)||!fs.readFileSync(path.join(root,rel)).equals(data));
 console.log('THE NAXAL ARCHIVE / SEEDS OF CHANGE + HISTORY UPDATE');
 console.log('Project:',root);console.log('Changes:',changes.length);
 for(const [rel]of changes)console.log((exists(rel)?'UPDATE ':'CREATE ')+rel);
 if(dry){console.log('Dry run complete. Nothing changed.');return}
 if(!changes.length){console.log('No changes needed.');return}
 fs.mkdirSync(backupRoot,{recursive:true});
 const manifest=changes.map(([rel])=>({rel,existed:exists(rel)}));
 // Snapshot all original contents before writing any updated file.
 for(const entry of manifest){if(entry.existed){let back=path.join(backupRoot,'latest',entry.rel);fs.mkdirSync(path.dirname(back),{recursive:true});fs.copyFileSync(path.join(root,entry.rel),back)}}
 fs.writeFileSync(path.join(backupRoot,'latest.json'),JSON.stringify(manifest,null,2));
 const written=[];
 try{
  for(const [rel,data]of changes){const dest=path.join(root,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);written.push(rel)}
  console.log('Installation complete. Run npm.cmd run build then npm.cmd run dev.');
 }catch(e){
  for(const rel of written.reverse()){
   const entry=manifest.find(v=>v.rel===rel),dest=path.join(root,rel);
   if(entry.existed)fs.copyFileSync(path.join(backupRoot,'latest',rel),dest);
   else if(fs.existsSync(dest))fs.unlinkSync(dest);
  }
  abort(e.message+'; files written before the error have been restored.');
 }
}
execute();
