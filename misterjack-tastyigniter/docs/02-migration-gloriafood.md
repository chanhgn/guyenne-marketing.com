# 2. Migration depuis GloriaFood

## Situation actuelle

misterjack.ma envoie aujourd'hui les commandes vers GloriaFood, via son
interface hébergée :

```
https://www.restaurantlogin.com/ordering/restaurant/menu?company_uid=66c8a792-808f-41f7-943e-5fbafc422138
```

Ce lien est présent partout sur le site (relevé du 24/08/2026) :

| Emplacement | Occurrences |
|---|---|
| Contenu des pages (`wp_posts`) | 179 |
| Données Elementor (`wp_postmeta`) | 80 pages |
| Options du thème (`wp_options`) | 1 |

## Récupérer la carte depuis GloriaFood

GloriaFood n'expose pas d'API publique d'export. La carte se récupère depuis
l'admin :

1. Se connecter sur admin.gloriafood.com avec le compte Mister Jack.
2. Menu > *Export menu* (CSV), ou à défaut recopier catégories, articles,
   prix, options et suppléments.
3. Reporter les prix dans `data/misterjack.json`, champ `price` de chaque
   article (en dirhams, ex. `45`).
4. Relancer `php artisan misterjack:seed` : les articles renseignés passent
   en ligne, les autres restent masqués.

Tant qu'un prix vaut `null`, l'article est créé mais **désactivé** — un burger
ne peut pas se retrouver vendu 0 DH par oubli.

## Ce que le kit configure déjà

- Les deux établissements (Fès en ligne, Casablanca hors ligne tant que
  l'adresse manque) ;
- les horaires : 11h30–00h00, vendredi et samedi jusqu'à 02h00, appliqués aux
  trois types de créneaux (ouverture, livraison, retrait) ;
- les zones de livraison en cercles autour du restaurant, avec frais et
  minimum de commande par zone ;
- le dirham marocain comme devise par défaut ;
- le paiement à la livraison seul actif.

## Ce qui ne se migre pas

- **L'historique des commandes** GloriaFood n'est pas exportable proprement :
  il reste consultable dans leur admin, à conserver le temps de la bascule.
- **La base clients** : à exporter côté GloriaFood si elle existe (Marketing >
  Customers), puis à importer dans TastyIgniter (Utilisateurs > Clients).
- **Les photos des plats** : à re-téléverser dans la médiathèque TastyIgniter.

## Ordre de bascule recommandé

1. Installer et configurer TastyIgniter sur `order.misterjack.ma` (docs 1 et 3).
2. Saisir toute la carte, faire une commande test en conditions réelles.
3. Laisser tourner les deux systèmes 48 h, GloriaFood restant le lien officiel.
4. Basculer les liens du site (doc 3), en gardant GloriaFood actif une semaine
   en repli — le retour arrière consiste à rejouer le `search-replace` inverse.
5. Résilier GloriaFood une fois une semaine complète encaissée sur TastyIgniter.
