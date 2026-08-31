# Installer le skill `site-web-complet`

Le skill est un dossier autonome : `SKILL.md` + `references/` + `assets/` + `scripts/`.

## 1. Dans un projet précis (déjà fait dans ce dépôt)

```
<projet>/.claude/skills/site-web-complet/
```
Claude Code le charge automatiquement quand on travaille dans ce projet.

## 2. Sur tous tes projets locaux

```bash
cp -r .claude/skills/site-web-complet ~/.claude/skills/
```
Le skill devient disponible dans toutes tes sessions Claude Code, quel que soit le dossier.

## 3. Sur ton compte claude.ai (recommandé — c'est ce qui alimente `/root/.claude/skills/synced`)

1. Zipper le dossier :
   ```bash
   cd .claude/skills && zip -r site-web-complet.zip site-web-complet
   ```
2. claude.ai → **Paramètres → Capacités → Compétences** → *Importer une compétence* → déposer le zip.
3. Le skill se synchronise ensuite dans toutes tes sessions (web, desktop, Claude Code), au même
   endroit que `seo-guyenne-etudes`, `meta-ads-bim` ou `gbp-dermatologue-fes-lakhssassi`.

## Déclenchement

Le skill s'active tout seul sur : « fais-moi un site », « nouveau site client », « refonte du site »,
« mettre le site en ligne », « il manque quoi sur mon site », « checklist site web ».
Sinon, l'appeler explicitement : `/site-web-complet`.

## Mise à jour

Modifier les fichiers, recommiter, et re-zipper/re-importer pour la version claude.ai
(l'import remplace la version précédente).

## Vérificateur

```bash
bash .claude/skills/site-web-complet/scripts/verif-site.sh https://exemple.fr [--max 25]
```
Dépendances : `python3` uniquement. Il sort en code 2 si le site est injoignable, pour ne jamais
afficher de faux « conforme ».
