import fs from 'node:fs/promises';
const j=JSON.parse(await fs.readFile('data/photo-candidates.json','utf8'));
for(const [id,q] of Object.entries({'mer-emeraude':'"Mer d’Émeraude"','ranomafana':'intitle:Ranomafana filetype:bitmap','nosy-tanikely':'intitle:Tanikely filetype:bitmap','andringitra':'intitle:Andringitra filetype:bitmap'})){
 const params=new URLSearchParams({action:'query',format:'json',generator:'search',gsrsearch:q,gsrnamespace:'6',gsrlimit:'6',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1200'});
 const res=await fetch('https://commons.wikimedia.org/w/api.php?'+params);if(!res.ok)throw Error(await res.text());
 const data=await res.json();j[id]=Object.values(data.query?.pages||{}).sort((a,b)=>a.index-b.index).map(p=>({title:p.title,...p.imageinfo?.[0]}));
 await fs.writeFile('data/photo-candidates.json',JSON.stringify(j,null,2));console.log(id,j[id].map((p,i)=>i+' '+p.title));await new Promise(r=>setTimeout(r,7000));
}
