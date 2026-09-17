import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/didou/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const j=JSON.parse(await fs.readFile('data/photo-candidates.json','utf8'));
const selected={'allee-baobabs':1,'nosy-iranja':0,'tsingy-bemaraha':1,'isalo':0,'ile-aux-nattes':0,'tsaranoro':0,'tsingy-rouges':0,'masoala':0,'ranomafana':3,'nosy-tanikely':0,'andringitra':5,'mer-emeraude':0};
const plain=s=>(s||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const photos={};await fs.mkdir('assets/photos',{recursive:true});
for(const [id,index] of Object.entries(selected)){
 const p=j[id]?.[index];if(!p||!p.extmetadata?.Artist||!p.title.match(/\.(jpg|jpeg|png)$/i)){console.log('SKIP',id);continue;}
 const license=p.extmetadata.LicenseShortName.value;if(!/^CC BY/.test(license))throw Error('Unapproved license '+license);
 const res=await fetch(p.thumburl||p.url);if(!res.ok)throw Error(id+' '+res.status);
 await sharp(Buffer.from(await res.arrayBuffer())).resize({width:1440,withoutEnlargement:true}).jpeg({quality:82,mozjpeg:true}).toFile('assets/photos/'+id+'.jpg');
 photos[id]={src:'assets/photos/'+id+'.jpg',alt:p.title.replace(/^File:/,'').replace(/\.[^.]+$/,''),title:p.title.replace(/^File:/,''),author:plain(p.extmetadata.Artist.value),license,licenseUrl:p.extmetadata.LicenseUrl.value.replace(/^http:/,'https:'),source:p.descriptionurl,changes:'Redimensionnement et compression JPEG. Recadrage à l’affichage.',checked:'2026-09-17'};
 console.log(id,photos[id].author,license);await new Promise(r=>setTimeout(r,1200));
 await fs.writeFile('data/photos.js','window.MADAGASCAR_PHOTOS = '+JSON.stringify(photos,null,2)+';\n');
}

