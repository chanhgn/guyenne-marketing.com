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
