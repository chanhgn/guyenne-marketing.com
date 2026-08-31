# Phase 1 — Interview de collecte

Objectif : sortir de cette phase avec **zéro information inventée**. Pose les questions par blocs,
5 à 8 à la fois, avec un exemple de réponse attendue à chaque fois.

Convention : ✱ = information sans laquelle un des 20 points ne peut pas être livré.

---

## Bloc 0 — Cadrage (à poser en premier, toujours)

1. ✱ **Stack** : WordPress + Elementor, HTML/CSS statique, ou Next.js/React ? (accès admin / repo / hébergeur)
2. ✱ **Nature du projet** : création from scratch, refonte, ou finition d'un site existant ? URL actuelle ?
3. ✱ **Profil** : artisan/TPE locale, B2B services, ou e-commerce ?
4. ✱ **Nom de domaine** définitif (il conditionne les URLs absolues : OG, sitemap, JSON-LD).
5. **Deadline** de mise en ligne et qui valide le contenu.
6. **Qui édite le site ensuite** (le client seul ? toi ?) — ça tranche WordPress vs statique.

---

## Bloc 1 — Identité et NAP

Le NAP (Name, Address, Phone) doit être **strictement identique** partout : site, schema
LocalBusiness, fiche Google Business Profile, mentions légales. Une virgule qui diffère suffit à
affaiblir le SEO local.

7. ✱ Raison sociale exacte + nom commercial affiché.
8. ✱ Adresse postale complète telle qu'elle apparaît sur la fiche Google (rue, code postal, ville, pays).
9. ✱ Téléphone au format affiché (`01 23 45 67 89`) **et** au format international (`+33123456789`) pour le `tel:`.
10. ✱ Email de contact public.
11. ✱ Horaires d'ouverture réels, jour par jour + fermetures exceptionnelles.
12. Lien de la fiche Google Business Profile + réseaux sociaux (pour `sameAs`).
13. ✱ Logo (SVG ou PNG ≥ 512 px) et charte : couleurs, typos.
14. Type d'activité précis (sert à choisir le sous-type schema : `Plumber`, `RoofingContractor`,
    `Dermatologist`, `ProfessionalService`, `HomeAndConstructionBusiness`…).

---

## Bloc 2 — Offre et pages

15. ✱ Les 3 à 6 prestations à mettre en avant, dans l'ordre de rentabilité.
16. ✱ Zone d'intervention : ville principale + communes/départements couverts (→ `areaServed`, pages locales).
17. À qui tu ne t'adresses **pas** (sert à qualifier et à écrire les FAQ).
18. Fourchette de prix ou "à partir de" communicable ? Sinon, quelle réponse donner à la FAQ prix ?
19. Différenciateurs concrets : certifications (RGE, Qualibat, Ordre…), assurances, ancienneté, garanties.
20. Arborescence souhaitée ou à proposer ? (elle détermine fil d'Ariane + maillage interne)

---

## Bloc 3 — Preuves (jamais inventables)

> Si un de ces trois blocs revient vide, le point correspondant sera marqué ⛔ dans la validation
> finale et la section sera livrée avec un `[À FOURNIR]` visible, pas avec du faux contenu.

**Avis clients (point 14)**
21. ✱ 3 à 6 avis réels : texte, prénom + initiale du nom, ville, date, source (Google, Pages Jaunes, email).
22. Lien public vers la fiche d'avis, si elle existe.
23. Note moyenne et nombre total d'avis — uniquement s'ils sont vérifiables.
24. Autorisation d'afficher ces avis nominativement ?

**Études de cas (point 6)**
25. ✱ 3 chantiers/projets réels : contexte client, contrainte principale, ce qui a été fait,
    résultat **chiffré** (délai tenu, surface, économie, gain), et si possible une phrase du client.
26. Photos avant/après ou photos de réalisation, avec autorisation de publication.
27. Le client peut-il être nommé, ou faut-il anonymiser ("un cabinet d'architecture à Bordeaux") ?

**Photos d'équipe (point 20)**
28. ✱ Photo(s) réelles de l'équipe ou du dirigeant + prénom et rôle de chaque personne.
29. À défaut : accepter une photo du dirigeant seul ou de l'équipe au travail — mais **jamais** de
    banque d'images pour illustrer une équipe.

---

## Bloc 4 — Conversion

30. ✱ Action n°1 attendue du visiteur : appel, formulaire de devis, prise de RDV, WhatsApp ?
31. ✱ **Promesse de délai** (point 8) : sous combien de temps le client est-il recontacté ?
    Formuler précisément : "Réponse sous 24 h ouvrées", "Devis chiffré sous 48 h", "Intervention sous 7 jours".
    Vérifier que c'est **tenable toute l'année**, pas seulement en basse saison.
32. Que se passe-t-il si le délai n'est pas tenu ? (une phrase honnête vaut mieux qu'une promesse floue)
33. Champs du formulaire (garder le minimum : nom, téléphone ou email, besoin).
34. Où arrivent les leads : email, CRM, Tally, WhatsApp ?
35. Message et prochaines étapes à afficher sur la page de remerciement.
36. Un numéro de téléphone doit-il rester cliquable en permanence sur mobile ? (barre CTA sticky)

---

## Bloc 5 — Technique et tracking

37. ✱ Hébergeur et accès (FTP/SSH/admin WP/Vercel).
38. Compte Google Analytics 4 existant ? ID de mesure `G-XXXXXXX` ?
39. Conteneur Google Tag Manager existant ? ID `GTM-XXXXXXX` ?
40. Google Search Console déjà vérifiée sur le domaine ?
41. Autres tags à prévoir (Meta Pixel, Google Ads, Clarity) — ils conditionnent le bandeau de consentement.
42. Si refonte : liste des URLs actuelles qui reçoivent du trafic (→ plan de redirections 301, sinon 404 en masse).

---

## Bloc 6 — Juridique

43. ✱ Forme juridique, capital, SIREN/SIRET, RCS, numéro de TVA intracommunautaire.
44. ✱ Nom du directeur de la publication.
45. ✱ Hébergeur : raison sociale, adresse, téléphone (obligation LCEN pour les mentions légales).
46. Assurance professionnelle (RC pro / décennale) : assureur et zone de couverture.
47. Un DPO ou un contact RGPD désigné ? Sinon, l'email de contact fera office.
48. Le site collecte-t-il autre chose que le formulaire ? (newsletter, compte client, paiement)
49. Ordre professionnel / mentions réglementaires spécifiques (santé, immobilier, courtage…) ?

---

## Récapitulatif de fin de phase 1

Restitue un tableau que l'utilisateur valide explicitement avant toute construction :

```
| Élément | Valeur retenue | Source | Statut |
|---|---|---|---|
| NAP | GUYENNE ÉTUDES — 12 rue X, 33000 Bordeaux — +33556000000 | fiche Google | validé |
| Promesse de délai | Devis chiffré sous 48 h ouvrées | client | validé |
| Avis clients | 4 avis Google (liens fournis) | Google | validé |
| Photos équipe | — | — | ⛔ à fournir |
```

Et annonce clairement : « Voici ce qui manque encore et ce que ça bloquera à la livraison : … »
