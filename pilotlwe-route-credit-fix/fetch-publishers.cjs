#!/usr/bin/env node
'use strict';
// Optional: obtains the publisher's own author_name from YouTube's public oEmbed metadata.
// Does not guess or assign channel names when metadata is inaccessible.
const fs=require('fs'),path=require('path');
const rel='src/data/archiveVideos.ts';const file=path.join(process.cwd(),rel);
if(!fs.existsSync(file)){console.error('Run from PilotLWE project root. Missing '+rel);process.exit(1);}
if(typeof fetch!=='function'){console.error('Requires Node 18 or newer.');process.exit(1);}
(async()=>{
 let src=fs.readFileSync(file,'utf8');let added=0,skipped=0;
 const re=/\{[^{}]*youtubeId:\s*['"]([^'"]+)['"][^{}]*\}/g;
 const matches=[...src.matchAll(re)];
 for(const match of matches){const block=match[0],id=match[1];if(/\bpublisher:\s*['"]/.test(block))continue;
  try{
   const endpoint='https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+id);
   const response=await fetch(endpoint,{signal:AbortSignal.timeout(9000)});
   if(!response.ok)throw Error('HTTP '+response.status);
   const json=await response.json();const publisher=String(json.author_name||'').trim();
   if(!publisher)throw Error('publisher not provided');
   const marker=block.match(/youtubeId:\s*['"][^'"]+['"],?/);
   if(!marker)throw Error('unrecognised entry');
   let modified=block.replace(marker[0],marker[0]+'\n    publisher: '+JSON.stringify(publisher)+',');
   // For generic legacy cards, show the verified original video title too.
   if(/title:\s*['"]Security-force Story \d+['"]/.test(modified) && json.title){
     const videoTitle=String(json.title).trim();
     modified=modified.replace(/title:\s*['"]Security-force Story \d+['"]/, 'title: '+JSON.stringify(videoTitle));
     modified=modified.replace(/description:\s*(?:'[^']*'|"[^"]*")/, 'description: '+JSON.stringify('Source video: '+videoTitle+'. Watch the original report for the full account and context.'));
   }
   if(src.includes(block)){src=src.replace(block,modified);added++;console.log('CREDIT',id,'=>',publisher);}else skipped++;
  }catch(err){skipped++;console.log('NOT VERIFIED',id,'('+err.message+')');}
 }
 if(added){const dest=path.join(process.cwd(),'.archive-videos-before-credits.ts');fs.writeFileSync(dest,fs.readFileSync(file));fs.writeFileSync(file,src);console.log('Saved '+added+' verified publisher credits. Backup: '+dest);}
 else console.log('No credits added. Check network and original YouTube channel pages manually.');
 console.log('Unresolved entries:',skipped);
})().catch(e=>{console.error(e);process.exitCode=1;});
