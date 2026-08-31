# Tracking — GA4 via GTM + Consent Mode v2 (points 4 et 18)

Principe : **un seul conteneur GTM**, GA4 déclenché dedans, et **rien ne part avant le consentement**.

## 1. Consent Mode v2 — à injecter AVANT le snippet GTM

```html
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'granted',
  'security_storage': 'granted',
  'wait_for_update': 500
});
</script>
<!-- snippet GTM ensuite -->
```

Au clic sur « Accepter » (c'est le rôle du bandeau — Complianz, Axeptio, ou le bandeau maison) :

```js
gtag('consent', 'update', {
  ad_storage: 'granted', ad_user_data: 'granted',
  ad_personalization: 'granted', analytics_storage: 'granted'
});
```

## 2. Bandeau conforme CNIL

- « Refuser » **au premier niveau**, avec le même poids visuel que « Accepter » (même taille, même
  contraste). Un lien « Continuer sans accepter » discret ne suffit plus.
- Aucune case pré-cochée, aucun cookie de mesure déposé avant le choix.
- Choix conservé ~6 mois, et **réversible** : lien « Gérer mes cookies » dans le footer de chaque page.
- Le refus doit être aussi simple que l'acceptation (un clic).
- Lister les finalités et les destinataires, avec un lien vers la politique de confidentialité.

## 3. GA4 dans GTM

- Balise **Google Tag** (`G-XXXXXXX`), déclencheur *Initialization — All Pages*,
  paramètre de consentement : la balise attend `analytics_storage`.
- Ne **jamais** doubler avec un `gtag.js` posé en dur dans le thème : double comptage garanti.
- Dans GA4 : rétention des données à 14 mois, filtrage du trafic interne (IP), exclusion des
  domaines de référence de paiement le cas échéant.

## 4. Événements de conversion à configurer

| Événement | Déclencheur GTM | Pourquoi |
|---|---|---|
| `generate_lead` | envoi de formulaire réussi (ou vue de `/merci`) | conversion principale |
| `click_phone` | clic sur un lien `href^="tel:"` | mesure les appels, très fort en local |
| `click_whatsapp` | clic sur `wa.me` | idem |
| `click_directions` | clic sur le bouton « Itinéraire » | intention de visite |
| `view_case_study` | vue d'une page `/realisations/` | qualité du trafic |
| `scroll_90` | scroll 90 % sur les pages de service | engagement |

La vue de `/merci` est la mesure la plus fiable (elle ne dépend pas d'un listener JS fragile).
Marquer `generate_lead` comme **conversion** dans GA4 > Admin > Événements.

Exemple d'envoi manuel depuis la page de remerciement :

```html
<script>
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({ event: 'generate_lead', form_name: 'devis', value: 0, currency: 'EUR' });
</script>
```

## 5. Search Console

- Vérifier la propriété **Domaine** (enregistrement DNS TXT) plutôt que par préfixe d'URL.
- Soumettre `https://domaine.fr/sitemap.xml`.
- Lier GA4 ↔ Search Console (GA4 > Admin > Liens avec Search Console).
- Après mise en ligne : contrôler l'onglet *Indexation des pages* à J+7 (pages exclues, 404, soft 404).

## 6. Vérification (point 18 de la checklist)

1. Navigation privée, DevTools > Réseau, filtrer `google`.
2. Charger le site **sans** cliquer sur le bandeau → aucune requête vers `google-analytics.com`
   ni `/g/collect`. Si une requête part, le consentement est mal câblé.
3. Cliquer « Accepter » → la collecte démarre.
4. GA4 > DebugView : vérifier `page_view`, `generate_lead`, `click_phone`.
5. Cliquer « Refuser » dans une autre session → toujours aucune collecte.

## 🌍 Selon le pays

Le montage technique (GTM + Consent Mode v2 + bandeau) est le même partout ; c'est le **niveau
d'exigence** qui change.

| Marché | Bandeau de consentement | Points d'attention |
|---|---|---|
| France / UE | Obligatoire, refus au premier niveau | Contrôles CNIL, sanctions réelles |
| Maroc | Pas d'équivalent strict du bandeau CNIL, mais la loi 09-08 impose information et consentement pour les données personnelles | Déclaration CNDP du traitement ; garder le bandeau standard, surtout si une partie de l'audience est européenne |
| Suisse | nLPD plus souple sur les cookies | RGPD dès qu'on cible l'UE |
| Québec | Loi 25 : consentement clair | Interface en français |

Par défaut, monter le dispositif au niveau UE : c'est le plus strict, ça marche partout, et ça évite
de refaire le travail quand le client se met à viser l'Europe.

Événement à ajouter sur les marchés WhatsApp (Maroc, Afrique) : `click_whatsapp`, sur les liens
`wa.me` — souvent la conversion principale, devant le formulaire.

## Autres tags (Meta Pixel, Google Ads, Clarity)

Même règle : dans GTM, conditionnés au consentement, et **listés dans la politique de confidentialité**
avec leur finalité et leur durée. Chaque tag ajouté sans être documenté est une non-conformité.
