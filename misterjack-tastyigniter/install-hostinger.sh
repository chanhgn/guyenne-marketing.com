#!/usr/bin/env bash
#
# Installe TastyIgniter 4.4 pour Mister Jack sur un hébergement Hostinger.
# À lancer depuis le terminal SSH Hostinger (hPanel > Avancé > Accès SSH),
# ou depuis le terminal navigateur.
#
#   bash install-hostinger.sh
#
# Mode non interactif : renseigner les variables et le script ne pose aucune
# question (utile pour coller une seule commande dans un terminal navigateur).
#
#   DB_DATABASE=… DB_USERNAME=… DB_PASSWORD=… \
#   ADMIN_EMAIL=… ADMIN_PASSWORD=… TACO_EMAIL=… \
#   bash install-hostinger.sh
#
# Le script est idempotent : en cas d'interruption, on peut le relancer.
# Il ne stocke aucun mot de passe : les identifiants MySQL sont demandés
# à l'exécution et écrits uniquement dans le .env du serveur.

set -euo pipefail

KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOMAIN="${DOMAIN:-order.misterjack.ma}"
APP_DIR="${APP_DIR:-$HOME/apps/order}"
DOCROOT="${DOCROOT:-$HOME/domains/$DOMAIN/public_html}"
PHP_BIN="${PHP_BIN:-php}"
MIN_PHP="8.3"

log()  { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m /!\\ %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m ERREUR: %s\033[0m\n' "$*" >&2; exit 1; }

# --- 1. Vérification de l'environnement ------------------------------------

log "Vérification de l'environnement"

command -v "$PHP_BIN" >/dev/null || die "PHP introuvable. Sur Hostinger, essayez PHP_BIN=/usr/bin/php8.3 bash install-hostinger.sh"

PHP_VERSION="$($PHP_BIN -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
if [ "$(printf '%s\n%s\n' "$MIN_PHP" "$PHP_VERSION" | sort -V | head -1)" != "$MIN_PHP" ]; then
    die "PHP $PHP_VERSION détecté, TastyIgniter 4.4 exige PHP >= $MIN_PHP. Changez la version PHP dans hPanel."
fi
echo "PHP $PHP_VERSION OK"

MISSING=""
for ext in dom fileinfo intl json zip mbstring curl pdo_mysql gd openssl tokenizer xml; do
    $PHP_BIN -m | grep -qix "$ext" || MISSING="$MISSING $ext"
done
[ -z "$MISSING" ] || die "Extensions PHP manquantes :$MISSING (à activer dans hPanel > PHP Configuration)"
echo "Extensions PHP OK"

# Sur mutualisé, le PHP de la ligne de commande est souvent plus ancien que
# celui du site (Hostinger : 8.2 en CLI, 8.3 sur le web). Composer lancé nu
# hériterait du vieux PHP et échouerait sur la contrainte de plateforme, avec
# un message peu parlant. On l'invoque donc explicitement avec $PHP_BIN.
if [ -n "${COMPOSER:-}" ]; then
    echo "Composer imposé : $COMPOSER"
elif COMPOSER_PHAR="$(command -v composer 2>/dev/null)"; then
    COMPOSER="$PHP_BIN $COMPOSER_PHAR"
else
    warn "Composer absent du PATH, installation locale dans $HOME/bin"
    mkdir -p "$HOME/bin"
    $PHP_BIN -r "copy('https://getcomposer.org/installer', '/tmp/composer-setup.php');"
    $PHP_BIN /tmp/composer-setup.php --install-dir="$HOME/bin" --filename=composer
    rm -f /tmp/composer-setup.php
    COMPOSER="$PHP_BIN $HOME/bin/composer"
fi
echo "Composer : $($COMPOSER --version 2>/dev/null | head -1)"

# Contrôle explicite : le PHP vu par Composer est celui qui compte.
COMPOSER_PHP="$($COMPOSER show --platform 2>/dev/null | awk '$1=="php"{print $2; exit}')"
if [ -n "$COMPOSER_PHP" ]; then
    echo "Composer tourne sur PHP $COMPOSER_PHP"
    if [ "$(printf '%s\n%s\n' "$MIN_PHP" "$COMPOSER_PHP" | sort -V | head -1)" != "$MIN_PHP" ]; then
        die "Composer tourne sur PHP $COMPOSER_PHP, TastyIgniter exige >= $MIN_PHP. Relancez avec PHP_BIN pointant sur un PHP $MIN_PHP+."
    fi
fi

# --- 2. Récupération des identifiants MySQL --------------------------------
# Base à créer au préalable dans hPanel > Bases de données MySQL.

log "Identifiants de la base de données (hPanel > Bases de données MySQL)"

[ -n "${DB_DATABASE:-}" ] || read -rp "Nom de la base   : " DB_DATABASE
[ -n "${DB_USERNAME:-}" ] || read -rp "Utilisateur      : " DB_USERNAME
if [ -z "${DB_PASSWORD:-}" ]; then
    read -rsp "Mot de passe     : " DB_PASSWORD; echo
fi
DB_HOST="${DB_HOST:-localhost}"

# mysqli lève des exceptions par défaut depuis PHP 8.1 : sans ce report_off,
# un mauvais mot de passe crache une trace fatale au lieu du message.
$PHP_BIN -r '
mysqli_report(MYSQLI_REPORT_OFF);
$c = @mysqli_connect($argv[1], $argv[2], $argv[3], $argv[4]);
if (!$c) { fwrite(STDERR, "Connexion MySQL refusee: ".mysqli_connect_error()."\n"); exit(1); }
echo "Connexion MySQL OK\n";
' "$DB_HOST" "$DB_USERNAME" "$DB_PASSWORD" "$DB_DATABASE" || die "Identifiants MySQL invalides (verifier base, utilisateur, mot de passe dans hPanel)"

# --- 3. Installation du code ------------------------------------------------

log "Installation de TastyIgniter dans $APP_DIR"

if [ -f "$APP_DIR/artisan" ]; then
    echo "Installation existante détectée, mise à jour des dépendances"
    (cd "$APP_DIR" && $COMPOSER install --no-dev --no-interaction --prefer-dist)
else
    mkdir -p "$(dirname "$APP_DIR")"
    # Le dépôt composer.tastyigniter.com sert le marketplace (extensions/thèmes
    # payants). S'il est injoignable, tout le coeur reste disponible sur Packagist.
    $COMPOSER create-project tastyigniter/tastyigniter "$APP_DIR" --no-dev --no-interaction --prefer-dist \
        || die "Échec de composer create-project. Réessayez, ou voyez docs/01-prerequis-hostinger.md (repli Packagist)."
fi

# --- 4. Configuration .env --------------------------------------------------

log "Configuration de l'application"

cd "$APP_DIR"
[ -f .env ] || cp .env.example .env

set_env() {
    local key="$1" value="$2"
    if grep -q "^${key}=" .env; then
        $PHP_BIN -r '
        $f = ".env"; $k = $argv[1]; $v = $argv[2];
        $s = preg_replace("/^".preg_quote($k, "/")."=.*$/m", $k."=".$v, file_get_contents($f));
        file_put_contents($f, $s);
        ' "$key" "$value"
    else
        printf '%s=%s\n' "$key" "$value" >> .env
    fi
}

set_env APP_NAME '"Mister Jack"'
set_env APP_ENV production
set_env APP_DEBUG false
set_env APP_URL "https://$DOMAIN"
set_env IGNITER_LOCATION_MODE multiple
set_env DB_CONNECTION mysql
set_env DB_HOST "$DB_HOST"
set_env DB_PORT 3306
set_env DB_DATABASE "$DB_DATABASE"
set_env DB_USERNAME "$DB_USERNAME"
set_env DB_PASSWORD "$DB_PASSWORD"
set_env DB_PREFIX ti_
set_env MAIL_MAILER smtp
set_env MAIL_FROM_ADDRESS "commandes@misterjack.ma"

grep -q '^APP_KEY=base64' .env || $PHP_BIN artisan key:generate --force

chmod 600 .env

# --- 5. Migrations et données de base ---------------------------------------

log "Création des tables TastyIgniter"

$PHP_BIN artisan igniter:install --no-interaction --force

# --- 5b. Fichiers du kit Mister Jack ----------------------------------------

log "Copie des fichiers Mister Jack"

mkdir -p "$APP_DIR/app/Console/Commands" "$APP_DIR/app/Providers" "$APP_DIR/app/Support" "$APP_DIR/data" "$APP_DIR/scripts"
cp "$KIT_DIR"/app/Console/Commands/*.php "$APP_DIR/app/Console/Commands/"
cp "$KIT_DIR"/app/Providers/*.php "$APP_DIR/app/Providers/"
cp "$KIT_DIR"/app/Support/*.php "$APP_DIR/app/Support/"
cp "$KIT_DIR"/data/*.json "$APP_DIR/data/"
cp "$KIT_DIR"/scripts/*.sh "$APP_DIR/scripts/"
chmod +x "$APP_DIR"/scripts/*.sh
mkdir -p "$APP_DIR/public/brand"
cp "$KIT_DIR"/public/brand/*.css "$APP_DIR/public/brand/"
echo "Commandes, données, scripts et habillage en place"

# --- 5c. Compte administrateur ----------------------------------------------
# Sans administrateur, TastyIgniter redirige toute la boutique vers /admin.

log "Création du compte administrateur"

if [ "$($PHP_BIN artisan tinker --execute='echo \Igniter\User\Models\User::count();' 2>/dev/null | tail -1)" = "0" ]; then
    if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
        $PHP_BIN artisan misterjack:admin \
            --email="$ADMIN_EMAIL" \
            --name="${ADMIN_NAME:-Mister Jack}" \
            --username="${ADMIN_USERNAME:-admin}" \
            --password="$ADMIN_PASSWORD"
    else
        $PHP_BIN artisan misterjack:admin
    fi
else
    echo "Un administrateur existe déjà, étape ignorée"
fi

# --- 5d. Données Mister Jack ------------------------------------------------

log "Chargement de la carte, des établissements et des horaires"

$PHP_BIN artisan misterjack:seed

# --- 5d bis. Charte graphique -----------------------------------------------
# Couleurs et polices de misterjack.ma : elles passent par les réglages du
# thème, puis app.css est recompilé. Rien n'est modifié dans vendor/.

log "Application de la charte Mister Jack"

$PHP_BIN artisan misterjack:brand

# --- 5e. Traduction française -----------------------------------------------
# Le pack passe par le marketplace TastyIgniter : si le serveur ne l'atteint
# pas, l'interface reste en anglais et se traduit plus tard, sans bloquer.

log "Installation de la traduction française"

$PHP_BIN artisan igniter:language-install fr_FR 2>/dev/null \
    || warn "Pack français non installé (marketplace injoignable). À relancer plus tard : php artisan igniter:language-install"

# --- 6. Racine web ----------------------------------------------------------
# Laravel expose uniquement public/. On pointe la racine du sous-domaine
# dessus par un lien symbolique : rien d'autre n'est accessible depuis le web.

log "Branchement du sous-domaine $DOMAIN"

if [ -L "$DOCROOT" ]; then
    echo "Lien symbolique déjà en place"
elif [ -d "$DOCROOT" ]; then
    if [ -n "$(ls -A "$DOCROOT" 2>/dev/null)" ]; then
        mv "$DOCROOT" "${DOCROOT}.backup-$(date +%Y%m%d%H%M%S)"
        echo "Ancien contenu de la racine web sauvegardé"
    else
        rmdir "$DOCROOT"
    fi
    ln -s "$APP_DIR/public" "$DOCROOT"
else
    mkdir -p "$(dirname "$DOCROOT")"
    ln -s "$APP_DIR/public" "$DOCROOT"
fi

$PHP_BIN artisan storage:link 2>/dev/null || true
chmod -R 755 storage bootstrap/cache
$PHP_BIN artisan optimize:clear >/dev/null

# --- 7. Jeton API pour l'application de cuisine TaCo -------------------------

log "Jeton API pour TaCo (application mobile de réception des commandes)"

TACO_EMAIL="${TACO_EMAIL:-${ADMIN_EMAIL:-}}"
if [ -z "$TACO_EMAIL" ]; then
    read -rp "E-mail de l'administrateur pour le jeton TaCo (vide pour passer) : " TACO_EMAIL
fi
if [ -n "$TACO_EMAIL" ]; then
    $PHP_BIN artisan igniter:api-token --name="TaCo cuisine" --email="$TACO_EMAIL" --admin \
        || warn "Jeton non émis : vérifier l'adresse. Relançable à tout moment."
    echo "À saisir dans TaCo avec l'URL https://$DOMAIN"
fi

# --- 8. Suite ---------------------------------------------------------------

cat <<EOF

============================================================
 TastyIgniter installé : https://$DOMAIN
============================================================

Étapes suivantes, dans l'ordre :

 1. Ajouter les tâches planifiées dans hPanel > Tâches Cron :

    Toutes les minutes — paniers, statuts, relances :
      cd $APP_DIR && $PHP_BIN artisan schedule:run >/dev/null 2>&1

    Tous les jours à 4h15 — sauvegarde base + fichiers, 14 jours d'historique :
      cd $APP_DIR && bash scripts/backup.sh >> \$HOME/logs/backup.log 2>&1

    Lundi 5h00 — mise à jour avec sauvegarde et restauration automatique :
      cd $APP_DIR && bash scripts/update.sh >> \$HOME/logs/update.log 2>&1

 2. Ouvrir https://$DOMAIN/admin et vérifier :
    - le point GPS de chaque restaurant sur la carte (il définit le centre
      des zones de livraison, les coordonnées du kit sont approximatives) ;
    - les horaires (12h00 – 02h00 tous les jours) ;
    - le SMTP d'envoi des mails de commande.

 3. Installer TaCo sur le téléphone ou la tablette de la cuisine
    (App Store / Google Play), la connecter avec l'URL et le jeton
    ci-dessus, et vérifier qu'une commande test déclenche la notification.

 4. Passer une commande test en paiement à la livraison, en retrait
    puis en livraison, avant de rediriger le trafic depuis misterjack.ma
    (voir docs/03-integration-wordpress.md).

EOF
