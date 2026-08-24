#!/usr/bin/env bash
#
# Mise à jour de TastyIgniter avec sauvegarde, contrôle de santé et
# restauration automatique si la boutique ne répond plus.
#
#   bash scripts/update.sh
#
# Déroulé : sauvegarde -> maintenance -> mise à jour -> migrations ->
# contrôle HTTP -> sortie de maintenance. Si le contrôle échoue, l'ancienne
# version des dépendances et la base sont restaurées, puis le site est remis
# en ligne ; si la restauration elle-même échoue, le site RESTE en maintenance
# plutôt que de servir une boutique cassée.
#
# Cron hPanel (lundi 5h00, hors service) :
#   cd ~/apps/order && bash scripts/update.sh >> ~/logs/update.log 2>&1

set -uo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/order}"
PHP_BIN="${PHP_BIN:-php}"
COMPOSER="${COMPOSER:-composer}"
HEALTH_URL="${HEALTH_URL:-https://order.misterjack.ma}"
NOTIFY_URL="${NOTIFY_URL:-}"

STAMP="$(date +%Y%m%d-%H%M%S)"
LOCK_BACKUP="$BACKUP_DIR/composer.lock-$STAMP"

log() { printf '[%s] %s\n' "$(date +'%F %T')" "$*"; }

notify() {
    [ -n "$NOTIFY_URL" ] || return 0
    curl -fsS -m 10 -X POST "$NOTIFY_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"source\":\"misterjack-update\",\"status\":\"$1\",\"message\":\"$2\",\"stamp\":\"$STAMP\"}" \
        >/dev/null 2>&1 || true
}

cd "$APP_DIR" || { log "Répertoire $APP_DIR introuvable"; exit 1; }

# --- 1. Sauvegarde préalable ------------------------------------------------

log "Sauvegarde avant mise à jour"
if ! bash "$APP_DIR/scripts/backup.sh"; then
    log "ABANDON : pas de mise à jour sans sauvegarde valide."
    notify aborted "sauvegarde préalable en échec"
    exit 1
fi

DB_DUMP="$(find "$BACKUP_DIR" -name 'db-*.sql.gz' -newermt '-10 minutes' | sort | tail -1)"
[ -n "$DB_DUMP" ] || { log "ABANDON : dump introuvable"; notify aborted "dump introuvable"; exit 1; }
cp composer.lock "$LOCK_BACKUP"

# --- 2. Mise à jour ---------------------------------------------------------

log "Passage en maintenance"
$PHP_BIN artisan down --render="errors::503" >/dev/null 2>&1 || true

log "Mise à jour des dépendances"
UPDATE_OK=1
$COMPOSER update --no-dev --no-interaction --prefer-dist || UPDATE_OK=0

if [ "$UPDATE_OK" = "1" ]; then
    log "Migrations TastyIgniter"
    $PHP_BIN artisan igniter:update --force || UPDATE_OK=0
fi

$PHP_BIN artisan optimize:clear >/dev/null 2>&1 || true

# --- 3. Contrôle de santé ---------------------------------------------------
# On sort de maintenance avant de tester : sinon la page renvoie 503 par
# construction et le contrôle ne veut rien dire.

log "Sortie de maintenance"
$PHP_BIN artisan up >/dev/null 2>&1 || true

HEALTH=0
if [ "$UPDATE_OK" = "1" ]; then
    for attempt in 1 2 3; do
        CODE="$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$HEALTH_URL" 2>/dev/null)"; CODE="${CODE:-000}"
        log "Contrôle HTTP $attempt : $CODE"
        [ "$CODE" = "200" ] && { HEALTH=1; break; }
        sleep 10
    done
fi

if [ "$UPDATE_OK" = "1" ] && [ "$HEALTH" = "1" ]; then
    VERSION="$($PHP_BIN artisan --version 2>/dev/null | tail -1)"
    log "Mise à jour réussie ($VERSION)"
    notify ok "mise à jour appliquée, boutique en ligne"
    rm -f "$LOCK_BACKUP"
    exit 0
fi

# --- 4. Restauration --------------------------------------------------------

log "Boutique KO après mise à jour : restauration de la version précédente"
$PHP_BIN artisan down --render="errors::503" >/dev/null 2>&1 || true

RESTORE_OK=1
cp "$LOCK_BACKUP" composer.lock || RESTORE_OK=0
$COMPOSER install --no-dev --no-interaction --prefer-dist || RESTORE_OK=0

env_get() {
    local line; line="$(grep -E "^$1=" "$APP_DIR/.env" | tail -1)" || return 1
    line="${line#*=}"; line="${line%\"}"; line="${line#\"}"; printf '%s' "$line"
}
DB_DATABASE="$(env_get DB_DATABASE)"; DB_USERNAME="$(env_get DB_USERNAME)"
DB_PASSWORD="$(env_get DB_PASSWORD)"; DB_HOST="$(env_get DB_HOST)"

log "Restauration de la base depuis $DB_DUMP"
gunzip -c "$DB_DUMP" | MYSQL_PWD="$DB_PASSWORD" mysql --host="${DB_HOST:-localhost}" \
    --user="$DB_USERNAME" --default-character-set=utf8mb4 "$DB_DATABASE" || RESTORE_OK=0

$PHP_BIN artisan optimize:clear >/dev/null 2>&1 || true
$PHP_BIN artisan up >/dev/null 2>&1 || true

CODE="$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$HEALTH_URL" 2>/dev/null)"; CODE="${CODE:-000}"
if [ "$RESTORE_OK" = "1" ] && [ "$CODE" = "200" ]; then
    log "Version précédente restaurée, boutique en ligne (HTTP $CODE)"
    notify rolled_back "mise à jour annulée, version précédente restaurée"
    exit 1
fi

$PHP_BIN artisan down --render="errors::503" >/dev/null 2>&1 || true
log "RESTAURATION INCOMPLÈTE (HTTP $CODE) : le site reste en maintenance."
log "Sauvegardes disponibles : $DB_DUMP et $LOCK_BACKUP"
notify broken "restauration incomplète, site en maintenance, intervention requise"
exit 2
