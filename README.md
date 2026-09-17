# Madagascar Explorer

Carte interactive statique de Madagascar, inspirée de la structure de **Minorque Explorer** et prête pour GitHub Pages.

HTML + CSS + JavaScript natif. Pas de framework ni de compilation. Leaflet est chargé depuis un CDN dans cette première version.

## Contenu de cette version

- **62 lieux** répartis entre Hautes Terres, Est, Ouest, Nord, Nord-Est, Sud, Sud-Ouest et îles.
- **10 itinéraires** thématiques.
- Une section **routes & déplacements** adaptée à la réalité malgache : RN7, pistes de l’Ouest, boucle du Nord, corridor Est et Grand Sud.
- Filtres par région, catégorie, effort, expérience et mois.
- Carte Leaflet, recherche plein texte et tri par proximité.
- Fiches détaillées et planificateur local « Mon voyage ».
- Calendrier éditorial mois par mois.
- Repères sur biodiversité, patrimoine, langues, fady, artisanat et tourisme communautaire.
- Thème clair / sombre et interface responsive.

## Structure

```text
index.html
assets/
  app.js
  styles.css
data/
  places.js
  itineraries.js
  roads.js
  guide.js
.github/workflows/
  deploy-pages.yml
CREDITS.md
LICENSE
.nojekyll
```

## Lancer localement

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Publication GitHub Pages

Le workflow fourni publie automatiquement le site sur GitHub Pages à chaque push sur `main`.
Dans **Settings → Pages**, choisir **GitHub Actions** comme source.

## Important

Cette carte est un outil éditorial et de préparation. Elle **ne doit pas être utilisée comme système de navigation routière ni comme source unique pour la sécurité, la santé, les visas ou l’état des pistes**. Madagascar est un pays très vaste où les conditions d’accès varient fortement selon la saison et les événements récents.

## Données et sources

Voir `CREDITS.md`.

## Licence

Code sous licence MIT. Les données et médias conservent leurs licences propres.
