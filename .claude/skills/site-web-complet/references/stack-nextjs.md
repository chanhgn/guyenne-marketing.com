# Stack — Next.js (App Router)

Structure de référence :

```
app/
├── layout.tsx                  → metadataBase, OG par défaut, GTM, bandeau consentement, footer légal
├── page.tsx                    → accueil
├── not-found.tsx               → point 1 (renvoie bien un 404)
├── merci/page.tsx              → point 4
├── prestations/[slug]/page.tsx → generateMetadata → points 11-13
├── realisations/[slug]/page.tsx→ point 6
├── equipe/page.tsx             → point 20
├── contact/page.tsx            → points 19, 16
├── politique-de-confidentialite/page.tsx
├── mentions-legales/page.tsx
├── robots.ts                   → point 10
└── sitemap.ts
components/
├── Breadcrumb.tsx              → point 5
├── CtaMobile.tsx               → point 9
├── Faq.tsx                     → point 7
├── Avis.tsx                    → point 14
└── MapItineraire.tsx           → point 19
```

## Points 11-13 — métadonnées

```ts
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://exemple.fr'),   // rend toutes les URLs OG absolues
  title: { default: 'Métier à Ville — Promesse | Marque', template: '%s | Marque' },
  description: '…',
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Marque', images: ['/og/default.jpg'] },
  twitter: { card: 'summary_large_image' },
}
```

```ts
// app/prestations/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const s = await getService(params.slug)
  return {
    title: `${s.titre} à ${s.ville} — Devis 48 h`,   // 50-60 caractères, unique
    description: s.metaDescription,                   // 140-160 caractères, unique
    alternates: { canonical: `/prestations/${s.slug}` },
    openGraph: { images: [{ url: s.ogImage, width: 1200, height: 630, alt: s.ogAlt }] },
  }
}
```

`metadataBase` est obligatoire, sinon les `og:image` restent relatives et les réseaux sociaux les ignorent.

## Point 1 — not-found.tsx

```tsx
// app/not-found.tsx  → Next renvoie automatiquement le statut HTTP 404
export const metadata = { robots: { index: false, follow: true } }

export default function NotFound() {
  return (
    <main>
      <h1>Cette page n'existe plus</h1>
      <p>Elle a peut-être été déplacée. Voici où aller :</p>
      <ul>
        <li><Link href="/">Accueil</Link></li>
        <li><Link href="/prestations">Nos prestations</Link></li>
        <li><Link href="/realisations">Nos réalisations</Link></li>
        <li><Link href="/contact">Nous contacter</Link></li>
      </ul>
      <Link className="btn" href="/contact">Demander un devis — réponse sous 48 h</Link>
      <p>Ou appelez-nous au <a href="tel:+33556000000">05 56 00 00 00</a>.</p>
    </main>
  )
}
```

Attention : `notFound()` appelé dans une route dynamique rend `not-found.tsx` **avec** le statut 404.
Une page « 404 » rendue manuellement (retour d'un composant sans `notFound()`) renvoie 200 → soft 404.

## Point 4 — page de remerciement

```tsx
// app/merci/page.tsx
export const metadata = { robots: { index: false, follow: true } }
```
Rediriger le formulaire vers `/merci` (server action + `redirect('/merci')`), et déclencher
l'événement de conversion côté client sur cette page (voir `tracking-ga4-gtm.md`).

## Point 10 — robots.ts et sitemap.ts

```ts
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/merci', '/api/', '/*?s='] }],
    sitemap: 'https://exemple.fr/sitemap.xml',
  }
}
```

```ts
// app/sitemap.ts — n'inclure que les pages indexables
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices()
  return [
    { url: 'https://exemple.fr', lastModified: new Date(), priority: 1 },
    ...services.map(s => ({ url: `https://exemple.fr/prestations/${s.slug}`, lastModified: s.maj })),
  ]
}
```

## Points 5, 7, 16 — JSON-LD

Injecter via un `<script type="application/ld+json">` rendu côté serveur :

```tsx
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
```
Le `replace` évite l'injection via `</script>` dans une donnée client. Schémas : `schema-jsonld.md`.

## Point 15 — images

```tsx
<Image src={p.photo} alt="Clément Guyenne, gérant, sur un chantier à Bordeaux"
       width={640} height={480} loading="lazy" />
```
`next/image` impose `alt` : mettre `alt=""` explicitement pour les images décoratives.
Le hero passe en `priority` (pas de `lazy`).

## Point 9 — CtaMobile

Même CSS que la version statique (`stack-html-statique.md`). En Next, ajouter la classe utilitaire
`pb-[88px] md:pb-0` sur le `<body>` du layout pour ne rien masquer.

## 🌍 Site multilingue

Routing `app/[locale]/…` + `next-intl`. Dans `generateMetadata` :

```ts
alternates: {
  canonical: `/${locale}/prestations/${slug}`,
  languages: {
    fr: `/fr/prestations/${slug}`,
    ar: `/ar/prestations/${slug}`,
    'x-default': `/fr/prestations/${slug}`,
  },
}
```
Et dans le layout : `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`.
Le sitemap liste une entrée par locale. Détail dans `international.md`.

## Point 18 — GTM

Utiliser `@next/third-parties/google` (`<GoogleTagManager gtmId="GTM-XXXX" />`) dans `layout.tsx`,
avec le script de Consent Mode v2 injecté **avant** via `<Script strategy="beforeInteractive">`.
Détail dans `tracking-ga4-gtm.md`.
