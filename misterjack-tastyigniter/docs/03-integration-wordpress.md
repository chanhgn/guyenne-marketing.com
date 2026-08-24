# 3. Brancher misterjack.ma sur TastyIgniter

Le site WordPress reste inchangé : seuls les liens « Commander en ligne »
changent de destination. Aucun plugin à installer.

## Remplacer les liens GloriaFood

259 emplacements pointent vers GloriaFood (voir doc 2). Elementor stocke ses
données en JSON dans `wp_postmeta`, avec les slashs échappés (`https:\/\/…`) :
un simple remplacement de texte en rate donc la moitié. Il faut traiter les
deux formes.

```bash
# 1. Sauvegarde préalable (UpdraftPlus est déjà installé sur le site)

# 2. Forme normale, dans le contenu des pages
wp search-replace \
  'https://www.restaurantlogin.com/ordering/restaurant/menu?company_uid=66c8a792-808f-41f7-943e-5fbafc422138' \
  'https://order.misterjack.ma' \
  --all-tables-with-prefix --precise --report-changed-only

# 3. Forme échappée, dans les données Elementor
wp search-replace \
  'https:\/\/www.restaurantlogin.com\/ordering\/restaurant\/menu?company_uid=66c8a792-808f-41f7-943e-5fbafc422138' \
  'https:\/\/order.misterjack.ma' \
  --all-tables-with-prefix --precise --report-changed-only

# 4. Filet de sécurité : tout reste de domaine
wp search-replace 'www.restaurantlogin.com' 'order.misterjack.ma' \
  --all-tables-with-prefix --precise --report-changed-only

# 5. Regénérer les CSS Elementor et vider le cache LiteSpeed
wp elementor flush-css
wp litespeed-purge all
```

Vérification : plus aucune occurrence ne doit subsister.

```bash
wp db query "SELECT COUNT(*) FROM wp_posts WHERE post_content LIKE '%restaurantlogin%'"
wp db query "SELECT COUNT(*) FROM wp_postmeta WHERE meta_value LIKE '%restaurantlogin%'"
```

## Liens par établissement

Le site a des pages Fès et Casablanca, et 10 pages SEO « Livraison Burger à … ».
Autant envoyer chacune vers le bon restaurant plutôt que vers l'accueil :

| Page | Destination |
|---|---|
| Pages Fès et quartiers de Fès | `https://order.misterjack.ma/fes/menus` |
| Pages Casablanca et quartiers | `https://order.misterjack.ma/casablanca/menus` |
| Accueil, menu général | `https://order.misterjack.ma` |

À faire après le remplacement global, page par page dans Elementor.

## Multilingue

Le site est en FR / EN / AR via Polylang. TastyIgniter s'installe en anglais.
La traduction française se récupère via le marketplace :

```bash
php artisan igniter:language-install
```

L'arabe demande en plus un thème compatible RTL : le thème Orange fourni ne
l'est pas. À court terme, faire pointer les pages arabes vers la commande
française plutôt que de livrer une interface à moitié traduite.

## SEO

- Le sous-domaine n'hérite pas de l'autorité de misterjack.ma, mais les pages
  qui se positionnent (« livraison burger Fès ») restent sur le domaine
  principal : elles gardent leur classement, seul le bouton change de cible.
- Le `Menu` en JSON-LD de la page /menu/ reste valable ; ajouter
  `"acceptsReservations"` et l'`potentialAction`/`OrderAction` pointant vers
  `https://order.misterjack.ma` renforce le rich result.
- Bloquer l'indexation du sous-domaine n'est pas souhaitable : laisser Google
  indexer `order.misterjack.ma` pour les requêtes de marque.
