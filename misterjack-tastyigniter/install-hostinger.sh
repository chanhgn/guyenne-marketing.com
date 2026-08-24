#!/usr/bin/env bash
#
# Installe TastyIgniter 4.4 pour Mister Jack sur un hébergement Hostinger.
# À lancer depuis le terminal SSH Hostinger (hPanel > Avancé > Accès SSH),
# ou depuis le terminal navigateur.
#
#   bash install-hostinger.sh
#
# Le script est idempotent : en cas d'interruption, on peut le relancer.
# Il ne stocke aucun mot de passe : les identifiants MySQL sont demandés
# à l'exécution et écrits uniquement dans le .env du serveur.

set -euo pipefail

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

if command -v composer >/dev/null; then
    COMPOSER="composer"
else
    warn "Composer absent du PATH, installation locale dans $HOME/bin"
    mkdir -p "$HOME/bin"
    $PHP_BIN -r "copy('https://getcomposer.org/installer', '/tmp/composer-setup.php');"
    $PHP_BIN /tmp/composer-setup.php --install-dir="$HOME/bin" --filename=composer
    rm -f /tmp/composer-setup.php
    COMPOSER="$HOME/bin/composer"
fi
echo "Composer : $($COMPOSER --version 2>/dev/null | head -1)"

# --- 2. Récupération des identifiants MySQL --------------------------------
# Base à créer au préalable dans hPanel > Bases de données MySQL.

log "Identifiants de la base de données (hPanel > Bases de données MySQL)"

read -rp "Nom de la base   : " DB_DATABASE
read -rp "Utilisateur      : " DB_USERNAME
read -rsp "Mot de passe     : " DB_PASSWORD; echo
DB_HOST="${DB_HOST:-localhost}"

$PHP_BIN -r '
$c = @mysqli_connect($argv[1], $argv[2], $argv[3], $argv[4]);
if (!$c) { fwrite(STDERR, "Connexion MySQL refusee: ".mysqli_connect_error()."\n"); exit(1); }
echo "Connexion MySQL OK\n";
' "$DB_HOST" "$DB_USERNAME" "$DB_PASSWORD" "$DB_DATABASE" || die "Identifiants MySQL invalides"

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

# --- 7. Suite ---------------------------------------------------------------

cat <<EOF

============================================================
 TastyIgniter installé : https://$DOMAIN
============================================================

Étapes suivantes, dans l'ordre :

 1. Ouvrir https://$DOMAIN/admin et compléter l'assistant
    « Initial Setup » : il crée le compte administrateur.
    (Sans ce compte, la boutique redirige vers /admin.)

 2. Charger les données Mister Jack :
      cd $APP_DIR
      cp -r <kit>/data data
      cp -r <kit>/app/Console/Commands/SeedMisterJack.php app/Console/Commands/
      $PHP_BIN artisan misterjack:seed

 3. Ajouter le cron dans hPanel > Tâches Cron (toutes les minutes) :
      cd $APP_DIR && $PHP_BIN artisan schedule:run >/dev/null 2>&1

 4. Renseigner la clé Google Maps dans l'admin
    (Système > Réglages > Carte) : sans elle, le contrôle des zones
    de livraison par adresse ne fonctionne pas.

 5. Passer une commande test en paiement à la livraison avant
    de rediriger le trafic depuis misterjack.ma.

EOF
