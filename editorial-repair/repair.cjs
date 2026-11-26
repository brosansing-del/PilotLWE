/** Local repair: preserves existing layouts/content and makes backups outside the repo. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.cwd();
const here = __dirname;
const dryRun = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const journal = path.join(path.dirname(root),path.basename(root)+'-editorial-repair-backups');
const fail = message => { console.error('\nERROR: '+message);process.exit(1); };
if (!fs.existsSync(path.join(root,'package.json')) || !fs.existsSync(path.join(root,'src/pages/index.astro'))) {
  fail('Run in the Astro site root, e.g. D:\\thenaxalarchive.');
}
if (undo) {
  const entries = fs.existsSync(journal) ? fs.readdirSync(journal).sort().reverse() : [];
  const latest = entries.map(e=>path.join(journal,e)).find(p=>fs.existsSync(path.join(p,'manifest.json')));
  if (!latest) fail('No previous repair backup found.');
  const manifest = JSON.parse(fs.readFileSync(path.join(latest,'manifest.json'),'utf8'));
  if (manifest.project !== root) fail('Latest repair backup is for a different project.');
  for (const item of manifest.files) {
    const dest = path.join(root,item.path);
    if (item.existed) {
      fs.mkdirSync(path.dirname(dest),{recursive:true});
      fs.copyFileSync(path.join(latest,'original',item.path),dest);
    } else if (fs.existsSync(dest)) fs.unlinkSync(dest);
    console.log('RESTORED',item.path);
  }
  console.log('Repair rolled back locally.');
  process.exit(0);
}
const routeDir=path.join(root,'src/pages/articles');
const routes = fs.existsSync(routeDir) ? fs.readdirSync(routeDir).filter(n => /^\[(?:\.\.\.)?[^\]]+\]\.astro$/.test(n)) : [];
if (routes.length !== 1) fail('Expected one dynamic article route, found: '+(routes.join(', ') || 'none'));
const article = 'src/pages/articles/'+routes[0];
const showcase = 'src/components/ArticleShowcase.astro';
const listing = 'src/pages/articles/index.astro';
const existing = [article,showcase,listing];
for (const rel of existing) if(!fs.existsSync(path.join(root,rel))) fail('File missing: '+rel+'; use the editorial redesign installer first.');
const resolve = rel => path.join(root,rel);
const original = Object.fromEntries(existing.map(rel=>[rel,fs.readFileSync(resolve(rel),'utf8')]));
const cleanAsset = `const asset = (s: string) => {
  if (/^(https?:)?\\/\\//.test(s) || s.startsWith('data:')) return s;
  const clean = s.replace(/^\\/+/, '');
  const prefix = base.replace(/^\\/+/, '');
  return '/' + (prefix && !clean.startsWith(prefix + '/') ? prefix + '/' : '') + clean;
};`;
const imageMap = `const naArticleCover = (id: string) => {
  if (id === 'whose-liberation-after-all') return '/images/articles/whose-liberation.webp';
  if (id === 'who-stole-their-childhoods') return '/images/articles/children-of-maoists.webp';
  return '';
};`;
const edits=[];
for (const rel of existing) {
  let src=original[rel];
  const imageUpdated=src.includes('const naArticleCover = (id: string)');
  if (!src.includes('const asset = (s: string) =>') && !imageUpdated) {
    fail('Unexpected article template in '+rel+'. Refusing to alter.');
  }
  if (!imageUpdated) {
    // Match the older asset helper in all three generated templates.
    const oldAsset = `const asset = (s: string) => /^(https?:)?\\/\\//.test(s) || s.startsWith('data:') ? s : url(s);`;
    if(!src.includes(oldAsset)) fail('Cannot locate image URL helper in '+rel+'. No files changed.');
    src=src.replace(oldAsset,cleanAsset+'\n'+imageMap);
    if(rel === article) {
      const a=`const coverValue = d.cover || d.image || d.heroImage || '';`;
      const b=`const v = x.cover || x.image || '';`;
      if(!src.includes(a)||!src.includes(b)) fail('Cannot safely find both cover image expressions in '+rel);
      src=src.replace(a,`const coverValue = naArticleCover(entry.id) || d.image || d.cover || d.heroImage || '';`)
             .replace(b,`const v = naArticleCover(item.id) || x.image || x.cover || '';`);
    } else if (rel === showcase) {
      const a=`const image = d.cover || d.image || d.heroImage || '';`;
      if(!src.includes(a)) fail('Cannot locate homepage cover expression.');
      src=src.replace(a,`const image = naArticleCover(item.id) || d.image || d.cover || d.heroImage || '';`);
    } else {
      const a=`const image = meta(item).cover || meta(item).image || '';`;
      if(!src.includes(a)) fail('Cannot locate Articles listing cover expression.');
      src=src.replace(a,`const image = naArticleCover(item.id) || meta(item).image || meta(item).cover || '';`);
    }
  }
  if (rel === article) {
    const bad=`{String((item.data as Record<string, any>).section || 'Articles').toUpperCase()}`;
    const good=`{String(item.data.section || 'Articles').toUpperCase()}`;
    src=src.replace(bad,good);
    if(src.includes('String((item.data as Record<string, any>).section')) fail('Unsafe inline template cast remains; no files changed.');
  }
  edits.push({rel,bytes:Buffer.from(src)});
}
for(const name of ['children-of-maoists.webp','whose-liberation.webp']) {
  const rel='public/images/articles/'+name;
  const media=path.join(here,'media',name);
  if(!fs.existsSync(media)) fail('Repair package missing '+name);
  edits.push({rel,bytes:fs.readFileSync(media)});
}
const changes=edits.filter(({rel,bytes})=>!fs.existsSync(resolve(rel)) || !fs.readFileSync(resolve(rel)).equals(bytes));
console.log('\nTHE NAXAL ARCHIVE - ARTICLE FIX');
console.log('Project: '+root);
console.log('Route: '+article);
console.log('Changes: '+changes.length);
for(const {rel} of changes) console.log('  '+(fs.existsSync(resolve(rel))?'UPDATE ':'ADD    ')+rel);
if(dryRun){console.log('Dry run complete. Nothing was changed.');process.exit(0);}
if(!changes.length){console.log('Already repaired. Nothing changed.');process.exit(0);}
const when=new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(2).toString('hex');
const backup=path.join(journal,when);
const manifest={project:root,files:changes.map(({rel})=>({path:rel,existed:fs.existsSync(resolve(rel))}))};
try {
  for(const {rel} of changes) if(fs.existsSync(resolve(rel))) {
    const dest=path.join(backup,'original',rel);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    fs.copyFileSync(resolve(rel),dest);
  }
  fs.mkdirSync(backup,{recursive:true});
  fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2));
  for(const {rel,bytes} of changes) {
    fs.mkdirSync(path.dirname(resolve(rel)),{recursive:true});
    fs.writeFileSync(resolve(rel),bytes);
  }
  console.log('REPAIR COMPLETE. Backup: '+backup);
  console.log('Run: npm.cmd run build');
} catch(e) {
  console.error('REPAIR FAILED:',e.message);
  for(const item of manifest.files){
    const dest=resolve(item.path);const saved=path.join(backup,'original',item.path);
    try {if(item.existed && fs.existsSync(saved)) fs.copyFileSync(saved,dest); else if(!item.existed && fs.existsSync(dest)) fs.unlinkSync(dest);} catch(_){}
  }
  process.exit(1);
}
