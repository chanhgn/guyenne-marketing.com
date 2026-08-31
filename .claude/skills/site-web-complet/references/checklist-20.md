# Les 20 points — spécification et vérification

Pour chaque point : **Critères** (ce qui doit être vrai), **Pièges** (erreurs fréquentes),
**Vérification** (comment le prouver, pas le supposer).

---

## 1. Page 404 claire et personnalisée

**Critères**
- La page renvoie bien un **code HTTP 404** (ou 410), pas 200 ni 302.
- Message dans le ton de la marque, sans jargon : « Cette page n'existe plus. » + ce qu'on propose.
- 3 à 5 liens utiles : accueil, prestations principales, contact, blog/réalisations.
- 1 CTA (le même que le CTA primaire du site) + numéro de téléphone cliquable.
- Barre de recherche si le site en a une. Design identique au reste (header/footer conservés).
- `<meta name="robots" content="noindex">`.

**Pièges**
- Rediriger toutes les 404 vers l'accueil : Google appelle ça une *soft 404*, et l'utilisateur est perdu.
- Une page 404 servie en 200 (fréquent sur les SPA mal configurées).
- Page 404 par défaut du thème/serveur, non stylée, sans lien.

**Vérification** — `curl -o /dev/null -s -w "%{http_code}\n" https://site.fr/url-qui-nexiste-pas`
doit afficher `404`, et la page doit être visuellement personnalisée.

---

## 2. CTA clair

**Critères**
- **Une seule** action primaire par page. Les actions secondaires sont visuellement plus faibles (lien, outline).
- Libellé = verbe d'action + bénéfice + (délai) : « Demander mon devis gratuit — réponse sous 48 h ».
  Jamais « Envoyer », « Cliquez ici », « En savoir plus » sur le CTA primaire.
- Un CTA visible **sans scroll** sur desktop et mobile.
- CTA répété tous les 2-3 blocs de contenu et en fin de page.
- Contraste suffisant (ratio ≥ 4.5:1 sur le texte du bouton), état `:hover` et `:focus-visible` visibles.
- Sous le CTA : un réducteur de risque (« Sans engagement », « Réponse par un humain »).

**Pièges** — deux CTA concurrents de même poids visuel ; un CTA qui change de libellé de page en page
sans raison ; un bouton qui n'est pas un `<a>`/`<button>` (inaccessible au clavier).

**Vérification** — sur chaque page, compter les CTA primaires : le total doit être 1 (répété), pas 2 différents.

---

## 3. Liens internes

**Critères**
- Minimum **3 liens contextuels** dans le corps de chaque page, vers des pages pertinentes.
- Ancres descriptives reprenant le sujet cible : « notre service de relevé 3D à Bordeaux »,
  pas « cliquez ici » ni l'URL brute.
- Aucune page importante à plus de **3 clics** de l'accueil.
- Chaque page de service renvoie vers : une étude de cas, la page contact, et une prestation liée.
- Les études de cas renvoient vers la prestation concernée (et inversement).
- Zéro lien mort ; les liens sortants importants en `rel="noopener"`.

**Pièges** — maillage uniquement dans le menu et le footer ; toutes les pages qui pointent vers
l'accueil et rien d'autre ; ancres identiques vers des pages différentes.

**Vérification** — lister par page le nombre de liens internes dans le `<main>` (hors nav/footer).

---

## 4. Page de remerciement

**Critères**
- **URL dédiée** `/merci` (ou `/merci-devis`) — indispensable pour compter la conversion dans GA4.
  Pas seulement un message qui s'affiche à la place du formulaire.
- Confirme ce qui vient de se passer + **prochaine étape datée** : « Nous vous rappelons sous 24 h ouvrées. »
- Indique quoi faire en attendant : 2-3 liens de rebond (études de cas, FAQ, blog).
- Rappel du téléphone pour les urgents.
- `noindex, follow` et exclue du sitemap + bloquée dans robots.txt.
- Déclenche l'événement de conversion GA4 (voir `tracking-ga4-gtm.md`).

**Pièges** — page cul-de-sac sans lien ; page indexée qui remonte dans Google (et fausse les conversions
quand on y arrive par recherche) ; redirection vers l'accueil.

**Vérification** — soumettre le formulaire, confirmer l'URL `/merci`, vérifier `noindex` dans le HTML.

---

## 5. Fil d'Ariane

**Critères**
- Visible en haut de toutes les pages **sauf l'accueil**, sous le header.
- Reflète la hiérarchie réelle des URLs : `Accueil > Prestations > Relevé 3D > Bordeaux`.
- Le dernier élément = page courante, **non cliquable**.
- Balisage `<nav aria-label="Fil d'Ariane">` + `<ol>`.
- `BreadcrumbList` en JSON-LD, avec les mêmes libellés et des URLs absolues (voir `schema-jsonld.md`).
- Lisible sur mobile (wrap ou scroll horizontal, jamais tronqué au point d'être inutile).

**Pièges** — fil d'Ariane qui ne correspond pas à l'URL ; JSON-LD différent de l'affichage (violation
des règles Google) ; séparateur inséré en texte au lieu de CSS (lu par les lecteurs d'écran).

**Vérification** — Rich Results Test / `verif-site.sh` : présence de `BreadcrumbList` sur les pages profondes.

---

## 6. Études de cas

**Critères**
- **3 minimum**, sur des pages dédiées (`/realisations/nom-du-projet`), pas un simple carrousel d'images.
- Structure imposée :
  1. **Contexte** — qui est le client, où, quel besoin.
  2. **Contrainte** — ce qui rendait le projet difficile (délai, site occupé, budget, contrainte technique).
  3. **Solution** — ce qui a été fait concrètement, avec le vocabulaire du métier.
  4. **Résultat chiffré** — délai tenu, surface, m², économie, nombre de plans livrés, gain mesuré.
  5. **Verbatim client** — une phrase entre guillemets, attribuée.
- Photos réelles du projet, avec `alt` descriptif.
- CTA en fin de page vers la prestation concernée.

**Pièges** — étude de cas sans aucun chiffre ; contenu inventé « à titre d'exemple » qui finit en ligne ;
photos de banque d'images présentées comme des réalisations.

**Vérification** — chaque étude de cas contient au moins un chiffre vérifiable et une source réelle.

---

## 7. Cinq FAQ

**Critères**
- **5 questions minimum**, écrites comme les clients les posent (« Combien ça coûte ? », pas « Tarification »).
- Couvrir au minimum : **prix**, **délai**, **zone d'intervention**, **déroulé de la prestation**, **garantie/assurance**.
- Réponses de 40 à 80 mots, réponse dès la première phrase, puis la nuance.
- Chaque réponse contient un lien interne pertinent.
- Accordéon accessible (`<details>` ou boutons ARIA) — le texte doit être dans le HTML, pas injecté au clic.
- `FAQPage` JSON-LD, identique au texte visible.

**Pièges** — FAQ marketing qui n'aborde jamais le prix ; réponses de 3 mots ; contenu du JSON-LD différent
de l'affichage.
- À savoir : depuis 2023 Google n'affiche plus les rich results FAQ que pour les sites gouvernementaux et
  de santé. Le balisage reste utile pour la compréhension par les moteurs et les IA — mais ne promets pas
  d'étoiles ou d'accordéon dans les résultats.

**Vérification** — compter 5 questions, vérifier la présence des 5 thèmes obligatoires.

---

## 8. Promesse de délai

**Critères**
- **Chiffrée** et **tenable** : « Devis sous 48 h ouvrées », pas « réponse rapide ».
- Affichée : sous le CTA principal, dans le hero, dans la meta description, sur la page contact,
  sur la page de remerciement, et dans une FAQ.
- **Formulation strictement identique partout** (mêmes mots, même chiffre).
- Précise les conditions : jours ouvrés, horaires, ce qui se passe le week-end.
- Idéalement adossée à un engagement : « sinon on vous prévient avant l'échéance ».

**Pièges** — une promesse différente sur chaque page (24 h dans le hero, 48 h en contact) ; un délai
impossible à tenir en haute saison, qui génère des avis négatifs.

**Vérification** — `grep` de la formulation exacte sur toutes les pages : même chaîne partout.

---

## 9. CTA mobile

**Critères**
- **Barre sticky** en bas de l'écran sur mobile, avec 1 ou 2 actions max : « Appeler » + « Devis ».
- Cibles tactiles **≥ 48 × 48 px**, espacées d'au moins 8 px.
- Numéro en `<a href="tel:+33...">` (format international, sans espace).
- `padding-bottom` ajouté au `<body>` équivalent à la hauteur de la barre, pour ne rien masquer,
  et `env(safe-area-inset-bottom)` pour les iPhone.
- La barre ne recouvre jamais le formulaire ni le footer légal.
- Masquée en desktop (`@media (min-width: 768px)`).

**Pièges** — barre qui cache le bouton d'envoi du formulaire ; `tel:` mal formaté qui ne compose pas ;
apparition/disparition au scroll qui fait sauter la mise en page (CLS).

**Vérification** — test réel sur mobile (ou DevTools 375 px) : le CTA reste accessible et rien n'est masqué.

---

## 10. robots.txt

**Critères**
- Accessible en `https://domaine.fr/robots.txt`, en `text/plain`, code 200.
- N'interdit **pas** le CSS, le JS ni les images (sinon Google ne peut plus rendre les pages).
- Bloque : `/merci`, l'admin, les résultats de recherche interne, les paramètres de filtre.
- Contient `Sitemap: https://domaine.fr/sitemap.xml` en **URL absolue**.
- En production : pas de `Disallow: /` résiduel de la phase de développement. **À vérifier en premier
  après chaque mise en ligne.**

**Pièges** — croire que robots.txt désindexe : il empêche le crawl, pas l'indexation. Pour désindexer,
c'est `noindex` (et donc la page doit rester crawlable).

**Vérification** — `curl https://site.fr/robots.txt` + tester le sitemap déclaré.
Modèle : `assets/robots.txt.template`.

---

## 11. Titres de page uniques

**Critères**
- Un `<title>` par page, **unique sur tout le site**.
- 50-60 caractères (≈ 580 px) pour éviter la troncature.
- Structure : `Mot-clé principal + différenciateur | Marque` — accueil : `Métier à Ville — Promesse | Marque`.
- Mot-clé principal dans les 30 premiers caractères.
- Ne pas répéter la marque deux fois, pas de bourrage (`Plombier Bordeaux, plombier 33, plombier pas cher`).
- Un `<h1>` unique par page, différent du `<title>` (le title cible le SERP, le h1 le lecteur).

**Vérification** — extraire tous les titles du sitemap et vérifier qu'il n'y a aucun doublon
(`verif-site.sh` le fait).

---

## 12. Meta descriptions

**Critères**
- Une par page, **unique**, 140-160 caractères.
- Structure : bénéfice + preuve (chiffre, certification, années) + promesse de délai + CTA.
- Contient naturellement le mot-clé (mis en gras par Google quand il correspond à la requête).
- Pas de guillemets doubles non échappés, pas de troncature en plein mot.
- Aucune page importante sans meta description.

**Pièges** — la même description dupliquée sur toutes les pages locales ; une description qui promet
autre chose que le contenu (Google la réécrit alors).

**Vérification** — extraction + contrôle d'unicité et de longueur.

---

## 13. Images pour les réseaux sociaux

**Critères**
- Sur chaque page : `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name`.
- `twitter:card = summary_large_image` + `twitter:title/description/image`.
- Image **1200 × 630 px**, en **URL absolue** (`https://`), poids < 300 Ko, JPG ou PNG (pas de WebP seul :
  certains partages ne l'affichent pas), texte lisible en petit.
- `og:image:alt` renseigné.
- Image spécifique pour l'accueil, chaque prestation et chaque étude de cas — pas le logo partout.

**Pièges** — URL d'image relative (ignorée par Facebook/LinkedIn) ; image trop lourde qui ne se charge
pas dans l'aperçu ; oublier de purger le cache des partages après correction.

**Vérification** — présence des balises + `curl -I` sur l'`og:image` (code 200, taille).

---

## 14. Vrais avis clients

**Critères**
- Avis **réellement reçus**, avec prénom + initiale, ville, **date**, et source (Google, Pages Jaunes, email).
- Idéalement un lien vers la fiche publique d'avis.
- Afficher aussi les avis nuancés : un 5/5 partout paraît faux.
- `Review` / `AggregateRating` en JSON-LD **uniquement** si les avis correspondants sont réellement
  affichés sur la page et vérifiables. Ne jamais baliser un `AggregateRating` inventé ou recopié
  d'ailleurs sans les avis.
- Autorisation d'affichage obtenue.

**Interdit** — inventer, embellir, traduire un avis en changeant le sens, ou générer des avis
« à titre d'illustration ». Voir `juridique-fr.md` : c'est une pratique commerciale trompeuse
sanctionnée en France. Si les avis manquent : `[À FOURNIR : 3 avis Google avec lien et date]`
et point ⛔ dans la validation.

**Vérification** — chaque avis affiché est traçable à une source fournie par le client.

---

## 15. Textes alternatifs sur les images

**Critères**
- Toute image **informative** a un `alt` descriptif : ce qu'on voit + contexte utile
  (`alt="Toiture en ardoise rénovée sur une maison de Mérignac"`).
- Images **décoratives** : `alt=""` (vide, pas absent) pour que les lecteurs d'écran les ignorent.
- ≤ 125 caractères, sans « image de » ni « photo de ».
- Pas de bourrage de mots-clés.
- Les images-liens décrivent la **destination**, pas l'image.
- Les logos : `alt="Logo <Marque>"`. Les photos d'équipe : prénom + rôle.
- Bonus : `loading="lazy"` sauf sur l'image du hero, `width`/`height` renseignés (évite le CLS).

**Vérification** — compter les `<img>` sans attribut `alt` : le total doit être 0.

---

## 16. Schema LocalBusiness

**Critères**
- Sous-type le plus précis possible (`Plumber`, `RoofingContractor`, `Dermatologist`,
  `ProfessionalService`, `HomeAndConstructionBusiness`…), pas `LocalBusiness` générique si mieux existe.
- Champs : `name`, `image`, `logo`, `url`, `telephone`, `email`, `address` (`PostalAddress` complet),
  `geo` (`latitude`/`longitude`), `openingHoursSpecification`, `areaServed`, `priceRange`, `sameAs`.
- **NAP strictement identique** à la fiche Google Business Profile (ponctuation comprise).
- Placé sur l'accueil et la page contact ; `@id` stable pour être référencé par les autres schemas.
- Cohérent avec ce qui est visible sur la page (Google sanctionne le balisage d'infos absentes).

**Vérification** — Rich Results Test + Schema Markup Validator, zéro erreur.
Modèles complets : `schema-jsonld.md`.

---

## 17. Politique de confidentialité

**Critères** (RGPD, art. 13-14)
- Page dédiée `/politique-de-confidentialite`, liée depuis le **footer de toutes les pages** et depuis
  chaque formulaire (case ou mention sous le bouton).
- Contient : identité du responsable de traitement, données collectées, finalités, **base légale**,
  durées de conservation, destinataires/sous-traitants (hébergeur, CRM, Google), transferts hors UE,
  droits (accès, rectification, effacement, opposition, portabilité) + **droit de réclamation auprès de la CNIL**,
  contact RGPD, politique cookies (liste + durées + moyen de retirer le consentement).
- Date de dernière mise à jour.
- **Complément obligatoire en France** : page **Mentions légales** (LCEN) — raison sociale, forme
  juridique, capital, SIREN/RCS, TVA, adresse, téléphone, email, directeur de la publication,
  **hébergeur avec son adresse et son téléphone**.

**Pièges** — copier-coller un modèle sans remplacer les champs (le pire signal de négligence) ;
oublier les mentions légales ; oublier de citer Google Analytics dans les sous-traitants.

**Vérification** — zéro `[À FOURNIR]` restant, aucun `Nom de l'entreprise` générique.
Modèle : `assets/politique-confidentialite.md.template`.

---

## 18. Google Analytics

**Critères**
- GA4 déployé **via Google Tag Manager** (un seul conteneur, pas de gtag en double).
- **Consent Mode v2** initialisé en `denied` par défaut, avant tout tag.
- Bandeau de consentement conforme CNIL : bouton « Refuser » **aussi accessible et visible** que
  « Accepter » dès le premier niveau, pas de case pré-cochée, choix mémorisé ~6 mois, moyen de revenir
  sur son choix depuis le footer.
- Aucun tag de mesure ne se déclenche avant le consentement.
- Événements de conversion configurés : `generate_lead` (formulaire), `click_phone` (`tel:`),
  `click_whatsapp`, vue de `/merci`, `click_directions`.
- Anonymisation par défaut (GA4 le fait), rétention des données paramétrée.
- Search Console vérifiée et sitemap soumis.

**Vérification** — DevTools : aucun appel `google-analytics.com`/`googletagmanager.com/gtag` avant clic
sur « Accepter » ; GA4 DebugView reçoit les événements après consentement.
Implémentation : `tracking-ga4-gtm.md`.

---

## 19. Carte et itinéraire

**Critères**
- Sur la page contact (et le footer si pertinent) : carte **chargée au clic** (placeholder image +
  bouton « Afficher la carte »), pour éviter de déposer des cookies Google avant consentement et
  d'alourdir la page.
- Bouton **« Itinéraire »** en lien direct : `https://www.google.com/maps/dir/?api=1&destination=<adresse+encodée>`
  (et lien Apple Plans si clientèle iPhone : `https://maps.apple.com/?daddr=...`).
- Adresse en texte **sélectionnable** à côté de la carte (jamais uniquement dans l'image).
- `title` sur l'iframe, `loading="lazy"`, dimensions fixées.
- Infos d'accès utiles : parking, transports, étage, code.

**Pièges** — iframe Google Maps chargée d'office (cookies avant consentement) ; carte centrée sur la
mauvaise adresse ; adresse uniquement présente dans la carte, donc invisible pour Google.

**Vérification** — le bouton itinéraire ouvre bien la bonne destination ; aucun appel Google Maps
avant interaction.

---

## 20. Photos de l'équipe

**Critères**
- **Vraies photos** du dirigeant / de l'équipe. Jamais de banque d'images pour représenter des personnes
  réelles — c'est la première chose qui détruit la confiance quand le visiteur la reconnaît.
- Sur une page « À propos » ou « Notre équipe », et une photo dans le hero ou près du CTA si possible.
- Chaque personne : prénom (+ nom si accepté), rôle, une ligne de contexte.
- `alt` = prénom + rôle (`alt="Clément Guyenne, gérant, sur un chantier à Bordeaux"`).
- Images optimisées : ≤ 200 Ko, dimensions d'affichage, `loading="lazy"` hors hero.
- Optionnel : schema `Person` rattaché à l'organisation.
- Autorisation d'utilisation de l'image des personnes (droit à l'image).

**Alternative acceptable si aucune photo** : photos de chantier/atelier montrant l'équipe au travail,
même de dos. **Non acceptable** : portraits d'inconnus achetés en stock.

**Vérification** — les photos correspondent à des personnes réellement liées à l'entreprise.
