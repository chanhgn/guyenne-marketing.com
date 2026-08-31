# Stack — HTML / CSS / JS statique

Arborescence de référence :

```
/
├── index.html
├── prestations/index.html
├── prestations/<service>.html
├── realisations/index.html
├── realisations/<projet>.html
├── equipe.html
├── contact.html
├── merci.html
├── 404.html
├── politique-de-confidentialite.html
├── mentions-legales.html
├── robots.txt
├── sitemap.xml
└── assets/{css,js,img,og}
```

## Point 1 — Page 404 avec un vrai code HTTP

Le fichier ne suffit pas : il faut que le serveur le serve **avec le statut 404**.

- **Apache / OVH mutualisé** — `.htaccess` à la racine :
  ```apache
  ErrorDocument 404 /404.html
  ```
- **Nginx** :
  ```nginx
  error_page 404 /404.html;
  location = /404.html { internal; }
  ```
- **Netlify** — un `404.html` à la racine du dossier publié suffit (statut 404 automatique).
- **Vercel (statique)** — idem avec `404.html`.
- **Cloudflare Pages** — `404.html` à la racine.

Base de page : `assets/404.html.template`.

## Point 4 — Page de remerciement

Formulaire en POST vers le service de traitement (Formspree, Tally, Web3Forms, script PHP), puis
redirection vers `/merci.html`. Ajouter dans `merci.html` :

```html
<meta name="robots" content="noindex, follow">
```

Base de page : `assets/merci.html.template`.

## Points 11 / 12 / 13 — `<head>` type de chaque page

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Relevé 3D et Scan to BIM à Bordeaux — Devis 48 h | GUYENNE ÉTUDES</title>
  <meta name="description" content="Relevé 3D par scanner laser et modélisation BIM pour architectes en Gironde. Maquette Revit livrée sous 10 jours. Devis chiffré sous 48 h ouvrées.">
  <link rel="canonical" href="https://exemple.fr/prestations/releve-3d/">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="GUYENNE ÉTUDES">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="Relevé 3D et Scan to BIM à Bordeaux">
  <meta property="og:description" content="Maquette Revit livrée sous 10 jours. Devis sous 48 h.">
  <meta property="og:url" content="https://exemple.fr/prestations/releve-3d/">
  <meta property="og:image" content="https://exemple.fr/assets/og/releve-3d.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Scanner laser 3D en cours de relevé dans un bâtiment ancien">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Relevé 3D et Scan to BIM à Bordeaux">
  <meta name="twitter:description" content="Maquette Revit livrée sous 10 jours. Devis sous 48 h.">
  <meta name="twitter:image" content="https://exemple.fr/assets/og/releve-3d.jpg">
</head>
```

Astuce anti-duplication : tenir un tableau `page → title → description` avant d'écrire le HTML,
et le contrôler avant livraison.

## Point 5 — Fil d'Ariane

```html
<nav aria-label="Fil d'Ariane" class="breadcrumb">
  <ol>
    <li><a href="/">Accueil</a></li>
    <li><a href="/prestations/">Prestations</a></li>
    <li aria-current="page">Relevé 3D</li>
  </ol>
</nav>
```

```css
.breadcrumb ol { display:flex; flex-wrap:wrap; gap:.5rem; list-style:none; padding:0; margin:0; font-size:.875rem; }
.breadcrumb li + li::before { content:"›"; margin-right:.5rem; color:#888; }
```

Le séparateur est en CSS (`::before`), donc jamais lu par les lecteurs d'écran.
Ajouter le `BreadcrumbList` JSON-LD correspondant (voir `schema-jsonld.md`).

## Point 9 — Barre CTA mobile

```html
<div class="cta-mobile" role="group" aria-label="Actions rapides">
  <a class="cta-mobile__call" href="tel:+33556000000">Appeler</a>
  <a class="cta-mobile__quote" href="/contact.html">Devis 48 h</a>
</div>
```

```css
.cta-mobile{
  position:fixed; inset:auto 0 0 0; z-index:50;
  display:grid; grid-template-columns:1fr 1fr; gap:8px;
  padding:8px 12px calc(8px + env(safe-area-inset-bottom));
  background:#fff; box-shadow:0 -2px 12px rgba(0,0,0,.12);
}
.cta-mobile a{
  min-height:48px; display:flex; align-items:center; justify-content:center;
  border-radius:10px; font-weight:600; text-decoration:none;
}
.cta-mobile__call{ border:2px solid var(--brand); color:var(--brand); }
.cta-mobile__quote{ background:var(--brand); color:#fff; }
body{ padding-bottom:88px; }                      /* rien n'est masqué */
@media (min-width:768px){ .cta-mobile{ display:none } body{ padding-bottom:0 } }
```

## Point 19 — Carte chargée au clic

```html
<div class="map" id="map">
  <img src="/assets/img/plan-statique.jpg" alt="Plan d'accès au 12 rue X à Bordeaux" width="800" height="450">
  <button type="button" id="map-load">Afficher la carte (dépose des cookies Google)</button>
</div>
<p><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=12+rue+X+33000+Bordeaux">Itinéraire</a></p>
<script>
document.getElementById('map-load').addEventListener('click', function () {
  var f = document.createElement('iframe');
  f.src = 'https://www.google.com/maps/embed?pb=…';
  f.title = 'Carte de localisation du bureau';
  f.loading = 'lazy';
  f.width = 800; f.height = 450; f.style.border = 0;
  document.getElementById('map').replaceChildren(f);
});
</script>
```

## Point 10 — robots.txt et sitemap

`robots.txt` : partir de `assets/robots.txt.template`.
`sitemap.xml` : lister uniquement les pages indexables (donc **sans** `/merci.html` ni `/404.html`),
avec `<lastmod>` réel.

## Contrôles avant livraison

```bash
# titles et metas dupliqués, images sans alt, statut 404, robots, OG…
bash .claude/skills/site-web-complet/scripts/verif-site.sh https://exemple.fr
```
