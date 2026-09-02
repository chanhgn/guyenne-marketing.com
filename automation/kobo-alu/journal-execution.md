# Journal d'exécution — nettoyage kobo-alu.fr

## 2026-09-02 · exécution 69851 — partiellement appliquée

**Workflow :** `rkax2pAJRVnl3bLW`, `DRY_RUN = false`

| Action | Résultat |
|---|---|
| 20 mises en noindex | ✅ **appliquées**, HTTP 200 sur chacune |
| 10 redirections 301 | ❌ refusées, HTTP 403 `rest_cannot_edit` |

### Articles effectivement passés en noindex

`1605, 1615, 1624, 3319, 3323, 3329, 3331, 3333, 3359, 3361, 3513, 3515, 3517, 3519,
3521, 3542, 3544, 3546, 3548, 3573`

Plus le brouillon `3533` via la sonde.

### Cause de l'échec des redirections

`Helper::is_module_active('redirections')` renvoyait faux : le module Redirections de
Rank Math était désactivé sur le site. La capacité `rank_math_redirections` du compte,
elle, était bien présente — ce n'était pas un problème de droits.

Aucune redirection partielle ou malformée n'a été créée : les 10 appels ont été rejetés
avant tout traitement.

### Correction apportée

Ajout d'un nœud `Activer module Redirections` en tête de workflow :
`POST /rankmath/v1/saveModule` avec `{"module":"redirections","state":"on"}`.
Contrat vérifié sur `includes/rest/class-admin.php`, permission `can_manage_options`.

Pour désactiver le module : même route avec `"state":"off"`.

### Reste à faire

- Relancer le workflow pour appliquer les 10 redirections.
- Supprimer le brouillon vide `#3533`.
- Finaliser et publier le brouillon `#3535` (pergola bioclimatique à Toulouse).
- Créer la taxonomie par famille de produit.

---

## 2026-09-02 · exécutions 69872 et 69874 — nettoyage terminé

**Exécution 69872**

| Action | Résultat |
|---|---|
| Activation du module Redirections | ✅ HTTP 200, réponse `true` |
| 10 redirections 301 | ✅ **appliquées** |
| 20 noindex | 17 ✅ / 3 ❌ HTTP 500 |

Les 3 échecs — articles `3546`, `3548`, `3573` — renvoyaient
`Error establishing a database connection`. Défaillance MySQL passagère chez Hostinger
sous la charge de 30 requêtes rapprochées, sans rapport avec la logique du workflow.

**Exécution 69874 — reprise ciblée**

Plan réduit aux 3 articles concernés, pour ne pas réécrire les redirections déjà posées.
Résultat : 3/3 en HTTP 200.

### État final

- 10 redirections 301 en place
- 21 articles en noindex (20 du plan + le brouillon `3533` via la sonde)
- Module Redirections de Rank Math activé
- Workflow remis en `DRY_RUN = true`

### Leçon retenue pour le workflow de publication hebdomadaire

L'hébergement mutualisé Hostinger lâche la connexion MySQL sur des rafales de requêtes.
Le workflow hebdomadaire écrira beaucoup moins (1 article + 2 médias + 4 posts), mais il
faut prévoir `retryOnFail` avec un intervalle sur les nœuds d'écriture WordPress plutôt
que de supposer que chaque appel passera du premier coup.

### Reste à faire

- Supprimer le brouillon vide `#3533`
- Finaliser et publier le brouillon `#3535` (pergola bioclimatique à Toulouse)
- Créer la taxonomie par famille de produit
- Construire le workflow de publication hebdomadaire

---

## 2026-09-02 · finalisation — taxonomie, article, redirections

### Taxonomie créée

| id | slug |
|---|---|
| 13 | portes-portails |
| 14 | fenetres-baies-vitrees |
| 15 | pergolas-carports |
| 16 | claustras-garde-corps |
| 17 | volets-protection-solaire |
| 18 | conseils-reglementation |

Nommée d'après la gamme réelle relevée sur les 30 pages produit du site.

### Deux défauts détectés par la vérification, et corrigés

**Elementor écrasait le contenu de l'article 3535.** La mise à jour de `post_content` via
l'API renvoyait 200, mais la page publiée servait toujours l'ancien texte : le post avait été
construit avec Elementor, qui stocke sa propre copie. Les 44 autres articles du site, créés
par l'API, ne sont pas concernés.
Correction : mise à la corbeille de 3535 et création d'un post neuf, `#3784`, hors Elementor.

**Les 10 redirections n'avaient rien écrit en base.** Le paramètre `redirectionSources`
n'était pas transmis. Dans `class-redirection.php`, `add_source()` ignore un motif vide et
`save()` retourne `false` si aucune source valide : les 10 appels ont donc été des
non-opérations, sans redirection parasite ni risque pour la page d'accueil. Le 200 renvoyé
signifiait « requête acceptée », pas « redirection créée ».
Correction : `redirectionSources` transmis avec l'URL complète de la source. Les 10 réponses
portent désormais `action: new` et un identifiant en base.

### Vérifié sur le site réel

- Page `https://kobo-alu.fr/pergola-bioclimatique-aluminium-toulouse/` : 83 754 octets, sans
  Elementor, contenu conforme, ancien texte absent.
- Balises : title et description Rank Math en place, `robots: follow, index`, canonical correcte.
- 5 liens internes actifs vers les pages produit et la page contact.
- Schema `BlogPosting` généré automatiquement par Rank Math.
- Trois redirections testées : **301** avec la bonne destination.
- Post 3535 : `trash`. Brouillon 3533 : `trash`.

### Correction du plan éditorial

Kobo ne commercialise pas de véranda. Les semaines 12 et 20 portaient sur ce produit ;
elles sont remplacées par un sujet claustra et un comparatif store banne / pergola.
