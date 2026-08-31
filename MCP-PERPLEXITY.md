# MCP Perplexity

Le serveur MCP officiel de Perplexity est déclaré dans `.mcp.json` (scope projet :
il se charge automatiquement à l'ouverture d'une session Claude Code dans ce dépôt).

## Ce qu'il apporte

Quatre outils : `perplexity_search` (recherche web), `perplexity_ask` (réponse
conversationnelle sourcée), `perplexity_research` (recherche approfondie),
`perplexity_reason` (raisonnement).

## Mise en service

1. **Clé API** — récupérer une clé sur https://www.perplexity.ai/account/api/group
   puis l'exposer sous le nom `PERPLEXITY_API_KEY` :
   - en local : `export PERPLEXITY_API_KEY=pplx-...` dans le shell (ou le `.zshrc`) ;
   - sur Claude Code web : Settings → Environments → variables d'environnement.

   La clé n'est jamais écrite dans le dépôt, `.mcp.json` ne contient qu'une
   référence `${PERPLEXITY_API_KEY}`.

2. **Réseau** — l'hôte `api.perplexity.ai` doit être autorisé par la politique
   d'egress de l'environnement. Sur les environnements Claude Code web restreints
   il est bloqué par défaut : l'ajouter aux domaines autorisés de l'environnement.

3. **Activation** — au prochain démarrage de session dans ce dépôt, Claude Code
   demande d'approuver le serveur MCP du projet. Vérifier ensuite avec `/mcp`
   (ou `claude mcp list` en CLI).

## Variante locale (stdio)

Si l'on préfère faire tourner le serveur en local plutôt qu'en HTTP distant,
remplacer le bloc `perplexity` de `.mcp.json` par :

```json
"perplexity": {
  "command": "npx",
  "args": ["-y", "@perplexity-ai/mcp-server"],
  "env": { "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}" }
}
```

## L'ajouter partout, pas seulement sur ce dépôt

```bash
claude mcp add --scope user --transport http perplexity https://api.perplexity.ai/mcp \
  --header "Authorization: Bearer $PERPLEXITY_API_KEY"
```
