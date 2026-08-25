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

## Géocodage des adresses

Les zones de livraison fonctionnent par géocodage : TastyIgniter convertit
l'adresse saisie par le client en coordonnées, puis regarde dans quelle zone
elle tombe. Deux fournisseurs sont disponibles, Nominatim (OpenStreetMap,
gratuit) et Google Maps.

Deux réglages commandent tout, et se posent depuis la base, pas depuis un
fichier de configuration :

- `default_geocoder` : `nominatim`, `google` ou `chain` (Google d'abord,
  Nominatim en secours). Le kit met `chain`.
- le **pays par défaut de la boutique**, qui fournit la région envoyée au
  géocodeur (`igniter-geocoder.providers.*.region`). Laissé sur la valeur
  d'usine, il fait chercher les adresses marocaines dans un autre pays et le
  géocodage ne renvoie jamais rien. Le kit force le Maroc.

Sur les adresses marocaines, Nominatim reste inégal même bien réglé. Pour une
livraison fiable, prévoir une clé Google Maps Platform :

1. console.cloud.google.com, nouveau projet, facturation activée
   (10 000 appels de géocodage gratuits par mois, très au-dessus du volume
   d'un restaurant) ;
2. activer **Geocoding API** ;
3. créer une clé API, la restreindre par **adresse IP** — celle du serveur,
   car TastyIgniter géocode côté serveur, pas depuis le navigateur — et la
   limiter à Geocoding API ;
4. la coller dans Admin > Système > Réglages > clé API Google Maps.

Le retrait sur place ne dépend d'aucun géocodage : il fonctionne même sans clé
et sans réseau vers OpenStreetMap.

Les coordonnées des deux restaurants sont écrites en dur dans
`data/misterjack.json` pour éviter tout appel au géocodeur pendant
l'installation. Elles sont approximatives : les ajuster sur la carte de l'admin
après l'installation, puisqu'elles définissent le centre des zones de livraison.

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
