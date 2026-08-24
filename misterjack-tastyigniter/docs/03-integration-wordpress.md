# 3. Brancher misterjack.ma sur TastyIgniter

Le site WordPress reste inchangé : seuls les liens de commande changent de
destination. Aucun plugin à installer.

## Les liens à remplacer

Trois cibles cohabitent aujourd'hui sur le site :

| Cible actuelle | Où | Nouvelle destination |
|---|---|---|
| `restaurantlogin.com/ordering/restaurant/menu?company_uid=66c8a792-…` | bouton « COMMANDER EN LIGNE » de l'en-tête, présent sur toutes les pages | `https://order.misterjack.ma` |
| `restaurantlogin.com/api/fb/nwne4` | menu de navigation, entrée « Commande » sous CASABLANCA | `https://order.misterjack.ma/casablanca/menus` |
| `wa.me/212660871231` | menu de navigation, entrée « Commande » sous FÈS | à garder en complément (voir plus bas) |

Les deux premières sont des liens GloriaFood : elles cessent de fonctionner au
plus tard le 31 mars 2027. La troisième est le WhatsApp de Fès, qui peut rester
comme canal secondaire.

## Remplacement en base

Elementor stocke ses données en JSON dans `wp_postmeta`, avec les slashs
échappés (`https:\/\/…`) : un simple remplacement de texte en rate donc la
moitié. Il faut traiter les deux formes, et le lien Casablanca séparément —
sinon un remplacement de domaine seul le transforme en
`order.misterjack.ma/api/fb/nwne4`, qui n'existe pas.

```bash
# 0. Sauvegarde préalable (UpdraftPlus est déjà installé sur le site)

# 1. Le lien Casablanca, en premier car le plus spécifique
wp search-replace \
  'https://www.restaurantlogin.com/api/fb/nwne4' \
  'https://order.misterjack.ma/casablanca/menus' \
  --all-tables-with-prefix --precise --report-changed-only

wp search-replace \
  'https:\/\/www.restaurantlogin.com\/api\/fb\/nwne4' \
  'https:\/\/order.misterjack.ma\/casablanca\/menus' \
  --all-tables-with-prefix --precise --report-changed-only

# 2. Le bouton d'en-tête, forme normale puis forme échappée
wp search-replace \
  'https://www.restaurantlogin.com/ordering/restaurant/menu?company_uid=66c8a792-808f-41f7-943e-5fbafc422138' \
  'https://order.misterjack.ma' \
  --all-tables-with-prefix --precise --report-changed-only

wp search-replace \
  'https:\/\/www.restaurantlogin.com\/ordering\/restaurant\/menu?company_uid=66c8a792-808f-41f7-943e-5fbafc422138' \
  'https:\/\/order.misterjack.ma' \
  --all-tables-with-prefix --precise --report-changed-only

# 3. Regénérer les CSS Elementor et vider le cache LiteSpeed
wp elementor flush-css
wp litespeed-purge all
```

Vérification — il doit rester zéro occurrence, et surtout aucune URL bâtarde :

```bash
wp db query "SELECT COUNT(*) FROM wp_posts WHERE post_content LIKE '%restaurantlogin%'"
wp db query "SELECT COUNT(*) FROM wp_postmeta WHERE meta_value LIKE '%restaurantlogin%'"
wp db query "SELECT COUNT(*) FROM wp_postmeta WHERE meta_value LIKE '%order.misterjack.ma/api/fb%'"
```

## Liens par établissement

Le site a des pages Fès et Casablanca, et 10 pages SEO « Livraison Burger à … ».
Autant envoyer chacune vers le bon restaurant plutôt que vers l'accueil :

| Page | Destination |
|---|---|
| Pages Fès et quartiers de Fès (Agdal, Narjiss, Saïss, Aïn Chkef, Ville Nouvelle) | `https://order.misterjack.ma/fes/menus` |
| Pages Casablanca et quartiers (Maârif, Gauthier, Anfa, Sidi Maârouf, Aïn Diab) | `https://order.misterjack.ma/casablanca/menus` |
| Accueil, page menu générale | `https://order.misterjack.ma` |

À faire après le remplacement global, page par page dans Elementor.

## WhatsApp : garder ou non

Fès prend aujourd'hui ses commandes sur WhatsApp. Le passage à TastyIgniter n'y
oblige pas à renoncer, et le supprimer d'un coup ferait perdre des commandes
d'habitués. Le plus sûr : garder l'entrée WhatsApp en second, et mettre la
plateforme en bouton principal. Une fois le volume basculé, WhatsApp redevient
un canal de service client plutôt qu'un canal de commande.

## Multilingue

Le site est en FR / EN / AR via Polylang. TastyIgniter s'installe en anglais ;
le pack français se récupère depuis le marketplace :

```bash
php artisan igniter:language-install fr_FR
php artisan misterjack:seed   # bascule la langue par défaut une fois le pack là
```

La commande de configuration ne force la langue que si le pack est réellement
installé : pas d'interface anglaise étiquetée « français ».

L'arabe reste hors périmètre : le thème fourni n'est pas RTL. Les pages arabes
pointent donc vers la commande française ou anglaise, ce qui vaut mieux qu'une
interface à moitié traduite.

## SEO

- Le sous-domaine n'hérite pas de l'autorité de misterjack.ma, mais les pages
  qui se positionnent (« livraison burger Fès ») restent sur le domaine
  principal : elles gardent leur classement, seul le bouton change de cible.
- Le `Menu` en JSON-LD de la page /menu/ reste valable. Y ajouter un
  `potentialAction` de type `OrderAction` pointant vers
  `https://order.misterjack.ma` renforce le rich result.
- Ne pas bloquer l'indexation du sous-domaine : laisser Google indexer
  `order.misterjack.ma` pour les requêtes de marque.
