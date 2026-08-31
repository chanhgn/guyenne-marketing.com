#!/usr/bin/env bash
# Vérificateur du standard 20 points — points mécaniquement contrôlables.
# Usage : bash verif-site.sh https://exemple.fr [--max 25]
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage : bash verif-site.sh https://exemple.fr [--max 25]" >&2
  exit 1
fi

command -v python3 >/dev/null || { echo "python3 requis" >&2; exit 1; }

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "$DIR/verif_site.py" "$@"
