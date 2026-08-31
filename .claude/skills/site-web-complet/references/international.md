# Adapter le site au pays et à la langue

Les 20 points sont **universels**. Ce qui change d'un pays à l'autre : le droit (voir
`juridique-pays.md`), la langue, les formats, les canaux de contact et les habitudes de preuve.
À déterminer en **phase 1**, avant d'écrire la première page.

## Tableau de référence

| Marché | Langues du site | Devise / TVA | Téléphone | Autorité données | Canal de contact n°1 |
|---|---|---|---|---|---|
| France | fr | EUR € — TVA 20 % | +33 | CNIL (RGPD) | Formulaire + téléphone |
| Maroc | fr, ar (parfois en) | MAD (DH) — TVA 20 % | +212 | CNDP (loi 09-08) | **WhatsApp** + téléphone |
| Belgique | fr, nl (souvent les deux) | EUR € — TVA 21 % | +32 | APD (RGPD) | Formulaire + téléphone |
| Suisse | fr, de, it, en | CHF — TVA 8,1 % | +41 | PFPDT (nLPD) | Formulaire |
| Canada / Québec | **fr obligatoire**, en | CAD $ — TPS/TVQ | +1 | CAI (Loi 25) | Formulaire + téléphone |
| Afrique francophone | fr | XOF/XAF/autre | variable | variable | WhatsApp |
| International | en + langues cibles | selon | E.164 | selon audience | Formulaire |

Règle de sécurité : si une partie de l'audience est dans l'UE, le socle RGPD s'applique quel que
soit le pays du siège. Construire sur le standard le plus strict coûte peu et évite de refaire.

---

## Site multilingue

- **Une URL par langue** : `/fr/`, `/ar/`, `/en/` (ou sous-domaines). Jamais de traduction
  automatique injectée en JavaScript : Google n'indexe qu'une seule version et le contenu n'est pas
  vraiment traduit.
- `<html lang="fr">` correct sur chaque page.
- `hreflang` complet et **réciproque** sur chaque version, plus `x-default` :
  ```html
  <link rel="alternate" hreflang="fr" href="https://exemple.ma/fr/services/">
  <link rel="alternate" hreflang="ar" href="https://exemple.ma/ar/services/">
  <link rel="alternate" hreflang="x-default" href="https://exemple.ma/fr/services/">
  ```
- Traduire **tout**, pas seulement le corps de page : `<title>`, meta description, `alt`, fil
  d'Ariane, page 404, page de remerciement, formulaires, politique de confidentialité, et
  `inLanguage` dans le JSON-LD.
- Sitemap : une entrée par version, avec les `xhtml:link` alternates.
- Le sélecteur de langue pointe vers **la page équivalente**, pas vers l'accueil.

### Implémentation par stack
- **WordPress** : Polylang (gratuit, suffisant pour un vitrine) ou WPML. Vérifier que Rank Math
  génère bien les `hreflang` et un sitemap par langue.
- **Next.js** : routing `app/[locale]/`, `next-intl`, et `alternates.languages` dans `generateMetadata`.
- **HTML statique** : dossiers `/fr/` et `/ar/`, `hreflang` écrits à la main, un sitemap par langue.

---

## Arabe et mise en page RTL

- `<html lang="ar" dir="rtl">`.
- Utiliser les **propriétés logiques** CSS (`margin-inline-start`, `padding-inline-end`,
  `text-align: start`) plutôt que `left`/`right` : la même feuille de style sert alors aux deux sens.
- Retourner les icônes directionnelles (flèches, chevrons du fil d'Ariane), pas les logos ni les photos.
- Polices : **Noto Naskh Arabic**, **Cairo** ou **Tajawal** ; augmenter `line-height` (1.7-1.9) car
  les diacritiques et hampes débordent ; ne pas justifier le texte.
- Les nombres, les URLs et les emails restent en LTR : les isoler avec `<bdi>` si besoin.
- Formulaires : accepter les noms en caractères arabes **et** latins (pas de `pattern` en `[A-Za-z]`).
- Registre de langue au Maroc : l'**arabe standard** est la norme à l'écrit ; la darija se réserve à
  l'oral et au social. En B2B marocain, le **français** reste souvent la langue principale du site —
  demander en phase 1 plutôt que supposer.

---

## Formats à ne pas rater

- **Téléphone** : affiché au format local (`06 12 34 56 78` en France, `06 61 23 45 67` au Maroc),
  mais `href="tel:"` toujours en **E.164** (`+33612345678`, `+212661234567`).
- **Adresse** : au Maroc, beaucoup d'adresses n'ont pas de numéro de rue exploitable. Ajouter un
  repère utile (« immeuble X, 3ᵉ étage, en face de … ») et un lien de plan — ça vaut plus qu'un
  code postal.
- **Prix** : « à partir de 1 200 DH HT » au Maroc, « à partir de 1 200 € HT » en France. Préciser
  toujours HT ou TTC.
- **Dates et horaires** : format 24 h en France et au Maroc ; AM/PM au Canada anglophone.
- **Nombres** : espace insécable comme séparateur de milliers en français ; virgule décimale.

---

## Canaux de contact

- **Maroc, Afrique, Moyen-Orient** : WhatsApp est souvent le canal n°1. L'intégrer au point 9
  (barre CTA mobile) :
  ```html
  <a href="https://wa.me/212661234567?text=Bonjour%2C%20je%20souhaite%20un%20devis">WhatsApp</a>
  ```
  Suivre le clic en événement `click_whatsapp` (point 18), et annoncer le délai de réponse WhatsApp
  comme promesse de délai (point 8).
- **France / B2B** : formulaire + téléphone en priorité ; WhatsApp en canal secondaire.
- Ne pas empiler 5 canaux : deux maximum dans la barre mobile, sinon plus personne ne choisit.

---

## Performance et mobile

Sur les marchés à trafic majoritairement mobile (Maroc, Afrique), tester en **4G lente**, pas en
Wi-Fi de bureau. Budget indicatif : moins de 1,5 Mo par page, images en WebP/AVIF, 2 familles de
polices maximum (une police arabe complète est lourde — charger des sous-ensembles).

---

## Cartes et itinéraire (point 19)

- Google Maps couvre correctement la France, le Maroc, la Belgique, la Suisse et le Canada.
- Ajouter un lien **Waze** en plus de Google Maps au Maroc, où il est très utilisé :
  `https://waze.com/ul?q=<adresse+encodée>`.
- Si le marché est un pays où Google est marginal, remplacer par le service local dominant.

---

## Horaires et saisonnalité

- **Maroc** : prévoir les **horaires du Ramadan** (annoncés à l'avance sur le site et la fiche
  Google), l'Aïd, les fêtes nationales, et la pause du vendredi selon l'activité.
  Dans le JSON-LD, utiliser `specialOpeningHoursSpecification` pour ces périodes.
- **France** : fermetures d'août, jours fériés, période de congés du bâtiment.
- Un horaire faux sur le site ou la fiche Google est la première cause d'avis négatif en local.

---

## SEO local selon le marché

- **France** : Google largement dominant ; requêtes en français.
- **Maroc** : Google dominant aussi, mais les requêtes se répartissent entre français
  (« dermatologue Fès »), arabe (« طبيب الجلد فاس ») et translittération sans accents
  (« dermatologue fes »). Si le site est bilingue, couvrir les deux ; toujours prévoir les variantes
  sans accents et sans tirets.
- Les annuaires et citations locales diffèrent d'un pays à l'autre : pour le local marocain, voir le
  skill **`gbp-dermatologue-fes-lakhssassi`** ; pour le local français, **`seo-wordpress-local`**.

---

## Domaine et hébergement

- `.ma` exige un enregistrement auprès d'un registrar accrédité avec justificatifs d'entreprise ;
  `.fr` demande une adresse dans l'UE ; `.com` est libre.
- Choisir un hébergement ou un CDN proche des visiteurs — un serveur européen convient au Maroc,
  un serveur américain se sent tout de suite.
