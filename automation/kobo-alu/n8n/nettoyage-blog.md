# Workflow n8n — Kobo-Alu, nettoyage du blog

**ID n8n :** `rkax2pAJRVnl3bLW`
**Statut :** DRY_RUN par défaut, non exécuté en mode réel.

## Ce que fait le workflow

| Action | Volume | Route |
|---|---|---|
| Redirections 301 des doublons | 10 | `POST /rankmath/v1/updateRedirection` |
| Mise en noindex | 20 | `POST /rankmath/v1/updateMeta` |

Le nœud `Config` porte `DRY_RUN`. Tant qu'il vaut `true`, le workflow n'écrit rien,
à l'exception de la sonde.

## La sonde

Un seul appel en écriture est effectué même en simulation : pose de `rank_math_robots:
["noindex"]` sur le brouillon vide `#3533`, qui est de toute façon destiné à la suppression.
Elle répond à la seule question qu'on ne peut pas trancher sans essayer : les routes REST de
Rank Math acceptent-elles l'authentification Basic Auth, ou exigent-elles un nonce d'admin ?

- `2xx` → les routes sont utilisables, on peut passer `DRY_RUN` à `false`.
- `401` ou `403` → les routes exigent un nonce. Les 301 devront passer par l'interface
  Rank Math, et le noindex par une autre voie.

## Redirections prévues

| Source (supprimée de l'index) | Cible conservée |
|---|---|
| #3550 | #1587 |
| #3552 | #1590 |
| #1622 | #3558 |
| #3560 | #1624 |
| #3562 | #3313 |
| #3564 | #3315 |
| #3566 | #3317 |
| #3569 | #3319 |
| #3571 | #3321 |
| #3325 | #3575 |

## Noindex prévus

`1605, 1615, 1624, 3319, 3323, 3329, 3331, 3333, 3359, 3361, 3513, 3515, 3517, 3519,
3521, 3542, 3544, 3546, 3548, 3573`

Règle : moins de 400 mots, ou sujet hors périmètre aluminium, et non redirigé.

## Hors périmètre de ce workflow

- Suppression du brouillon vide `#3533` (à faire après la sonde).
- Finalisation et publication du brouillon `#3535` (pergola bioclimatique à Toulouse).
- Création de la taxonomie par famille de produit.
