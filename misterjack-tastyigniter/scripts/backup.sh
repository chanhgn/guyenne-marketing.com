#!/usr/bin/env bash
#
# Sauvegarde quotidienne de la plateforme de commande Mister Jack :
# base de données + fichiers téléversés (photos des plats).
#
#   bash scripts/backup.sh
#
# Les identifiants sont lus dans le .env de l'application : ce script ne
# contient aucun secret et peut être versionné tel quel.
#
# Cron hPanel (tous les jours à 4h15) :
#   cd ~/apps/order && bash scripts/backup.sh >> ~/logs/backup.log 2>&1

set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/order}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
NOTIFY_URL="${NOTIFY_URL:-}"   # webhook n8n facultatif

STAMP="$(date +%Y%m%d-%H%M%S)"

log() { printf '[%s] %s\n' "$(date +'%F %T')" "$*"; }

notify() {
    [ -n "$NOTIFY_URL" ] || return 0
    curl -fsS -m 10 -X POST "$NOTIFY_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"source\":\"misterjack-backup\",\"status\":\"$1\",\"message\":\"$2\",\"stamp\":\"$STAMP\"}" \
        >/dev/null 2>&1 || log "Webhook injoignable, on continue."
}

fail() { log "ÉCHEC : $*"; notify failed "$*"; exit 1; }

# Lecture d'une clé du .env sans l'afficher.
env_get() {
    local key="$1"
    local line
    line="$(grep -E "^${key}=" "$APP_DIR/.env" | tail -1)" || return 1
    line="${line#*=}"
    line="${line%\"}"; line="${line#\"}"
    printf '%s' "$line"
}

[ -f "$APP_DIR/.env" ] || fail "Fichier .env introuvable dans $APP_DIR"

DB_DATABASE="$(env_get DB_DATABASE)" || fail "DB_DATABASE absent du .env"
DB_USERNAME="$(env_get DB_USERNAME)" || fail "DB_USERNAME absent du .env"
DB_PASSWORD="$(env_get DB_PASSWORD)" || DB_PASSWORD=""
DB_HOST="$(env_get DB_HOST)" || DB_HOST="localhost"

mkdir -p "$BACKUP_DIR"

log "Sauvegarde de la base $DB_DATABASE"
# Le mot de passe passe par l'environnement, jamais par la ligne de commande
# (visible dans ps par les autres comptes de la machine mutualisée).
MYSQL_PWD="$DB_PASSWORD" mysqldump \
    --host="$DB_HOST" --user="$DB_USERNAME" \
    --single-transaction --quick --default-character-set=utf8mb4 \
    "$DB_DATABASE" | gzip > "$BACKUP_DIR/db-$STAMP.sql.gz" \
    || fail "mysqldump a échoué"

DB_SIZE="$(du -h "$BACKUP_DIR/db-$STAMP.sql.gz" | cut -f1)"

# Une base vide (dump de quelques octets) est un échec silencieux classique.
MIN_BYTES=10240
ACTUAL_BYTES="$(stat -c%s "$BACKUP_DIR/db-$STAMP.sql.gz")"
[ "$ACTUAL_BYTES" -ge "$MIN_BYTES" ] || fail "Dump anormalement petit ($ACTUAL_BYTES octets) : vérifier les droits MySQL"

log "Sauvegarde des fichiers téléversés"
tar -czf "$BACKUP_DIR/files-$STAMP.tar.gz" -C "$APP_DIR" storage/app 2>/dev/null \
    || fail "Archive des fichiers impossible"
FILES_SIZE="$(du -h "$BACKUP_DIR/files-$STAMP.tar.gz" | cut -f1)"

log "Purge des sauvegardes de plus de $RETENTION_DAYS jours"
find "$BACKUP_DIR" -name 'db-*.sql.gz' -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -name 'files-*.tar.gz' -mtime +"$RETENTION_DAYS" -delete

KEPT="$(find "$BACKUP_DIR" -name 'db-*.sql.gz' | wc -l)"
log "Terminé : base $DB_SIZE, fichiers $FILES_SIZE, $KEPT sauvegarde(s) conservée(s)"
notify ok "base $DB_SIZE, fichiers $FILES_SIZE, $KEPT conservées"
