# Données structurées JSON-LD (points 5, 7, 14, 16)

Règles générales :
- Toujours en **JSON-LD** dans un `<script type="application/ld+json">`, jamais en microdata.
- Ne baliser **que ce qui est visible** sur la page. Baliser une info absente = risque de pénalité manuelle.
- URLs **absolues** partout.
- Un `@id` stable par entité, pour que les autres schemas s'y rattachent sans dupliquer.
- Valider sur `https://search.google.com/test/rich-results` et `https://validator.schema.org`.

---

## 16. LocalBusiness (accueil + contact)

```json
{
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "@id": "https://exemple.fr/#business",
  "name": "MJ Toiture Façade",
  "url": "https://exemple.fr/",
  "logo": "https://exemple.fr/assets/img/logo.png",
  "image": ["https://exemple.fr/assets/img/equipe.jpg"],
  "telephone": "+33556000000",
  "email": "contact@exemple.fr",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 rue des Artisans",
    "addressLocality": "Bordeaux",
    "postalCode": "33000",
    "addressRegion": "Nouvelle-Aquitaine",
    "addressCountry": "FR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 44.8378, "longitude": -0.5792 },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "08:00", "closes": "18:00" }
  ],
  "areaServed": [
    { "@type": "City", "name": "Bordeaux" },
    { "@type": "AdministrativeArea", "name": "Gironde" }
  ],
  "sameAs": [
    "https://www.google.com/maps/place/…",
    "https://www.linkedin.com/company/…"
  ]
}
```

Choisir le sous-type le plus précis : `Plumber`, `Electrician`, `RoofingContractor`, `HVACBusiness`,
`Locksmith`, `MovingCompany`, `Dentist`, `Dermatologist`, `Physician`, `LegalService`,
`AccountingService`, `RealEstateAgent`, `ProfessionalService` (repli B2B),
`HomeAndConstructionBusiness` (repli bâtiment).

Le NAP doit être **au caractère près** celui de la fiche Google Business Profile.

---

## 5. BreadcrumbList (toutes les pages sauf l'accueil)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://exemple.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Prestations", "item": "https://exemple.fr/prestations/" },
    { "@type": "ListItem", "position": 3, "name": "Relevé 3D" }
  ]
}
```
Le dernier élément n'a **pas** d'`item` (c'est la page courante). Les `name` doivent être identiques
au fil d'Ariane affiché.

---

## 7. FAQPage (page qui porte les FAQ)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question",
      "name": "Combien coûte un relevé 3D ?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Le prix dépend de la surface et du niveau de détail attendu. Comptez à partir de 1 200 € HT pour un bâtiment de 200 m². Nous chiffrons chaque projet sous 48 h ouvrées après un appel de 15 minutes." } }
  ]
}
```
Un seul `FAQPage` par page. Texte du JSON-LD = texte affiché, mot pour mot.
Rappel : les rich results FAQ ne s'affichent plus que pour les sites gouvernementaux et de santé —
le balisage reste utile pour la compréhension machine, mais ne le vends pas comme un gain d'affichage.

---

## 14. Review / AggregateRating

**À n'utiliser que si les avis réels sont affichés sur la page.** Voir `juridique-fr.md`.

```json
{
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "@id": "https://exemple.fr/#business",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "37",
    "bestRating": "5"
  },
  "review": [
    { "@type": "Review",
      "author": { "@type": "Person", "name": "Sophie L." },
      "datePublished": "2026-03-14",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Intervention rapide et devis tenu au centime près." }
  ]
}
```

Interdits : noter sa propre entreprise sans avis affichés, agréger des avis recopiés d'une autre
plateforme sans les afficher, arrondir une note à la hausse.

---

## Compléments utiles

- **Service** sur chaque page de prestation (`serviceType`, `areaServed`, `provider` → `@id` du business).
- **Article** sur les articles de blog (`headline`, `datePublished`, `author`, `image`).
- **Person** pour les membres de l'équipe (`name`, `jobTitle`, `image`, `worksFor` → `@id`).
- **WebSite** + `potentialAction: SearchAction` si le site a une recherche interne.
- **Organization** si l'entité n'est pas locale (pas d'accueil physique).

Pour tout schema qui dépasse ce cadre, charger le skill **`schema-markup`**.
