# Stack — WordPress + Elementor

Outils disponibles selon la session : skills `wordpress-elementor`, `elementor-wordpress`,
`elementor-mcp`, ou le serveur MCP **WPVibeAi** (`load_skill` d'abord, puis `run_wp_cli`,
`rest_api`, `write_file`). Toujours charger le skill correspondant avant d'éditer une page
construite avec un page builder : une édition brute casse la mise en page.

## Extensions minimales

| Besoin | Extension | Points couverts |
|---|---|---|
| SEO (titles, metas, OG, sitemap, robots, schema) | **Rank Math** (ou Yoast) | 10-13, 16 |
| Consentement cookies | **Complianz** ou Axeptio | 18 |
| Tag Manager | **GTM4WP** (ou insertion via le thème enfant) | 18 |
| Formulaires | Elementor Pro Forms, WPForms ou Tally | 4, 8 |
| Cache/perf | LiteSpeed Cache, WP Rocket | 13, 15 |

Éviter d'empiler deux extensions SEO ou deux bandeaux cookies : doublons de balises garantis.

## Point 1 — Page 404

Elementor Pro → **Templates > Générateur de thème > Page 404**. Sinon, `404.php` dans le thème enfant.
WordPress renvoie nativement le bon code 404 sur ce gabarit. Contenu : voir `assets/404.html.template`.
Ne pas utiliser d'extension qui redirige les 404 vers l'accueil.

## Point 4 — Page de remerciement

Créer une page `/merci`, action « Redirection » du formulaire Elementor vers cette URL
(plutôt que le simple message de succès, qui ne crée pas d'URL mesurable).
Rank Math → onglet Avancé de la page : cocher **No index**, et exclure la page du sitemap.

## Point 5 — Fil d'Ariane

Rank Math → *Général > Fil d'Ariane* : activer. Puis widget « Fil d'Ariane » Elementor ou shortcode
`[rank_math_breadcrumb]` dans le modèle d'en-tête. Rank Math génère le `BreadcrumbList` JSON-LD
automatiquement — vérifier qu'il correspond bien à l'affichage.

## Points 11-13 — Titres, descriptions, OG

Pour chaque page, dans la boîte Rank Math : Titre SEO (50-60 car.), Description (140-160 car.),
onglet *Réseaux sociaux* → image 1200×630 spécifique.
- Configurer les **modèles** globaux (Rank Math > Apparence dans les moteurs de recherche) pour les
  types de contenu, puis surcharger page par page.
- Rank Math > Tableau de bord > **Analyse SEO** liste les titles/descriptions manquants ou dupliqués.

## Point 10 — robots.txt

Rank Math > Réglages généraux > **Modifier robots.txt** (ne fonctionne que s'il n'existe pas de
fichier physique à la racine). Vérifier en priorité : Réglages > Lecture > la case
« Demander aux moteurs de recherche de ne pas indexer ce site » doit être **décochée** en production
— c'est la cause n°1 de site invisible après mise en ligne.

## Points 7 et 16 — FAQ et LocalBusiness

- FAQ : widget Accordéon d'Elementor + Rank Math > Schéma > **FAQ** sur la page, avec un texte
  strictement identique à l'affichage.
- LocalBusiness : Rank Math > Réglages du titre > **Informations locales** (type, NAP, horaires,
  coordonnées). Vérifier ensuite le rendu avec le Rich Results Test ; compléter au besoin avec un
  bloc JSON-LD manuel (voir `schema-jsonld.md`) — mais ne jamais avoir deux LocalBusiness concurrents.

## Point 9 — Barre CTA mobile

Elementor Pro : nouveau modèle « Section » en position fixe, affiché uniquement sur mobile
(*Avancé > Réactivité*), avec deux boutons (`tel:` + devis). Puis, dans les CSS personnalisés :

```css
@media (max-width: 767px){ body{ padding-bottom: 88px; } }
```
Sans cette règle, la barre masque le pied de page et le bouton d'envoi du formulaire.

## Point 15 — Textes alternatifs

Médiathèque > vue liste : renseigner le champ *Texte alternatif* de chaque image.
Attention : les images posées dans Elementor gardent l'`alt` de la médiathèque — corriger à la source.
Les images de fond Elementor n'ont pas d'`alt` : ne jamais y mettre une image porteuse d'information.

## Point 18 — GA4 + GTM + consentement

1. GTM4WP (ou code dans le thème enfant) pour injecter le conteneur GTM.
2. Complianz configuré en RGPD/France : refus au premier niveau, catégorisation des cookies,
   **Consent Mode v2** activé.
3. Dans GTM : balise GA4 déclenchée sur `Initialization`, en respectant le consentement.
4. Événements : `generate_lead` sur le déclencheur `elementor/forms/submit_success`, clic sur les
   liens `tel:`, vue de `/merci`.
Détail : `tracking-ga4-gtm.md`.

## Point 19 — Carte

Éviter le widget Google Maps d'Elementor chargé d'office (cookies avant consentement).
Utiliser le blocage de service de Complianz (placeholder + clic pour charger), ou une image statique
avec un bouton « Itinéraire ».

## Refonte : redirections

Avant de changer les URLs, exporter la liste des pages qui reçoivent du trafic (Search Console),
puis créer les 301 avec Rank Math > Redirections. Sans ça : vagues de 404 et perte de positions.

## Contrôles

```bash
bash .claude/skills/site-web-complet/scripts/verif-site.sh https://exemple.fr
```
Plus, côté WordPress : Rank Math > Analyse SEO, et un test de soumission de formulaire de bout en bout.
