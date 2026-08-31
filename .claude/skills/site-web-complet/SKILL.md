---
name: site-web-complet
description: >
  Création, refonte ou finalisation d'un site internet complet et conforme, selon un standard de 20 points
  obligatoires (page 404 personnalisée, CTA clairs, maillage interne, page de remerciement, fil d'Ariane,
  études de cas, 5 FAQ, promesse de délai, CTA mobile sticky, robots.txt, titres uniques, meta descriptions,
  images Open Graph, vrais avis clients, textes alternatifs, schema LocalBusiness, politique de confidentialité,
  Google Analytics 4 via GTM, carte itinéraire, photos d'équipe). Utiliser CE SKILL SYSTÉMATIQUEMENT dès qu'il
  s'agit de créer, construire, refondre, lancer, livrer ou auditer un site web / site internet / site vitrine /
  landing page / page de site, quelle que soit la techno (WordPress + Elementor, HTML/CSS statique, Next.js/React)
  et quel que soit le pays du client (France, Maroc, Belgique, Suisse, Canada, Afrique francophone, international).
  Se déclenche aussi sur "faire un site", "nouveau site client", "refonte de site", "mettre le site en ligne",
  "il manque quoi sur mon site", "checklist site web", "site pas conforme", "livrer le site",
  "site pour un client marocain", "site multilingue", "site en arabe", "site français-arabe".
---

# Site web complet — standard 20 points

## Rôle

Tu construis des sites qui **convertissent** et qui sont **conformes** (RGPD, droit de la consommation
français, SEO technique). Un site n'est jamais livré tant que les 20 points ci-dessous ne sont pas
vérifiés un par un.

Ce skill s'applique à **tout** projet de site : création, refonte, ou finition d'un site existant.

## Les 3 phases obligatoires

```
PHASE 1 — INTERVIEW      → collecter les infos réelles (jamais inventer)
PHASE 2 — CONSTRUCTION   → bâtir le site, les 20 points intégrés dès le départ
PHASE 3 — VALIDATION     → cocher les 20 points, refuser la livraison si un point est rouge
```

Ne saute jamais la phase 1. Un site construit avant l'interview finit avec des avis inventés,
une promesse de délai fausse et un schema LocalBusiness incohérent avec la fiche Google.

---

## PHASE 1 — Interview

Lis `references/interview.md` et pose les questions **par blocs**, pas les 40 d'un coup.
Ordre des blocs : Identité → Offre → Preuves → Conversion → Technique → Juridique.

Règles :
- Regroupe 5 à 8 questions par message, avec des exemples de réponse attendue.
- Si l'utilisateur ne sait pas, propose un défaut explicite et note-le comme **hypothèse à valider**.
- Trois choses ne peuvent **jamais** être inventées ni "plausibilisées" :
  **les avis clients, les études de cas et les photos d'équipe**. Voir `references/juridique-pays.md`.
- Termine la phase 1 par un récapitulatif en tableau que l'utilisateur valide avant de coder.

### Déterminer la stack (première question, toujours)

| Stack | Fichier à lire | Signal |
|---|---|---|
| WordPress + Elementor | `references/stack-wordpress-elementor.md` | site existant WP, Rank Math/Yoast, accès admin |
| HTML/CSS/JS statique | `references/stack-html-statique.md` | site vitrine simple, hébergement OVH/Netlify, pas de CMS |
| Next.js / React | `references/stack-nextjs.md` | repo JS, Vercel, besoin de composants |

Si l'utilisateur ne sait pas : proposer **WordPress + Elementor** pour un client qui doit pouvoir
éditer seul, **HTML statique** pour un one-pager rapide et durable, **Next.js** pour un site
qui va grossir ou qui a besoin de pages programmatiques.

### Déterminer le marché et la langue

Deuxième question obligatoire, juste après la stack : **dans quel pays est le client, et pour quel
public ?** Ça change le droit applicable, les mentions légales, les formats et les canaux de contact.

| Marché | Pages légales | Spécificités à prévoir |
|---|---|---|
| France / UE | Politique de confidentialité RGPD + mentions légales (LCEN) | Bandeau cookies CNIL, SIREN/RCS, hébergeur |
| Maroc | Politique de confidentialité loi 09-08 + mentions | Déclaration CNDP, RC/ICE/IF, WhatsApp, horaires Ramadan, bilingue fr/ar |
| Belgique / Suisse | RGPD / nLPD | Bilinguisme, numéro BCE ou IDE |
| Canada / Québec | Loi 25 | Version française obligatoire (loi 96), responsable des renseignements personnels nommé |
| Autre / international | Socle RGPD + validation locale | Ne jamais annoncer « conforme » sans vérification locale |

Lire `references/international.md` (langues, RTL, formats, canaux, cartes, saisonnalité) et
`references/juridique-pays.md` (droit applicable) dès que le pays est connu.

Si le client exerce une **profession réglementée** (santé, droit, immobilier, courtage), lire
la section 6 de `juridique-pays.md` **avant de rédiger** : les points 2, 6, 8, 14 et 16 changent.

### Déterminer le profil de contenu

| Profil | Ce qui change |
|---|---|
| Artisan / TPE locale | LocalBusiness + carte itinéraire + zone d'intervention obligatoires ; études de cas = chantiers avant/après ; promesse = délai de rappel/devis |
| B2B / services pro | LocalBusiness allégé (`ProfessionalService`), carte facultative ; études de cas = projets chiffrés ; promesse = délai contractuel de livraison |
| E-commerce / produit | Ajouter `Product` + `Offer`, avis produits vérifiés, pages catégories ; la carte itinéraire devient facultative |

---

## PHASE 2 — Construction

1. Lis `references/checklist-20.md` : c'est la **spécification** de chaque point (critère de réussite précis).
2. Lis le fichier de stack correspondant : c'est la **recette d'implémentation**.
3. Lis `references/contenus-types.md` pour rédiger CTA, FAQ, études de cas, promesse de délai.
4. Lis `references/schema-jsonld.md` pour les données structurées (points 5, 7, 14, 16).
5. Lis `references/tracking-ga4-gtm.md` pour GA4 + GTM + Consent Mode v2 (points 4, 18).
6. Lis `references/international.md` si le site n'est pas franco-français ou s'il est multilingue.
7. Lis `references/juridique-pays.md` pour les pages légales du pays concerné (point 17).

Templates prêts à adapter dans `assets/` : `robots.txt.template`, `404.html.template`,
`merci.html.template`, `politique-confidentialite.md.template`.

Ordre de construction recommandé :

```
1. Arborescence + URLs (décide le fil d'Ariane et le maillage)
2. Pages de contenu (accueil, services, études de cas, à propos/équipe, contact)
3. Pages système (404, merci, politique de confidentialité, mentions légales)
4. Conversion (CTA desktop + barre CTA mobile, formulaire → /merci)
5. SEO technique (titles, metas, OG, alt, robots.txt, sitemap, JSON-LD)
6. Tracking (GTM + GA4 + bandeau consentement + événements)
7. Validation
```

**Règle anti-placeholder** : toute donnée non fournie s'écrit `[À FOURNIR : description exacte]`
en clair dans le livrable, jamais une valeur inventée qui a l'air vraie. Recense tous les
`[À FOURNIR]` restants dans le rapport final.

---

## PHASE 3 — Validation

Reprends `references/checklist-20.md` et produis un tableau de contrôle. Aucun point n'est
"probablement bon" : chacun se vérifie.

Si le site est en ligne, lance le vérificateur automatique :

```bash
bash .claude/skills/site-web-complet/scripts/verif-site.sh https://exemple.fr
```

Il contrôle ce qui est mécaniquement vérifiable (statut HTTP du 404, robots.txt, sitemap, unicité
des titles, présence des metas/OG/JSON-LD, images sans alt, noindex sur /merci, présence GA4/GTM).
Les points humains (qualité des CTA, véracité des avis, pertinence des FAQ) restent à juger à la main.

Format du rapport final :

```
| # | Point | Statut | Preuve / où c'est implémenté | Reste à faire |
|---|-------|--------|------------------------------|---------------|
| 1 | Page 404 | ✅ | /404.html, code HTTP 404 vérifié, 4 liens + CTA | — |
| 14 | Vrais avis | ⛔ | — | Client doit fournir 3 avis Google (lien + date) |
```

Statuts : ✅ conforme · ⚠️ conforme mais améliorable · ⛔ bloquant · ➖ non applicable (justifier).

**Un site avec un ⛔ n'est pas livré.** Dis-le explicitement, liste ce qui manque, et propose de
mettre le site en ligne sans la fonctionnalité concernée plutôt que de la falsifier.

---

## Les 20 points en une page

| # | Point | Critère de réussite en une ligne |
|---|---|---|
| 1 | Page 404 | Renvoie un vrai code HTTP 404, ton de la marque, 3-5 liens utiles + 1 CTA, jamais une redirection vers l'accueil |
| 2 | CTA clair | 1 action primaire par page, verbe + bénéfice + délai, visible sans scroll, répétée tous les 2-3 blocs |
| 3 | Liens internes | 3+ liens contextuels par page, ancres descriptives, aucune page à plus de 3 clics de l'accueil |
| 4 | Page de remerciement | URL dédiée `/merci`, noindex, prochaines étapes + délai annoncé, liens de rebond, sert de conversion GA4 |
| 5 | Fil d'Ariane | Visible sur toutes les pages sauf l'accueil + `BreadcrumbList` JSON-LD cohérent avec l'URL |
| 6 | Études de cas | 3 minimum, structure Contexte → Contrainte → Solution → Résultat chiffré → verbatim, données réelles |
| 7 | 5 FAQ | 5 vraies questions clients (prix, délai, zone, process, garantie), 40-80 mots, `FAQPage` JSON-LD |
| 8 | Promesse de délai | Chiffrée, tenable, identique partout, affichée à côté de chaque CTA |
| 9 | CTA mobile | Barre sticky en bas, cible tactile ≥ 48px, `tel:` cliquable (+ WhatsApp selon le marché), sans masquer le contenu 🌍 |
| 10 | robots.txt | À la racine, CSS/JS autorisés, `/merci` bloqué, `Sitemap:` en URL absolue |
| 11 | Titres uniques | 50-60 caractères, uniques sur tout le site, mot-clé + différenciateur + marque |
| 12 | Meta description | 140-160 caractères, uniques, bénéfice + preuve + CTA, contiennent la promesse de délai |
| 13 | Images sociales | `og:` + `twitter:card` complets, image 1200×630 en URL absolue, < 300 Ko, spécifique aux pages clés |
| 14 | Vrais avis | Prénom + date + source vérifiable ; jamais inventés ; `AggregateRating` seulement si avis réels affichés · 🌍 interdits sur le site pour les professions de santé |
| 15 | Textes alternatifs | Toute image informative décrite (≤125 car.), `alt=""` sur les décoratives, zéro bourrage de mots-clés |
| 16 | Schema LocalBusiness | Type précis, NAP strictement identique à la fiche Google, horaires, `areaServed`, `addressCountry`, `sameAs` |
| 17 | Politique de confidentialité | Page dédiée complète **selon le droit du pays** + page mentions légales / identification de l'éditeur, liées depuis le footer et les formulaires 🌍 |
| 18 | Google Analytics | GA4 via GTM, Consent Mode v2, refus aussi simple que l'accord, événements de conversion configurés (dont `click_whatsapp` là où c'est le canal principal) |
| 19 | Carte itinéraire | Carte chargée au clic (conformité + perf) + bouton « Itinéraire » vers Google/Apple Maps (+ Waze au Maroc) 🌍 |
| 20 | Photos d'équipe | Vraies photos (jamais de banque d'images), alt avec prénom + rôle, optimisées |

🌍 = le critère dépend du pays, de la langue ou du secteur : voir `references/international.md`
et `references/juridique-pays.md`.

Détail complet, pièges et méthode de vérification de chaque point : `references/checklist-20.md`.

---

## Articulation avec les autres skills

- **`seo-wordpress-local`** / **`seo-guyenne-etudes`** : rédaction et stratégie de mots-clés. Ce skill-ci
  fixe le socle technique et la conformité ; eux fournissent le contenu SEO. Les deux se combinent.
- **`schema-markup`** : à charger pour tout schema qui dépasse les points 5/7/14/16.
- **`page-cro`** : à charger pour optimiser une page existante qui convertit mal.
- **`frontend-design`** / **`ui-ux-pro-max`** : direction artistique et composants.
- **`wordpress-elementor`** / **`elementor-mcp`** / **WPVibeAi** : exécution sur WordPress.
- **`gbp-dermatologue-fes-lakhssassi`** : SEO local marocain et gestion des avis Google — c'est là
  que vivent les avis d'un praticien, pas sur son site.
- **`humanizer`** : passer les textes rédigés avant livraison.

Ce skill reste maître sur les 20 points : si un autre skill produit une page, elle repasse par la
validation phase 3.
