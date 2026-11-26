'use strict';
// Read-only check of Markdown cover references and local public files.
const fs=require('node:fs');const path=require('node:path');
const root=process.cwd();
const content=path.join(root,'src/content/articles');const pub=path.join(root,'public');
if(!fs.existsSync(content)){console.error('Please run from D:\\thenaxalarchive.');process.exit(1);}
const files = fs.readdirSync(content).filter(f=>/\.mdx?$/i.test(f) && !f.startsWith('~'));
const found=[];
const walk=(dir, rel='')=>{
  if(!fs.existsSync(dir)) return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.isSymbolicLink()) continue;
    if(entry.isDirectory()) walk(path.join(dir,entry.name), path.join(rel,entry.name));
    else if(entry.isFile()) found.push(path.join(rel,entry.name).replace(/\\/g,'/'));
  }
};
walk(pub);
const cfg=path.join(root,'astro.config.mjs');
const cfgSource=fs.existsSync(cfg)?fs.readFileSync(cfg,'utf8'):'';
const baseMatch=cfgSource.match(/\bbase\s*:\s*['"`]([^'"`]+)['"`]/);
const base=baseMatch?baseMatch[1].replace(/^\/+|\/+$/g,''):'';
console.log('THE NAXAL ARCHIVE - IMAGE AUDIT (READ ONLY)');
console.log('Astro base:',base||'/');console.log('Article files:',files.length,'Public files:',found.length,'\n');
let ok=0,missing=0,remote=0,none=0;
for(const file of files){
  const text=fs.readFileSync(path.join(content,file),'utf8');
  const front=text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if(!front){console.log('NO FRONTMATTER',file);continue;}
  const get=(key)=>{const m=front[1].match(new RegExp('^'+key+'\\s*:\\s*(.+?)\\s*$','m'));return m?m[1].trim().replace(/^['"]|['"]$/g,''):'';};
  const ref=get('image')||get('cover')||get('heroImage');
  if(!ref){none++;console.log('NO COVER ',file);continue;}
  if(/^(https?:)?\/\//.test(ref)||ref.startsWith('data:')){remote++;console.log('EXTERNAL ',file,'->',ref);continue;}
  let cleaned=ref.split(/[?#]/)[0].replace(/\\/g,'/').replace(/^\/+/, '');
  if(base && cleaned.startsWith(base+'/')) cleaned=cleaned.slice(base.length+1);
  cleaned=cleaned.replace(/^public\//,'');
  if(fs.existsSync(path.join(pub,cleaned))){ok++;console.log('OK       ',file,'->',cleaned);continue;}
  missing++;
  const name=path.posix.basename(cleaned);
  const suggestions=found.filter(p=>path.posix.basename(p).toLowerCase()===name.toLowerCase());
  console.log('MISSING  ',file,'->',ref);
  console.log('          Expected at: public/'+cleaned);
  if(suggestions.length) console.log('          Existing file(s): '+suggestions.map(p=>'public/'+p).join(', '));
}
console.log('\nSummary: '+ok+' local OK, '+missing+' local missing, '+remote+' external (not verified), '+none+' no cover.');
console.log('Missing images need an actual source file or a corrected path. No files were changed.');
