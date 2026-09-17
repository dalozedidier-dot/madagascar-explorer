import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8');
html=html.replace('<a href="#explorer">Carte</a>','<a href="#decouvrir">Découvrir</a><a href="#explorer">Carte</a>').replace('<a href="#routes">Routes</a>','');
html=html.replace('Explorez la Grande Île<br><em>sans la réduire à une carte postale.</em>','Madagascar,<br><em>au fil de ses merveilles.</em>');
html=html.replace('Forêts humides, tsingy, hauts plateaux, baobabs, lagons et communautés locales. Un outil pour choisir une région, comprendre les distances et construire un voyage réaliste.','Des baobabs du Menabe aux lagons de Nosy Iranja, découvrez les paysages de la Grande Île. Choisissez vos étapes, explorez la carte et composez un voyage à votre rythme.');
html=html.replace('<a class="btn primary" href="#explorer">Ouvrir la carte</a>','<a class="btn primary" href="#decouvrir">Découvrir les plus beaux lieux ↗</a>');
html=html.replace('<strong>7</strong><span>grandes zones</span>','<strong>12</strong><span>coups de cœur</span>');
html=html.replace('<p class="hero-credit">Photo : Allée des Baobabs, Wikimedia Commons · CC BY-SA / GFDL</p>','<p class="hero-credit" id="heroCredit"></p>');
html=html.replace('<main>',`<main>
<section class="section discoveries" id="decouvrir"><div class="wrap">
 <div class="discovery-heading"><div class="section-head"><p class="eyebrow">Les plus beaux lieux de l’île</p><h2>Où commence votre voyage ?</h2><p>Douze coups de cœur pour découvrir la diversité des paysages malgaches. Cette sélection vous aide à choisir une région à explorer, selon vos envies et le temps dont vous disposez.</p></div><a class="text-link" href="#explorer">Explorer les 62 lieux sur la carte ↗</a></div>
 <div class="chips discovery-filters" role="group" aria-label="Filtrer les coups de cœur"><button data-discovery="all" aria-pressed="true">Toute la sélection</button><button data-discovery="iles" aria-pressed="false">Îles & lagons</button><button data-discovery="paysages" aria-pressed="false">Grands paysages</button><button data-discovery="randonnees" aria-pressed="false">Randonnées</button><button data-discovery="forets" aria-pressed="false">Forêts & nature</button></div>
 <p id="discoveryCount" class="source-note" aria-live="polite"></p><div id="discoveryGrid" class="discovery-grid"></div>
 <p class="source-note">Durées proposées sur place, hors transferts. Photographies sous licence libre, avec leurs auteurs et conditions de réutilisation dans les <a href="#photos">crédits photographiques</a>.</p>
</div></section>`);
html=html.replace('<section class="section callout">',`<section class="section" id="avenir"><div class="wrap future-grid"><article><p class="eyebrow">Prochaine étape du projet</p><h2>Développement</h2><p>Une future rubrique pour comprendre les territoires, les infrastructures, les initiatives locales et la préservation des milieux.</p><span class="mini">À venir</span></article><article><p class="eyebrow">Prochaine étape du projet</p><h2>Opportunités</h2><p>Un espace à construire autour des projets, des partenaires et des activités qui contribuent à la vie économique locale.</p><span class="mini">À venir</span></article></div></section>
<section class="section alt" id="photos"><div class="wrap"><div class="section-head"><p class="eyebrow">Les regards derrière les images</p><h2>Photographies & crédits</h2><p>Chaque photographie conserve sa licence. Retrouvez l’auteur, le fichier original et les conditions de réutilisation ci-dessous. Les images sont redimensionnées et peuvent être recadrées à l’affichage.</p></div><div id="photoCredits" class="photo-credits"></div></div></section>
<section class="section callout">`);
html=html.replace('<a href="CREDITS.md">Sources & crédits</a>','<a href="#photos">Photos & auteurs</a><a href="CREDITS.md">Sources</a><a href="#avenir">Développement & opportunités</a>');
html=html.replace('<article class="sheet-card">','<article class="sheet-card" role="dialog" aria-modal="true" aria-label="Détail du lieu" tabindex="-1">');
html=html.replace('<script src="assets/app.js"></script>','<script src="data/discoveries.js"></script><script src="data/photos.js"></script><script src="assets/app.js"></script>');
fs.writeFileSync('index.html',html);
let app=fs.readFileSync('assets/app.js','utf8');
app=app.replace("const S={", "const discoveries=window.MADAGASCAR_DISCOVERIES||[], photos=window.MADAGASCAR_PHOTOS||{};\nconst S={");
app=app.replace("function openSheet(id){", "let previousFocus;\nfunction openSheet(id){previousFocus=document.activeElement;");
app=app.replace("$('#sheetContent').innerHTML=`<p", "$('#sheetContent').innerHTML=`${photoFigure(p.id)}<p");
app=app.replace('<div class="detail-grid">','${discoveryDetails(p.id)}<div class="detail-grid">');
app=app.replace("$('#sheet').hidden=false;", "$('#sheet').hidden=false;$('.sheet-card').focus();");
app=app.replace("function closeSheet(){$('#sheet').hidden=true;document.body.style.overflow=''}", "function closeSheet(){if($('#sheet').hidden)return;$('#sheet').hidden=true;document.body.style.overflow='';previousFocus?.focus()}");
app=app.replace("S.active=p.id;map.flyTo", "S.active=p.id;openSheet(p.id);map.flyTo");
app=app.replace('<article class="place-card${', '<article tabindex="0" role="button" aria-label="Voir ${esc(p.name)}" class="place-card${');
app=app.replace("$$('[data-add]').forEach", "$$('.place-card').forEach(c=>c.addEventListener('keydown',e=>{if(e.target===c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();c.click()}}));$$('[data-add]').forEach");
app=app.replace("buildControls();renderRoutes();", "renderDiscoveries();renderPhotoCredits();buildControls();renderRoutes();");
app=app.replace("if(e.key.toLowerCase()==='m')", "if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key.toLowerCase()==='m')");
app=app.replace("localStorage.setItem('madagascar-theme',n);", "try{localStorage.setItem('madagascar-theme',n)}catch(e){}");
const code=`
function photoCredit(id){const p=photos[id];return p ? '<a href="'+esc(p.source)+'" target="_blank" rel="noopener">'+esc(p.author)+'</a> · <a href="'+esc(p.licenseUrl)+'" target="_blank" rel="noopener">'+esc(p.license)+'</a>' : '';}
function photoFigure(id){const p=photos[id];return p ? '<figure class="destination-photo"><img src="'+esc(p.src)+'" alt="'+esc(p.alt)+'" width="1200" height="800" loading="lazy"><figcaption>'+photoCredit(id)+'</figcaption></figure>' : '';}
function discoveryDetails(id){const d=discoveries.find(d=>d.id===id);return d ? '<div class="discovery-details"><h3>Prendre le temps de découvrir</h3><p>'+esc(d.text)+'</p><dl><div><dt>À savourer</dt><dd>'+esc(d.moment)+'</dd></div><div><dt>Temps proposé sur place</dt><dd>'+esc(d.stay)+'</dd></div></dl><p>'+esc(d.care)+'</p>'+(d.source?'<a href="'+esc(d.source)+'" target="_blank" rel="noopener">En savoir plus auprès de l’office du tourisme ↗</a>':'')+'</div>' : '';}
function renderDiscoveries(group='all'){
 const items=discoveries.filter(d=>group==='all'||d.group===group);
 $('#discoveryCount').textContent=items.length+' lieux à découvrir';
 $('#discoveryGrid').innerHTML=items.map(d=>{const p=byId.get(d.id);return '<article class="discovery-card">'+photoFigure(d.id)+'<div class="discovery-body"><p class="eyebrow">'+esc(p.region)+'</p><h3><button data-discover-open="'+d.id+'">'+esc(p.name)+'</button></h3><p class="discovery-title">'+esc(d.title)+'</p><p>'+esc(d.text)+'</p><div class="tagline"><span class="mini">'+esc(d.stay)+'</span><span class="mini">'+esc(EFFORT[p.effort])+'</span></div><div class="discovery-actions"><button data-discover-open="'+d.id+'">Découvrir le lieu ↗</button><button data-discover-save="'+d.id+'" aria-label="Ajouter '+esc(p.name)+' à mon voyage">♡</button></div></div></article>'}).join('');
 $$('[data-discover-open]').forEach(b=>b.onclick=()=>openSheet(b.dataset.discoverOpen));
 $$('[data-discover-save]').forEach(b=>b.onclick=()=>addTrip(b.dataset.discoverSave));
}
function renderPhotoCredits(){
 $('#photoCredits').innerHTML=Object.entries(photos).map(([id,p])=>'<div><strong>'+esc(byId.get(id)?.name||p.alt)+'</strong><p>'+photoCredit(id)+'</p><small>'+esc(p.title)+' · Wikimedia Commons</small></div>').join('');
 $('#heroCredit').innerHTML='Allée des Baobabs · '+photoCredit('allee-baobabs');
}
$$('[data-discovery]').forEach(b=>b.onclick=()=>{$$('[data-discovery]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderDiscoveries(b.dataset.discovery)});
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||$('#sheet').hidden)return;const items=[...$('.sheet-card').querySelectorAll('button,a[href],select,input,[tabindex="0"]')];const first=items[0],last=items.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('.sheet-card'))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}});
`;
app=app.replace('renderDiscoveries();renderPhotoCredits();buildControls();',code+'\nrenderDiscoveries();renderPhotoCredits();buildControls();');
fs.writeFileSync('assets/app.js',app);
