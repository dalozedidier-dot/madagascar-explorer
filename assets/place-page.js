(()=>{'use strict';
const P=window.MADAGASCAR_PLACES||[], MONTHS=window.MADAGASCAR_MONTHS||[], discoveries=window.MADAGASCAR_DISCOVERIES||[], photos=window.MADAGASCAR_PHOTOS||{};
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS={parc:'Parc & réserve',faune:'Faune',plage:'Île & plage',culture:'Culture & patrimoine',ville:'Ville',paysage:'Grand paysage',aventure:'Aventure',nature:'Nature'};
const FLAGS={lemuriens:'Lémuriens',oiseaux:'Oiseaux',rando:'Randonnée',marche:'Marche',plage:'Plage',snorkeling:'Snorkeling',plongee:'Plongée',bateau:'Bateau',baleines:'Baleines',culture:'Culture',artisanat:'Artisanat',photo:'Photographie',famille:'Famille',guide:'Guide conseillé',communautaire:'Tourisme communautaire','4x4':'4x4',camping:'Trek / camping',unesco:'Patrimoine UNESCO',fossa:'Fossa',nocturne:'Sortie nocturne',velo:'Vélo',coucher:'Coucher de soleil',aventure:'Aventure',escalade:'Escalade',botanique:'Botanique',cascades:'Cascades',grottes:'Grottes',kitesurf:'Kitesurf',herpetologie:'Herpétologie',surf:'Surf'};
const EFFORT={facile:'Facile',modere:'Modéré',exigeant:'Exigeant'};
const byId=new Map(P.map(p=>[p.id,p]));
const id=new URLSearchParams(location.search).get('id');
const p=byId.get(id);
const d=discoveries.find(x=>x.id===id);
const photo=photos[id];
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
function km(a,b){const R=6371,r=Math.PI/180,dLat=(b[0]-a[0])*r,dLon=(b[1]-a[1])*r,h=Math.sin(dLat/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function fmtDistance(n){return n<10?n.toFixed(1)+' km':Math.round(n)+' km'}
function monthName(m){return MONTHS.find(x=>x.m===m)?.name||['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'][m-1]}
function monthStrip(){const set=new Set(p.months||[]);return `<div class="month-strip">${[1,2,3,4,5,6,7,8,9,10,11,12].map(m=>`<span class="${set.has(m)?'on':''}" title="${esc(monthName(m))}">${esc(monthName(m).slice(0,3))}</span>`).join('')}</div>`}
function photoCredit(){if(!photo)return '';return `<a href="${esc(photo.source)}" rel="noopener" target="_blank">${esc(photo.author||'Wikimedia Commons')}</a> · <a href="${esc(photo.licenseUrl||photo.source)}" rel="noopener" target="_blank">${esc(photo.license||'Licence')}</a>`}
function heroMedia(){if(photo)return `<img src="${esc(photo.src)}" alt="${esc(photo.alt||p.name)}" fetchpriority="high" referrerpolicy="no-referrer">`;return `<div class="place-hero-fallback"><span>${p.icon}</span><small>Photographie en cours de sélection</small></div>`}
function nearby(){return P.filter(x=>x.id!==p.id).map(x=>({p:x,d:km([p.lat,p.lng],[x.lat,x.lng]),same:x.region===p.region})).sort((a,b)=>(b.same-a.same)||a.d-b.d).slice(0,4)}
function nearbyCards(){return nearby().map(({p:n,d:dist})=>{const ph=photos[n.id];return `<a class="related-card" href="lieu.html?id=${encodeURIComponent(n.id)}">${ph?`<img src="${esc(ph.src)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:`<div class="related-fallback">${n.icon}</div>`}<div><small>${esc(n.region)} · ${fmtDistance(dist)} à vol d’oiseau</small><strong>${esc(n.name)}</strong><span>${esc(n.desc)}</span></div></a>`}).join('')}
function experienceCards(){const f=(p.f||[]).slice(0,8);const tags=(p.tags||[]).slice(0,6);const items=[...f.map(x=>FLAGS[x]||x),...tags].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,8);return items.map((v,i)=>`<div class="experience-card"><span>${['✦','◌','◇','⌁','◎','△','◐','•'][i%8]}</span><strong>${esc(v)}</strong></div>`).join('')}
function planningText(){if(p.effort==='exigeant')return 'Cette étape demande davantage de préparation. Vérifiez les conditions d’accès, la météo et l’organisation locale avant le départ.';if(p.effort==='modere')return 'Prévoyez une marge confortable pour l’accès et le temps passé sur place, surtout si vous combinez plusieurs étapes.';return 'L’accès est classé facile dans cette sélection, mais les conditions locales et les temps de trajet doivent toujours être vérifiés.'}
function saveState(){try{return JSON.parse(localStorage.getItem('madagascar-trip'))||{days:[[]]}}catch(e){return {days:[[]]}}}
function isSaved(){return saveState().days?.some(day=>day.includes(p.id))}
function addTrip(){let t=saveState();if(!Array.isArray(t.days)||!t.days.length)t={days:[[]]};if(t.days.some(day=>day.includes(p.id))){toast('Déjà dans votre voyage');return}t.days[0].push(p.id);localStorage.setItem('madagascar-trip',JSON.stringify(t));syncSave();toast('Ajouté au voyage')}
function syncSave(){const b=$('#savePlace');if(b)b.textContent=isSaved()?'♥ Déjà dans mon voyage':'♡ Ajouter à mon voyage'}
function theme(){const dark=document.documentElement.dataset.theme==='dark'||(!document.documentElement.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches);const n=dark?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('madagascar-theme',n)}catch(e){}$('#themeBtn').textContent=n==='dark'?'☀':'☾'}
if(!p){document.title='Lieu introuvable · Madagascar Explorer';$('#placePage').innerHTML='<section class="place-not-found"><div class="wrap"><p class="eyebrow">Erreur 404</p><h1>Ce lieu n’existe pas dans cette version.</h1><p><a class="btn primary" href="index.html#explorer">Retourner à la carte</a></p></div></section>';return}
document.title=`${p.name} · Madagascar Explorer`;
const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=p.desc;
const bestMonths=(p.months||[]).map(monthName).filter(Boolean).join(' · ');
const discoveryBlock=d?`<section class="story-block story-accent"><p class="eyebrow">Prendre le temps de découvrir</p><h2>${esc(d.title)}</h2><p>${esc(d.text)}</p><div class="story-facts"><div><small>À savourer</small><strong>${esc(d.moment)}</strong></div><div><small>Temps proposé</small><strong>${esc(d.stay)}</strong></div></div><p class="care-note">${esc(d.care)}</p>${d.source?`<a class="text-link-inline" href="${esc(d.source)}" rel="noopener" target="_blank">Source complémentaire ↗</a>`:''}</section>`:'';
$('#placePage').className='';
$('#placePage').innerHTML=`
<article class="place-article">
  <header class="place-hero-page">
    <div class="place-hero-media">${heroMedia()}<div class="place-hero-veil"></div></div>
    <div class="place-hero-content wrap">
      <a class="place-breadcrumb" href="index.html#explorer">← Madagascar Explorer</a>
      <p class="eyebrow">${esc(p.region)} · ${esc(CATS[p.cat]||p.cat)}</p>
      <h1>${esc(p.name)}</h1>
      <p class="place-hero-lead">${esc(p.desc)}</p>
      <div class="place-badges"><span>${esc(EFFORT[p.effort]||p.effort)}</span>${p.top?'<span>✦ Incontournable</span>':''}<span>${esc(p.best)}</span></div>
      <div class="place-hero-actions"><button class="btn primary" id="savePlace">♡ Ajouter à mon voyage</button><a class="btn ghost place-hero-map-link" href="#carte-lieu">Voir la carte</a></div>
      ${photo?`<p class="place-photo-credit">Photo : ${photoCredit()}</p>`:''}
    </div>
  </header>
  <div class="wrap place-layout-page">
    <div class="place-prose">
      <section class="story-block"><p class="eyebrow">En quelques mots</p><h2>Pourquoi découvrir ${esc(p.name)} ?</h2><p>${esc(p.desc)}</p>${(p.tags||[]).length?`<p class="muted">Repères : ${(p.tags||[]).map(esc).join(' · ')}</p>`:''}</section>
      ${discoveryBlock}
      <section class="story-block"><p class="eyebrow">Sur place</p><h2>Ce que cette étape peut offrir</h2><div class="experience-grid">${experienceCards()}</div></section>
      <section class="story-block"><p class="eyebrow">Préparer la visite</p><h2>Accès, rythme et saison</h2><p>${esc(planningText())}</p><div class="visit-grid"><div><small>Accès</small><strong>${esc(p.access)}</strong></div><div><small>Rythme conseillé</small><strong>${esc(p.best)}</strong></div><div><small>Effort</small><strong>${esc(EFFORT[p.effort]||p.effort)}</strong></div><div><small>Période indicative</small><strong>${esc(bestMonths||'À vérifier')}</strong></div></div>${monthStrip()}</section>
      <section class="story-block" id="carte-lieu"><p class="eyebrow">Repérer le lieu</p><h2>Sur la carte</h2><div id="placeMap" class="place-map"></div><p class="source-note">Position éditoriale indicative. Pour un trajet réel, vérifiez la route, les conditions locales et les consignes actualisées.</p></section>
    </div>
    <aside class="place-aside-page">
      <div class="place-box"><p class="eyebrow">Repères</p><dl><div><dt>Région</dt><dd>${esc(p.region)}</dd></div><div><dt>Type</dt><dd>${esc(CATS[p.cat]||p.cat)}</dd></div><div><dt>Coordonnées</dt><dd>${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</dd></div><div><dt>Sélection</dt><dd>${p.top?'Incontournable':'À découvrir'}</dd></div></dl></div>
      <div class="place-box"><p class="eyebrow">Expériences</p><div class="tagline">${(p.f||[]).map(f=>`<span class="mini">${esc(FLAGS[f]||f)}</span>`).join('')||'<span class="mini">Découverte locale</span>'}</div></div>
      <div class="place-box"><p class="eyebrow">Bon à savoir</p><p>${esc(planningText())}</p></div>
      ${photo?`<div class="place-box"><p class="eyebrow">Photographie</p><p>${photoCredit()}</p><small>${esc(photo.title||'Wikimedia Commons')}</small></div>`:''}
    </aside>
  </div>
  <section class="related-section"><div class="wrap"><p class="eyebrow">À rapprocher</p><h2>Dans le même secteur</h2><div class="related-grid">${nearbyCards()}</div></div></section>
</article>`;
$('#savePlace').addEventListener('click',addTrip);syncSave();$('#themeBtn').addEventListener('click',theme);
const map=L.map('placeMap',{zoomControl:false,scrollWheelZoom:false}).setView([p.lat,p.lng],p.cat==='ville'?11:9);L.control.zoom({position:'bottomright'}).addTo(map);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);L.marker([p.lat,p.lng]).addTo(map).bindPopup(`<strong>${esc(p.name)}</strong>`).openPopup();
})();
