# Mister Jack — remplacement de GloriaFood par TastyIgniter

Kit de déploiement d'une plateforme de commande en ligne autonome pour
Mister Jack (burgers & hot-dogs, Fès + Casablanca), sur
`order.misterjack.ma`.

## Pourquoi maintenant

Oracle a arrêté les inscriptions à GloriaFood et fixé la fin de service au
**31 mars 2027** ([annonce Oracle](https://www.oracle.com/corporate/acquisitions/gloriafood/)).
Le site misterjack.ma envoie aujourd'hui ses commandes vers GloriaFood
(`restaurantlogin.com`) : 259 liens, plus une entrée de menu séparée pour
Casablanca. La migration n'est pas optionnelle, autant la faire vers une
solution qui n'appartient à personne d'autre.

## Pourquoi TastyIgniter

- Open source (MIT), auto-hébergé : 0 % de commission, données et clients chez
  le restaurant, pas de fin de service décidée par un tiers.
- Paiement à la livraison natif — le mode de paiement dominant au Maroc, là où
  Stripe n'opère pas.
- Multi-établissements, zones de livraison, horaires, retrait, réservations.
- Application cuisine : **TaCo** (iOS/Android), notifications push sur nouvelle
  commande et impression ESC-POS.
- Tourne sur l'hébergement Hostinger déjà en place (PHP 8.3.30, MariaDB 11.8).

## Ce qui a été monté et vérifié

Installation réelle en bac à sable avant livraison — pas une procédure
théorique :

| Vérification | Résultat |
|---|---|
| Installation | TastyIgniter 4.4.1 / Laravel 12.67 / PHP 8.4 / MariaDB, depuis Packagist |
| Carte | 20 articles, 6 catégories, prix en dirhams conformes au site |
| Formules | supplément « en menu » au prix exact de chaque article (+15, +16, +14, +10 DH) |
| Établissements | Fès et Casablanca en ligne, 12h00–02h00, 4 zones de livraison |
| Boutique | `/fes/menus` en HTTP 200, carte affichée en `45,00DH` |
| Idempotence | commande de configuration rejouée 3 fois, aucun doublon |
| API TaCo | jeton émis, `/api/orders`, `/api/locations`, `/api/menus` en HTTP 200 |
| Sauvegarde | dump restauré : 32 articles et 4 zones intacts |
| Mise à jour | chemin nominal (site en ligne) et échec simulé (base restaurée, site laissé en maintenance) |

## Contenu du kit

```
install-hostinger.sh                       Installation complète, à lancer en SSH
env/.env.production.example                Modèle de configuration serveur
app/Console/Commands/SeedMisterJack.php    Carte, établissements, horaires, zones
app/Console/Commands/CreateMisterJackAdmin.php  Compte administrateur
app/Console/Commands/BrandMisterJack.php   Charte graphique du thème
app/Providers/AppServiceProvider.php       Clé Google côté serveur + habillage
data/misterjack.json                       Données Mister Jack relevées sur le site
data/theme-misterjack.json                 Couleurs et polices de misterjack.ma
public/brand/misterjack.css                Finitions du front (titres, boutons)
scripts/backup.sh                          Sauvegarde quotidienne base + fichiers
scripts/update.sh                          Mise à jour surveillée avec restauration
docs/01-prerequis-hostinger.md             Ce qu'il faut préparer dans hPanel
docs/02-migration-gloriafood.md            Ordre de bascule
docs/03-integration-wordpress.md           Remplacement des liens sur misterjack.ma
docs/04-exploitation.md                    TaCo, crons, sauvegardes, mises à jour, coûts
docs/05-charte-graphique.md                Couleurs du site, où les changer
```

## Marche à suivre

1. Préparer hPanel : accès SSH, sous-domaine `order.misterjack.ma`, SSL, base
   MySQL, boîte mail (`docs/01-prerequis-hostinger.md`).
2. Envoyer ce dossier sur le serveur, puis :
   ```bash
   bash install-hostinger.sh
   ```
   Le script vérifie PHP et ses extensions, installe TastyIgniter, écrit le
   `.env`, crée les tables, copie les fichiers du kit, crée l'administrateur,
   charge la carte, applique la charte graphique, branche le sous-domaine et
   émet le jeton TaCo.
3. Ajouter les trois tâches cron affichées en fin d'installation.
4. Ajuster le point GPS de chaque restaurant sur la carte de l'admin.
5. Connecter TaCo, passer une commande test en paiement à la livraison.
6. Basculer les liens du site (`docs/03-integration-wordpress.md`).

## Points ouverts

- **Coordonnées GPS** des deux restaurants : approximatives dans le kit, à
  ajuster sur la carte de l'admin — elles définissent le centre des zones de
  livraison.
- **Horaires de Fès** : la page /fes/ annonce 12h–2h tous les jours, la page
  menu 11h30–00h avec vendredi et samedi jusqu'à 2h. Le kit retient 12h–2h,
  à confirmer avec le client.
- **Frais de livraison** (15 DH sous 6 km, 25 DH au-delà) et **minimums de
  commande** (60 / 100 DH) : valeurs de départ, aucune information publiée sur
  le site. À valider avant la mise en ligne.
- **Pack de langue française** : il se télécharge depuis le marketplace
  TastyIgniter, injoignable depuis le bac à sable. À vérifier au premier
  lancement sur le serveur.
