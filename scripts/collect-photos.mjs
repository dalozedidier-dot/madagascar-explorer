import fs from 'node:fs/promises';
const subjects = {'allee-baobabs':'Baobab Avenue','nosy-iranja':'Nosy Iranja','tsingy-bemaraha':'Tsingy Bemaraha','isalo':'Isalo landscape','ile-aux-nattes':'Ile aux Nattes','tsaranoro':'Tsaranoro valley','mer-emeraude':'Emerald sea Madagascar','tsingy-rouges':'Tsingy Rouge','ranomafana':'Ranomafana landscape','masoala':'Masoala beach','nosy-tanikely':'Nosy Tanikely','andringitra':'Andringitra landscape'};
const results = {};
for (const [id, query] of Object.entries(subjects)) {
 const params = new URLSearchParams({action:'query',format:'json',generator:'search',gsrsearch:query,gsrnamespace:'6',gsrlimit:'5',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1200'});
 const data = await fetch('https://commons.wikimedia.org/w/api.php?'+params).then(r=>r.json());
 results[id]=Object.values(data.query?.pages||{}).sort((a,b)=>a.index-b.index).map(p=>({title:p.title,...p.imageinfo?.[0]}));
 await fs.writeFile('data/photo-candidates.json',JSON.stringify(results,null,2)); await new Promise(r=>setTimeout(r,1800)); console.log(id, results[id].map(p=>({title:p.title,license:p.extmetadata?.LicenseShortName?.value,artist:p.extmetadata?.Artist?.value,description:p.extmetadata?.ImageDescription?.value}))); 
}
await fs.writeFile('data/photo-candidates.json',JSON.stringify(results,null,2));

