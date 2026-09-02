# Kobo-Alu — Automatisation article hebdo + diffusion réseaux

Spécification technique. **À valider avant construction du workflow n8n.**

Client : Kobo — Menuiserie Aluminium, Toulouse (https://kobo-alu.fr)
Statut : spec en attente de validation — rien n'est encore construit ni activé.

---

## 1. Décisions validées

| Sujet | Décision |
|---|---|
| Runtime | n8n (`https://n8n.srv1581351.hstgr.cloud/`) |
| Validation humaine | Aucune — publication automatique + notification |
| Cadence | 1 article / semaine |
| Sujets | Plan éditorial 12 mois construit en amont, déroulé semaine par semaine |
| Réseaux | LinkedIn, Facebook, Instagram, Google Business Profile |
| Visuels | Génération IA à chaque article |
| Rédaction | Anthropic Claude |
| Horaires | Créneaux optimaux calculés par Metricool, par réseau |
| Étalement | 1 réseau par jour sur 4 jours, angle différent à chaque fois |
| Notifications | Telegram (succès et échec) |

---

## 2. Identifiants et endpoints (relevés sur des workflows en production)

### Metricool
- Endpoint : `POST https://app.metricool.com/api/v2/scheduler/posts`
- Query : `userId` + `blogId` (+ `userToken` selon le pattern utilisé)
- Header : `X-Mc-Auth: <userToken>`
- `userId` : `1574158`
- `blogId` Kobo-Alu : `4246977`
- Timezone de la marque dans Metricool : `Europe/Madrid` (même offset que Paris)
- Réseaux connectés sur la marque :
  - Facebook page `108653324598854`
  - Instagram `kobo_menuiseries`
  - LinkedIn `urn:li:organization:91614485`
  - Google Business Profile (location `1482725276676357535`)

Forme du body (validée en production) :

```json
{
  "autoPublish": true,
  "draft": false,
  "shortener": false,
  "text": "...",
  "publicationDate": { "dateTime": "2026-09-08T09:00:00", "timezone": "Europe/Paris" },
  "providers": [{ "network": "linkedin" }],
  "media": ["https://..."],
  "mediaAltText": [],
  "descendants": [],
  "smartLinkData": { "ids": [] },
  "firstCommentText": "",
  "hasNotReadNotes": false
}
```

Champs spécifiques par réseau : `facebookData: { type: "POST" }`, `instagramData: { type: "POST" }`,
`gmbData: { type: "STANDARD" }`.

### Anthropic
- `POST https://api.anthropic.com/v1/messages`
- Headers : `x-api-key`, `anthropic-version: 2023-06-01`
- Une clé existe déjà sur l'instance n8n. **À migrer en credential** (voir §7).

### Génération d'images — Freepik / Magnific
- `POST https://api.freepik.com/v1/ai/gemini-2-5-flash-image-preview` (asynchrone → `data.task_id`)
- `GET https://api.freepik.com/v1/ai/gemini-2-5-flash-image-preview/{task_id}` → `data.generated[0]`
- Auth : credential `httpHeaderAuth` déjà présente sur l'instance
- Paramètres utiles : `prompt`, `aspect_ratio`, `reference_images`

Fallback gratuit disponible et déjà utilisé sur un autre workflow :
`GET https://image.pollinations.ai/prompt/{prompt}?width=…&height=…&model=flux&nologo=true`

### WordPress — vérifié par l'audit du 2026-09-02
- REST API `https://kobo-alu.fr/wp-json/wp/v2/…`
- Credential n8n : `WordPress kobo-alu.fr`, type Basic Auth — **fonctionnelle** (HTTP 200)
- Compte : rôle `administrator`, `publish_posts` ✅, `upload_files` ✅
- Plugin SEO : **Rank Math** confirmé (namespaces `rankmath/v1`)
- Hébergement : Hostinger, LiteSpeed, PHP 8.2.30
- Autres extensions actives : Elementor + Elementor Pro + ElementsKit, Site Reviews, Trustindex,
  LiteSpeed Cache, et l'adaptateur MCP WordPress (`mcp`, `wp-abilities/v1`)
- Catégorie unique : **`Article Kobo`** (id `1`, slug `article-kobo`) — 44 articles
- Médiathèque : 524 fichiers
- ⚠️ Le rattachement de la credential aux nœuds doit se faire **dans l'interface n8n** :
  `newCredential()` du SDK ne lie pas la credential existante à la création via MCP

### Telegram
- Credential Telegram présente sur l'instance
- `chatId` cible : `908554624`

---

## 3. Architecture du workflow

Nom : **`Kobo-Alu — Article hebdo + diffusion réseaux`**

```
┌─ 1. Schedule Trigger — mardi 08:00 Europe/Paris (cron 0 8 * * 2)
│
├─ 2. Config (Set) — IDs, URLs, DRY_RUN. AUCUN SECRET ICI.
│
├─ 3. Code « Sujet de la semaine »
│     Plan éditorial 52 entrées → sélection par n° de semaine ISO
│     Sortie : slug, titre, mot-clé principal, angle, catégorie, prompt image
│
├─ 4. HTTP GET  wp/v2/posts?slug={slug}&status=any     ← GARDE-FOU ANTI-DOUBLON
│     Si l'article existe déjà → Telegram « déjà publié, rien à faire » → STOP
│
├─ 5. HTTP POST Anthropic  ← rédaction
│     Sortie JSON STRICT :
│     { title, slug, metaTitle, metaDescription, excerpt, contentHtml,
│       imagePromptArticle, imagePromptSocial, imageAlt,
│       posts: { linkedin, facebook, instagram, gmb } }
│
├─ 6. Code « Validation » ← GARDE-FOU QUALITÉ
│     JSON parsable ? metaTitle ≤ 60 ? metaDescription ≤ 155 ?
│     contentHtml ≥ 900 mots ? ≥ 3 balises <h2> ? 4 textes de post non vides ?
│     Longueur GBP ≤ 1500 car. ? Aucun tarif inventé ?
│     → Si KO : 1 nouvelle tentative, puis alerte Telegram + STOP (rien n'est publié)
│
├─ 7. Images (2 formats, en parallèle)
│     a) 16:9 → image à la une de l'article + LinkedIn / Facebook / GBP
│     b) 4:5  → Instagram
│     Freepik (async + polling borné) → si échec : fallback Pollinations
│     → si les deux échouent : on publie quand même LinkedIn + Facebook,
│       on SAUTE Instagram et GBP, et on alerte sur Telegram
│
├─ 8. Upload médias WordPress + alt SEO
│
├─ 9. Création de l'article WordPress
│     status = publish (ou draft si DRY_RUN), catégorie, featured_media,
│     meta Rank Math si le plugin est présent
│
├─ 10. GET Metricool « best time to post » par réseau
│      → 4 créneaux : LinkedIn J, Facebook J+1, Instagram J+2, GBP J+3
│      → fallback si l'API ne renvoie rien : 09:00 sur chaque jour
│
├─ 11. 4 × POST Metricool scheduler (1 par réseau, angle éditorial distinct)
│
└─ 12. Telegram — récapitulatif : titre, URL de l'article, 4 créneaux programmés
```

Workflow annexe : **`Kobo-Alu — Error Handler`** (Error Trigger) → alerte Telegram
détaillée (nœud fautif, message d'erreur, lien vers l'exécution). Déclaré comme
*Error Workflow* dans les réglages du workflow principal.

---

## 4. Angles éditoriaux par réseau

Un seul article, quatre textes distincts — pas de copier-coller multi-réseaux.

| Jour | Réseau | Angle | Format |
|---|---|---|---|
| J | LinkedIn | Expertise technique, B2B (architectes, constructeurs, promoteurs) | 800–1300 car., lien en fin de post |
| J+1 | Facebook | Bénéfice concret pour le particulier toulousain | 300–600 car., lien + image |
| J+2 | Instagram | Visuel d'abord, légende courte, « lien en bio » | 150–400 car. + 5–8 hashtags locaux |
| J+3 | Google Business | Local, informatif, non promotionnel (règles Google) | ≤ 1500 car., image obligatoire |

---

## 5. Garde-fous anti-bug

| Risque | Parade |
|---|---|
| Doublon d'article | Double garde-fou : vérification du slug **et** contrôle sémantique sur les titres existants (voir §10 — le slug seul ne suffit pas, c'est le bug de l'automatisation précédente) |
| Claude renvoie du texte hors JSON | Extraction par regex `\{[\s\S]*\}` + `JSON.parse` en try/catch + 1 retry |
| Article de mauvaise qualité publié | Validation programmatique (longueur, structure, metas) avant publication |
| Génération d'image en échec | Fallback Pollinations, puis dégradation contrôlée (IG et GBP sautés) |
| Post Instagram sans image | Impossible : Instagram n'est appelé que si une image existe |
| Post GBP refusé par Google | Longueur bornée + consigne « ton informatif, pas promotionnel » |
| Metricool renvoie une erreur | `onError: continueRegularOutput` + statut par réseau remonté dans le récap Telegram |
| Panne silencieuse | Error Workflow dédié : aucune exécution ne peut échouer sans alerte |
| Mise en production risquée | `DRY_RUN = true` : article en brouillon + posts Metricool en `draft` |

---

## 6. Plan de test avant activation

1. `DRY_RUN = true`, exécution manuelle → article en brouillon, 4 posts en brouillon Metricool.
2. Vérification visuelle : rendu de l'article, images, 4 textes, 4 créneaux.
3. Test des chemins d'erreur : clé image invalide → le fallback doit prendre le relais ;
   réponse Claude tronquée → le workflow doit s'arrêter proprement avec alerte.
4. Test d'idempotence : relancer deux fois → le 2ᵉ passage doit s'arrêter à l'étape 4.
5. Passage `DRY_RUN = false`, une exécution manuelle réelle, contrôle sur les 4 réseaux.
6. Activation du Schedule Trigger.

---

## 7. Dette de sécurité constatée (hors périmètre, à traiter)

Des secrets sont stockés **en clair** dans des nœuds `Set` de workflows existants,
lisibles par quiconque accède à l'instance n8n :

- workflow `Délices de l'âme — Google Posts mensuels` → nœud `Config` : clé API Anthropic,
  `userToken` Metricool, token du service de rendu ;
- workflow `Comme a la M — Telegram vers Metricool` → nœud `🧩 Extraire` : token du bot Telegram.

Recommandation : révoquer et régénérer ces clés, puis les stocker en credentials n8n.
Le workflow Kobo-Alu n'utilisera **que** des credentials.

---

## 8. Ligne éditoriale validée

| Paramètre | Valeur |
|---|---|
| Cible | 70 % B2C (particuliers) / 30 % B2B (architectes, MOE, promoteurs, bureaux d'études) |
| Zone SEO | Haute-Garonne (31) — Toulouse et agglomération en priorité de citation |
| CTA | Devis gratuit via le formulaire du site, sur les 4 réseaux et en fin d'article |

Le plan éditorial 52 semaines est dans `plan-editorial.json`, consommé tel quel par le nœud
Code « Sujet de la semaine ». Chaque entrée porte : `week`, `target`, `category`, `intent`,
`title`, `slug`, `keyword`, `angle`.

Saisonnalité intégrée : aides et budget en janvier, pergolas/vérandas/portails au printemps,
protection solaire et confort d'été en mai-juin, entretien et retours de chantier l'été,
isolation et préparation de l'hiver à la rentrée, sécurité et financement en fin d'année.
Les sujets B2B, sans saisonnalité forte, sont répartis régulièrement sur l'année.

## 9. Points bloquants à lever

1. **Credential WordPress kobo-alu.fr dans n8n** — l'application password a été généré côté
   client. Reste à créer la credential `httpBasicAuth` dans n8n (nom attendu :
   `WordPress kobo-alu.fr (Basic Auth)`) et à confirmer l'identifiant WordPress associé.
   Le secret n'est stocké ni dans ce dépôt ni dans un nœud du workflow.
2. **Plugin WPVibe désactivé sur kobo-alu.fr** (`rest_no_route`) — à réactiver pour permettre
   l'audit du contenu existant et la déduplication du plan éditorial.
3. **Catégorie WordPress cible et plugin SEO** — à relever une fois l'accès rétabli
   (Rank Math attendu, à confirmer).


---

## 10. État des lieux du site — audit du 2026-09-02

L'audit a révélé qu'**une automatisation de contenu a déjà tourné sur kobo-alu.fr**, entre
juillet 2025 et mai 2026, puis s'est arrêtée. Elle a produit 46 articles (44 publiés, 2 brouillons)
dont la qualité pose trois problèmes mesurés :

### Duplication massive
20 paires de titres quasi identiques sur 44 articles, dont **12 paires strictement identiques**.
Exemples :

| Article récent | Doublon antérieur | Similarité |
|---|---|---|
| #3575 (2026-05-18) « fenêtres en arc… façade ensoleillée » | #3325 (2025-12-15) | 100 % |
| #3573 (2026-05-15) « clôtures en bois avec plantes grimpantes » | #3323 (2025-12-14) | 100 % |
| #3569 (2026-05-08) « performance acoustique… zones urbaines » | #3319 (2025-12-12) | 100 % |
| #3560 (2026-04-24) « nettoyer vos stores vénitiens » | #1624 (2025-07-23) | 100 % |
| #3552 (2026-04-17) « vitrage… rayons UV et chaleur » | #1590 (2025-07-23) | 100 % |

Les slugs diffèrent (WordPress a suffixé `-2`), donc **une déduplication par slug ne les aurait pas
détectés**. C'est précisément le défaut à ne pas reproduire.

### Sujets hors périmètre
Kobo pose de la menuiserie **aluminium**. Répartition des matériaux cités dans les titres :
bois 3, aluminium 3, PVC 2, bambou 1, acier 1. On trouve « clôtures en bambou pour jardin
tropical », « corrosion marine », « insectes xylophages », « zone chaude ». Ces contenus
n'amènent aucun prospect qualifié.

### Aucun ancrage local
**0 article sur 44** mentionne Toulouse, la Haute-Garonne ou l'Occitanie. Pour une entreprise
locale, c'est la totalité du potentiel SEO qui est laissée de côté.

### Formulation stéréotypée
37 titres sur 44 sont des questions ; 15 commencent par « Quelles sont les », 22 par « Comment ».

### Conséquence sur l'architecture du workflow

L'étape 4 passe de un à deux contrôles :

1. `GET /wp/v2/posts?slug={slug}&status=any` — collision exacte d'URL
2. `GET /wp/v2/posts?per_page=100&_fields=id,title,slug` puis contrôle de similarité sur les
   titres normalisés (accents et ponctuation retirés). Au-delà de 75 % de similarité avec un
   article existant, l'exécution s'arrête et alerte sur Telegram au lieu de publier.

### Recommandations hors périmètre du workflow

- Fusionner les 20 paires de doublons et poser des redirections 301 vers l'article conservé.
- Désindexer ou réécrire les articles hors périmètre (bois, PVC, bambou, acier, climat tropical).
- Créer une vraie taxonomie : l'unique catégorie `Article Kobo` ne structure rien.
- Le brouillon #3535, « Pourquoi la pergola bioclimatique en aluminium est l'atout confort de
  votre maison à Toulouse », est le seul contenu au bon registre : aluminium, bénéfice client,
  ancrage local. C'est le modèle à suivre. Le brouillon #3533 (« Elementor #3533 ») est un déchet.
- 12 des 52 semaines du plan éditorial recoupent sémantiquement un article existant
  (brise-soleil, vitrage solaire, acoustique, entretien, garde-corps, portail, pergola, volets,
  porte de garage, préparation hivernale, Uw). Ces articles doivent soit être réécrits avec
  l'angle local, soit remplacés au plan.
