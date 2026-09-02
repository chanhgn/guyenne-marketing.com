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

### WordPress
- REST API `https://kobo-alu.fr/wp-json/wp/v2/…`
- Auth : `httpBasicAuth` avec un **application password** (pattern déjà utilisé pour guyenne-etudes.fr)
- ⚠️ **La credential pour kobo-alu.fr reste à créer / confirmer** — point bloquant n°1

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
| Doublon d'article | Vérification du slug dans WordPress avant toute écriture (étape 4) |
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

## 8. Points bloquants à lever

1. **Credential WordPress kobo-alu.fr dans n8n** — application password à créer, puis
   credential `httpBasicAuth` associée.
2. **Plugin WPVibe désactivé sur kobo-alu.fr** (`rest_no_route`) — à réactiver pour permettre
   l'audit du contenu existant et la construction du plan éditorial sans doublon.
3. **Contexte commercial Kobo** — cible prioritaire, zone d'intervention, gamme de produits,
   appel à l'action à utiliser dans les posts.
