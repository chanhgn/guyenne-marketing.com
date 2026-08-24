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

Une seconde adresse GloriaFood existe, dans le menu de navigation sous
CASABLANCA : `https://www.restaurantlogin.com/api/fb/nwne4`. Elle se traite
séparément (voir doc 3), sinon un remplacement de domaine la casse.

Fès, lui, prend ses commandes sur WhatsApp (`wa.me/212660871231`).

## La carte est déjà dans le kit

Inutile d'attendre un export GloriaFood : la carte complète, prix compris, est
publiée sur misterjack.ma/casablanca/#menu. Elle a été relevée et transcrite
dans `data/misterjack.json` — 20 articles, 6 catégories, avec pour chaque
burger et hot-dog le prix seul et le prix en formule.

Le supplément « en menu » n'est pas constant (+15 DH sur le Smash UNO Classic,
+16 sur les Little Italy, +14 sur le Smash Double Classic, +10 sur les Smash
Double garnis). Il est donc porté par une option « Formule » dont le prix est
surchargé article par article, au tarif exact de la carte.

Restent à vérifier avec le client, aucune information n'étant publiée :

- les frais de livraison (15 DH sous 6 km, 25 DH au-delà dans le kit) ;
- les minimums de commande (60 DH et 100 DH) ;
- les horaires de Fès, la page /fes/ et la page menu se contredisant
  (12h–2h contre 11h30–00h avec vendredi et samedi jusqu'à 2h).

Un article dont le prix serait vidé dans le JSON est créé mais **désactivé** :
un burger ne peut pas se retrouver vendu 0 DH par oubli.

## Ce que le kit configure déjà

- Les deux établissements, Fès et Casablanca, en ligne avec leur adresse et
  leur téléphone ;
- les horaires 12h00–02h00 tous les jours, appliqués aux trois types de
  créneaux (ouverture, livraison, retrait) ;
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
2. Vérifier la carte chargée par le kit, puis faire une commande test en
   conditions réelles (retrait et livraison).
3. Laisser tourner les deux systèmes 48 h, GloriaFood restant le lien officiel.
4. Basculer les liens du site (doc 3), en gardant GloriaFood actif une semaine
   en repli — le retour arrière consiste à rejouer le `search-replace` inverse.
5. Résilier GloriaFood une fois une semaine complète encaissée sur TastyIgniter.
