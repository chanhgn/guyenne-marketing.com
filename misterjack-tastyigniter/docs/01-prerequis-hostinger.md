# 1. Prérequis Hostinger

## Ce que le serveur de misterjack.ma offre déjà

Relevé le 24/08/2026 via la connexion WordPress du site :

| Élément | Valeur | TastyIgniter 4.4 exige | Verdict |
|---|---|---|---|
| PHP | 8.3.30 | >= 8.3 | OK |
| Base | MariaDB 11.8.8 | MySQL 5.7+ / MariaDB 10.3+ | OK |
| WordPress | 6.9.7 (Elementor) | — | reste en place |
| Hébergeur | Hostinger (base `u208262002_…`) | — | — |

TastyIgniter n'est **pas** un plugin WordPress : c'est une application Laravel 12
autonome. Elle s'installe à côté du site, sur son propre sous-domaine, avec sa
propre base. Le site WordPress n'est pas modifié, hormis les liens « Commander ».

## À préparer dans hPanel avant de lancer le script

1. **Accès SSH** — hPanel > Avancé > Accès SSH. Disponible sur les offres
   Premium, Business et Cloud. Noter hôte, port, utilisateur.
   Le terminal navigateur de hPanel fonctionne aussi.
2. **Sous-domaine** `order.misterjack.ma` — hPanel > Domaines > Sous-domaines.
   Hostinger crée `~/domains/order.misterjack.ma/public_html`, que le script
   remplace par un lien symbolique vers `public/` de l'application.
3. **Certificat SSL** pour ce sous-domaine — hPanel > Sécurité > SSL.
   À faire avant d'envoyer du trafic : un checkout en HTTP est rédhibitoire.
4. **Base MySQL dédiée** — hPanel > Bases de données MySQL. Créer base +
   utilisateur, noter le mot de passe. Ne pas réutiliser la base WordPress.
5. **Boîte mail** `commandes@misterjack.ma` — hPanel > Emails. Le mot de passe
   va dans `MAIL_PASSWORD`.
6. **Version PHP 8.3** confirmée dans hPanel > PHP Configuration, avec les
   extensions `intl`, `zip`, `gd`, `dom`, `fileinfo`, `mbstring`, `curl`,
   `pdo_mysql`. Le script vérifie et s'arrête si l'une manque.

## Google Maps : le point à ne pas négliger

Les zones de livraison de TastyIgniter fonctionnent par géocodage de l'adresse
du client. Sans clé Google Maps Platform (API Geocoding + Maps JavaScript,
facturation activée), le client ne peut pas être rattaché à une zone et la
livraison est refusée à la commande.

Deux options :
- créer la clé sur Google Cloud, la restreindre au domaine `order.misterjack.ma`,
  et la saisir dans Admin > Système > Réglages > Carte ;
- ou démarrer en **retrait sur place uniquement** (aucune clé nécessaire) et
  activer la livraison ensuite.

## Repli si `composer create-project` échoue

Le squelette TastyIgniter déclare le dépôt `composer.tastyigniter.com`
(marketplace des extensions payantes). S'il est injoignable :

```bash
git clone --depth 1 https://github.com/tastyigniter/TastyIgniter.git ~/apps/order
cd ~/apps/order
php -r '$c=json_decode(file_get_contents("composer.json"),true); unset($c["repositories"]); file_put_contents("composer.json", json_encode($c, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));'
composer install --no-dev --prefer-dist
```

Tout le cœur (`tastyigniter/core` 4.4.1 et les extensions `ti-ext-*`) est publié
sur Packagist : cette variante donne exactement la même installation. C'est
d'ailleurs celle qui a servi à valider ce kit.
