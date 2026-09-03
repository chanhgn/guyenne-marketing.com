# Workflow hebdomadaire — Article + diffusion réseaux

**ID n8n** : `Pvm3De9WiyZn64gG`
**Nom** : Kobo-Alu — Article hebdo + diffusion réseaux
**Déclencheur** : chaque mardi 8h (Europe/Paris via `$now.setZone`), 1×/semaine
**Sécurité** : `DRY_RUN=true` par défaut dans le node `Config`. Aucune écriture réelle tant que non basculé sur `false`.

## Chaîne de nodes (27)
Chaque mardi 8h → Config → Sujet de la semaine → Articles existants → Vérifier doublon
→ Doublon ?
  - onTrue → Telegram doublon
  - onFalse → Préparer prompt → Rédiger Claude → Valider article → Valide ?
      - onFalse → Telegram invalide
      - onTrue → Générer image → Attendre image (45s) → Résultat image → Image prête
          → Télécharger image → Upload WP media → Préparer article WP → Créer article WP
          → Préparer metas → Écrire metas RM → Posts Metricool → Publier Metricool
          → Récap → Telegram récap

## Sélection du sujet
Plan éditorial 52 semaines embarqué (pipe-délimité) dans le jsCode « Sujet de la semaine ».
Sélection par numéro de semaine ISO ; fallback modulo si hors plage.

## Credentials à attacher en UI (obligatoire — MCP ne lie pas auto)
9 nodes HTTP Request :
| Node | Credential |
|------|-----------|
| Articles existants | WordPress kobo-alu.fr (Basic Auth) |
| Rédiger Claude | Anthropic API (Header Auth, `x-api-key`) — **à créer** |
| Générer image | Freepik API (Header) |
| Résultat image | Freepik API (Header) |
| Télécharger image | — (URL publique, aucune) |
| Upload WP media | WordPress kobo-alu.fr (Basic Auth) |
| Créer article WP | WordPress kobo-alu.fr (Basic Auth) |
| Écrire metas RM | WordPress kobo-alu.fr (Basic Auth) |
| Publier Metricool | Metricool (Header, `X-Mc-Auth`) |

Les 3 nodes Telegram sont auto-liés à la création.

## Test
1. Attacher les credentials ci-dessus.
2. Créer la credential Anthropic (Header Auth : nom `x-api-key`, valeur = clé).
3. Laisser `DRY_RUN=true`, exécuter manuellement → vérifie génération article + image + payloads Metricool sans publier.
4. Basculer `DRY_RUN=false` seulement après validation du rendu.

## Paramètres Config
- `blogId` 4246977, `userId` 1574158 (Metricool)
- `timezone` Europe/Madrid (planif Metricool)
- `chatId` 908554624 (Telegram)
