# Mister Jack — remplacement de GloriaFood par TastyIgniter

Kit de déploiement d'une plateforme de commande en ligne autonome pour
Mister Jack (burgers & hot-dogs, Fès + Casablanca), en remplacement de
GloriaFood.

## Pourquoi maintenant

Oracle a arrêté les inscriptions à GloriaFood et fixé la fin de service au
**31 mars 2027** ([annonce Oracle](https://www.oracle.com/corporate/acquisitions/gloriafood/)).
Le site misterjack.ma envoie aujourd'hui toutes ses commandes vers l'interface
GloriaFood (`restaurantlogin.com`) : 259 liens sur le site. La migration n'est
pas optionnelle, autant la faire vers une solution qui n'appartient à personne
d'autre.

## Pourquoi TastyIgniter

- Open source (MIT), auto-hébergé : 0 % de commission, données et clients chez
  le restaurant, pas de fin de service décidée par un tiers.
- Paiement à la livraison natif — le mode de paiement dominant au Maroc, là où
  Stripe n'opère pas.
- Multi-établissements, zones de livraison, horaires, retrait sur place,
  réservations : le périmètre GloriaFood est couvert.
- Tourne sur l'hébergement Hostinger déjà en place (PHP 8.3.30, MariaDB 11.8).

Contrepartie, dite franchement : c'est une application Laravel à maintenir
(mises à jour, sauvegardes), et il n'existe pas d'app tablette avec sonnerie
comme chez GloriaFood — voir `docs/04-exploitation.md` pour les trois
alternatives, dont une notification WhatsApp via n8n.

## Ce qui a été validé

Installation réellement montée et testée en bac à sable avant livraison :

- TastyIgniter 4.4.1 / Laravel 12.67 / PHP 8.4 / MariaDB, installé depuis
  Packagist, `igniter:install` passé, tables créées ;
- `misterjack:seed` exécuté : devise MAD, établissement Fès en ligne,
  Casablanca hors ligne faute d'adresse, 4 catégories, 9 articles, 5 zones de
  livraison, 42 créneaux horaires, paiement à la livraison seul actif ;
- commande relancée deux fois : aucun doublon (idempotence vérifiée) ;
- boutique servie en HTTP 200, page `/fes/menus` affichant les articles aux
  prix en dirhams (`45,00DH`).

## Contenu du kit

```
install-hostinger.sh              Script d'installation, à lancer en SSH Hostinger
env/.env.production.example       Modèle de configuration serveur
app/Console/Commands/SeedMisterJack.php   Commande artisan de chargement des données
data/misterjack.json              Données Mister Jack (prix à compléter)
docs/01-prerequis-hostinger.md    Ce qu'il faut préparer dans hPanel
docs/02-migration-gloriafood.md   Récupération de la carte, ordre de bascule
docs/03-integration-wordpress.md  Remplacement des 259 liens sur misterjack.ma
docs/04-exploitation.md           Cuisine, crons, sauvegardes, mises à jour, coûts
```

## Marche à suivre

1. Préparer hPanel : SSH, sous-domaine `order.misterjack.ma`, SSL, base MySQL,
   boîte mail (`docs/01-prerequis-hostinger.md`).
2. Envoyer ce dossier sur le serveur et lancer :
   ```bash
   bash install-hostinger.sh
   ```
3. Ouvrir `https://order.misterjack.ma/admin`, compléter l'assistant qui crée
   le compte administrateur.
4. Copier `data/` et `app/Console/Commands/SeedMisterJack.php` dans
   l'application, puis :
   ```bash
   php artisan misterjack:seed
   ```
5. Compléter les prix depuis l'export GloriaFood et relancer la commande.
6. Commande test en paiement à la livraison, puis bascule des liens du site
   (`docs/03-integration-wordpress.md`).

## Ce qui reste à obtenir du client

- Les **prix** de la carte (export GloriaFood) — sans eux les articles restent
  masqués, c'est volontaire.
- L'**adresse, le téléphone et les coordonnées GPS** du restaurant de
  Casablanca — l'établissement reste hors ligne tant qu'ils manquent.
- Une **clé Google Maps Platform**, sinon la livraison par adresse ne peut pas
  être contrôlée (le retrait sur place fonctionne sans).
- Les **coordonnées GPS exactes** du restaurant de Fès : celles du kit sont
  approximatives (`coords_verified: false`) et doivent être ajustées sur la
  carte de l'admin, car elles définissent le centre des zones de livraison.
