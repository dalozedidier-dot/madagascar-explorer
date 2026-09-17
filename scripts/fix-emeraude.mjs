import fs from 'node:fs/promises';
const params=new URLSearchParams({action:'query',format:'json',titles:"File:Mer d'emeraude, Madagascar (25803285040).jpg",prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1200'});
const d=await fetch('https://commons.wikimedia.org/w/api.php?'+params).then(r=>r.json());
const p=Object.values(d.query.pages)[0];const j=JSON.parse(await fs.readFile('data/photo-candidates.json','utf8'));j['mer-emeraude']=[{title:p.title,...p.imageinfo[0]}];await fs.writeFile('data/photo-candidates.json',JSON.stringify(j,null,2));
