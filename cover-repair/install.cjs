'use strict';
// The Naxal Archive - unobtrusive fallback for broken cover images.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.cwd();
const here = __dirname;
const isDry = process.argv.includes('--dry-run');
const undo = process.argv.includes('--undo');
const backupRoot = path.join(path.dirname(root), path.basename(root)+'-cover-fix-backups');
const rels = ['src/components/ArticleShowcase.astro', 'src/pages/articles/index.astro'];
const routeDir = path.join(root,'src/pages/articles');
const error = msg => { console.error('ERROR: '+msg); process.exit(1); };
if (!fs.existsSync(path.join(root,'package.json')) || !fs.existsSync(path.join(root,'src/pages/index.astro'))) error('Run this command inside your Astro site root (D:\\thenaxalarchive).');
if (undo) {
  const dirs = fs.existsSync(backupRoot) ? fs.readdirSync(backupRoot).sort().reverse() : [];
  const latest = dirs.map(d=>path.join(backupRoot,d)).find(d=>fs.existsSync(path.join(d,'manifest.json')));
  if (!latest) error('No earlier cover-fix backup found.');
  const manifest = JSON.parse(fs.readFileSync(path.join(latest,'manifest.json'),'utf8'));
  if (manifest.project !== root) error('Backup belongs to another project.');
  for (const rel of manifest.files) {
    const orig = path.join(latest,'original',rel);
    const dest = path.join(root,rel);
    if (!fs.existsSync(orig)) error('Backup missing '+rel);
    fs.copyFileSync(orig,dest);
    console.log('RESTORED',rel);
  }
  console.log('Rollback complete.');
  process.exit(0);
}
if (!fs.existsSync(routeDir)) error('Missing src/pages/articles.');
const routes = fs.readdirSync(routeDir).filter(f=>/^\[(?:\.\.\.)?[^\]]+\]\.astro$/.test(f));
if (routes.length !== 1) error('Expected one article route. Found: '+(routes.join(', ') || 'none'));
rels.push('src/pages/articles/'+routes[0]);
const START = '/* NA_BROKEN_COVER_FALLBACK_V1 */';
const END = '/* END_NA_BROKEN_COVER_FALLBACK_V1 */';
const css = `
<style is:global>
${START}
.na-cover-art-fallback{position:absolute;inset:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:18px;padding:clamp(25px,5vw,60px);background:radial-gradient(circle at 75% 20%,#496e5c,#18382f 65%,#102b25);color:#f6f0e4;box-sizing:border-box;overflow:hidden;text-align:left;}
.na-cover-art-fallback::before{content:'✳';position:absolute;right:-26px;top:-45px;font:normal 280px/1 Georgia,serif;color:#ffffff0d;pointer-events:none;}
.na-cover-art-fallback .na-fallback-eyebrow{position:relative;font:700 11px/1.5 system-ui,sans-serif;letter-spacing:.19em;color:#e8ba8f;}
.na-cover-art-fallback .na-fallback-title{position:relative;max-width:95%;font:normal clamp(25px,3.6vw,49px)/1.13 Georgia,serif;letter-spacing:-.025em;overflow-wrap:anywhere;}
.na-stage-media .na-cover-art-fallback,.na-spotlight-image .na-cover-art-fallback,.na-tile-image .na-cover-art-fallback,.na-related-img .na-cover-art-fallback{position:absolute;inset:0;}
.na-tile-image .na-cover-art-fallback,.na-related-img .na-cover-art-fallback{gap:11px;padding:24px;}
.na-tile-image .na-fallback-title,.na-related-img .na-fallback-title{font-size:clamp(21px,2.1vw,28px);}
.na-cover .na-cover-art-fallback{position:relative;inset:auto;min-height:330px;aspect-ratio:16/8;justify-content:center;}
@media(max-width:600px){.na-cover-art-fallback{padding:26px;gap:12px;}.na-cover-art-fallback .na-fallback-title{font-size:clamp(24px,6vw,37px);}.na-cover .na-cover-art-fallback{min-height:220px;}}
${END}
</style>
`;
const script = `
<script>
  // NA_BROKEN_COVER_FALLBACK_V1: If a source image is missing, show an editorial card.
  const coverSelectors = '.na-stage-media > img, .na-spotlight-image > img, .na-tile-image > img, .na-cover > img, .na-related-img > img';
  document.querySelectorAll<HTMLImageElement>(coverSelectors).forEach(img => {
    const onBroken = () => {
      if (!img.isConnected) return;
      const holder = img.parentElement;
      if (!holder || holder.querySelector('.na-cover-art-fallback')) return;
      const art = document.createElement('span');
      art.className = 'na-cover-art-fallback';
      art.setAttribute('aria-label', 'Article cover placeholder');
      const eyebrow = document.createElement('span');
      eyebrow.className = 'na-fallback-eyebrow';
      eyebrow.textContent = 'THE NAXAL ARCHIVE / EDITORIAL';
      const title = document.createElement('strong');
      title.className = 'na-fallback-title';
      title.textContent = img.alt.replace(/^Cover (?:illustration|image|for) (?:for )?/i, '').trim() || 'Stories worth understanding.';
      art.append(eyebrow,title);
      img.replaceWith(art);
    };
    img.addEventListener('error', onBroken, { once: true });
    if (img.complete && img.naturalWidth === 0) onBroken();
  });
</script>
`;
const updates=[];
for (const rel of rels) {
  const file=path.join(root,rel);
  if(!fs.existsSync(file)) error('Could not find '+rel);
  const src=fs.readFileSync(file,'utf8');
  if(!src.includes('class="na-stage-media"') && rel.includes('ArticleShowcase.astro')) error('Unrecognized carousel template. Not changing anything.');
  if(rel.includes('articles/index.astro') && !src.includes('na-spotlight-image')) error('Unrecognized article listing template.');
  if(rel.includes('/articles/[') && !src.includes('class="na-cover"')) error('Unrecognized article reader template.');
  if(src.includes(START)) continue;
  updates.push({rel,bytes: Buffer.from(src+'\n'+css+'\n'+script,'utf8')});
}
console.log('\nTHE NAXAL ARCHIVE - IMAGE DISPLAY FIX');
console.log('Project:',root);
console.log('Files to update:',updates.length);
updates.forEach(({rel})=>console.log('  '+rel));
if(isDry){console.log('Dry run complete. No changes made.');process.exit(0);}
if(!updates.length){console.log('Already installed. No changes needed.');process.exit(0);}
const stamp = new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(3).toString('hex');
const backup=path.join(backupRoot,stamp);
try {
  for (const {rel} of updates) {
    const save=path.join(backup,'original',rel);
    fs.mkdirSync(path.dirname(save),{recursive:true});
    fs.copyFileSync(path.join(root,rel),save);
  }
  fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify({project:root,files:updates.map(x=>x.rel)},null,2));
  for(const {rel,bytes} of updates) fs.writeFileSync(path.join(root,rel),bytes);
  console.log('Installed. Original templates backed up in:',backup);
} catch(err) {
  console.error('Install failed:',err.message);
  for(const {rel} of updates){
    const save=path.join(backup,'original',rel);
    if(fs.existsSync(save)){try{fs.copyFileSync(save,path.join(root,rel));}catch(_){}}
  }
  process.exit(1);
}
