# Charte graphique et éditoriale — ISTD Fès

**Document autonome.** Il contient tout ce qu'il faut pour produire un visuel, une
page, une vidéo ou un texte pour l'ISTD sans rien avoir à redemander. À coller au
début d'une conversation, ou à joindre en pièce jointe.

Établi en septembre 2026 par BYG Communication / GUYENNE ÉTUDES MAROC, à partir du
kit Elementor d'istd.ma, du logo officiel et des informations de la direction.

---

## 1. L'institut

**ISTD — Institut Spécialisé en Technologies d'Art Dentaire**
École privée de formation de prothésistes dentaires, à Fès, Maroc. Ouverte en 2006.

Elle forme au diplôme de **Technicien Spécialisé en Prothèse Dentaire**, Bac+3,
reconnu par l'État marocain (arrêté DFP n° 5/10/3/2006).

Le prothésiste dentaire fabrique les couronnes, bridges, appareils et prothèses que
le dentiste pose. C'est un métier d'atelier et de précision, dans le secteur de la
santé, auquel on accède sans passer par des études de médecine. Ce dernier point est
l'argument central de toute la communication : la plupart des gens ignorent que ce
métier existe.

**Site** : istd.ma (FR et AR, Polylang)
**Instagram** : @istd.fes

---

## 2. Logo

Fichier de référence : `logo-istd.png` — 768 × 703 px, RGBA, fond transparent.

Le logo associe une **dent stylisée en trait**, le sigle **ISTD** en capitales
italiques grasses, et une **forme d'aile orange et bleue** à droite.

### Règles

| Situation | Traitement |
|---|---|
| Fond clair (blanc, beige, `#FAF6F3`) | Logo en couleurs d'origine |
| Fond sombre (`#1C1C1C`, noir) | Logo en blanc plein — filtre CSS `brightness(0) invert(1)` |
| Fond bleu de marque (`#0C0CC4`) | Logo en blanc plein, même filtre |
| Fond orange (`#F4380F`) | Logo en blanc plein |

- Le logo est du trait, il supporte bien l'aplat blanc : les détails de la dent
  restent lisibles jusqu'à environ 70 px de haut.
- **Ne jamais recolorer** le logo dans une autre teinte que ses couleurs d'origine
  ou le blanc plein.
- **Ne jamais le régénérer par IA.** Un modèle génératif produit une imitation
  approximative. Le logo se composite toujours à partir du fichier PNG.
- Zone de respiration minimale autour du logo : la hauteur du sigle « ISTD ».

---

## 3. Couleurs

Le logo impose un duo orange / bleu que le site sous-exploitait : le bleu était rangé
en « Accent 3 » du kit Elementor et n'apparaissait presque nulle part. La charte le
remet à parité avec l'orange.

### Duo de marque

| Rôle | Hex | Usage |
|---|---|---|
| Orange ISTD | `#F4380F` | Accent principal, chiffres clés, soulignements, CTA |
| Bleu ISTD | `#0C0CC4` | Aplats de fond, blocs de titre, second niveau d'accent |

### Surfaces

| Rôle | Hex | Usage |
|---|---|---|
| Fond clair | `#FAF6F3` | Fond par défaut des supports clairs, blanc cassé chaud |
| Fond beige | `#F3E9E1` | Fond secondaire, encarts, blocs de citation |
| Fond sombre | `#1C1C1C` | Fond par défaut des supports sombres |
| Noir | `#000000` | Réservé aux fonds vidéo pleins |
| Blanc | `#FFFFFF` | Texte sur fond sombre, surfaces de carte |

### Texte

| Rôle | Hex | Usage |
|---|---|---|
| Titres | `#110E0E` | Titres sur fond clair |
| Texte courant | `#493C3C` | Paragraphes sur fond clair |

### Accents chauds (issus du kit Elementor)

| Rôle | Hex | Usage |
|---|---|---|
| Chaud 1 | `#E9BFB3` | Sur-titres et légendes sur fond sombre ou bleu |
| Chaud 2 | `#D7CAC6` | Texte secondaire sur fond sombre |
| Chaud 3 | `#DBC1BD` | Notes de bas de visuel, mentions |
| Filet | `#DCDCDE` | Séparateurs sur fond clair |

### Règles d'emploi

- **Une seule couleur d'accent par visuel.** L'orange porte le chiffre ou le mot
  clé ; le reste reste neutre. Un visuel où l'orange et le bleu se disputent
  l'attention est raté.
- Les neutres sont **chauds**, jamais des gris purs. C'est ce qui donne au système
  sa parenté avec le logo.
- L'orange `#F4380F` sur blanc donne un contraste d'environ 4,1:1 : suffisant pour
  du gros texte (24 px gras et plus), insuffisant pour du texte courant. Pour du
  petit texte sur fond clair, utiliser `#110E0E` ou `#493C3C`.
- Sur fond sombre `#1C1C1C`, l'orange passe très bien, y compris en petit.

---

## 4. Typographie

| Rôle | Famille | Graisses | Où |
|---|---|---|---|
| Titres, chiffres | **Jost** | 400 → 700 (600 par défaut) | H1, H2, nombres clés |
| Texte courant | **Inter** | 400 → 600 | Paragraphes, légendes, sur-titres |
| Arabe / darija | **Cairo** | 400 → 700 | Toute la version arabe |

Piles de repli :

```
Jost  → "Jost", "Helvetica Neue", Helvetica, Arial, sans-serif
Inter → "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif
Cairo → "Cairo", "Tajawal", "Noto Naskh Arabic", sans-serif
```

Les trois sont sur Google Fonts. Pour un rendu reproductible hors ligne, les fichiers
woff2 variables sont dans le dépôt (`public/istd-fonts/`) et chargés via l'API
FontFace — ce sont des polices variables, donc n'importe quelle graisse de la plage
est disponible sans fichier supplémentaire.

### Réglages

- **Sur-titres** : Inter 600, majuscules, `letter-spacing: 0.2em`. En arabe, ni
  majuscules ni letter-spacing (l'arabe n'a pas de casse et l'interlettrage casse
  les ligatures).
- **Grands titres** : Jost 700, `letter-spacing: -0.03em`, interligne 1,02 à 1,10.
- **Texte courant** : Inter 400, interligne 1,5.
- **En arabe** : réduire la taille d'environ 10 % par rapport au français et monter
  l'interligne à 1,35 — le Cairo a un œil plus grand et des jambages plus hauts.

---

## 5. Composition

| Support | Dimensions |
|---|---|
| Reel / Story Instagram | 1080 × 1920 (9:16), 30 fps |
| Post feed Instagram | 1080 × 1350 (4:5) |
| Post carré | 1080 × 1080 |

**Marges de sécurité en 9:16** : 88 px sur les côtés, 150 px en haut,
**300 px en bas** — cette marge basse est large exprès, elle passe au-dessus de
l'interface Instagram (pseudo, légende, boutons).

**En grille Instagram**, alterner les fonds d'un post à l'autre (sombre, bleu, clair,
sombre…). Une suite de posts sur le même fond donne un bloc illisible en vue
3 colonnes.

**Le mot porteur de chaque visuel est en orange**, le reste en blanc ou en encre.
Un seul mot, pas trois.

---

## 6. Arabe et sens de lecture — les pièges

Trois bugs distincts se sont produits pendant la production de la vidéo. Ils se
confondent facilement et se corrigent différemment.

### a) Les nombres coupés par l'algorithme bidi

« 3 000 » s'affiche « 000 3 » en contexte RTL, parce que l'espace normale est un
caractère neutre que l'algorithme bidirectionnel rattache au sens du texte
environnant.

**Correctif** : utiliser une **espace insécable U+00A0** comme séparateur de
milliers, et donner `dir="ltr"` au conteneur du nombre. Écrire « 2026/2027 » sans
espaces autour de la barre. Écrire « Bac+3 » en caractères latins.

### b) Les séquences inversées

Une progression « 4 500 → 15 000 » doit se lire de droite à gauche en arabe : le
montant de départ à **droite**, la flèche pointant vers la **gauche**.

**Correctif** : mettre `scaleX(-1)` sur la flèche. Un glyphe n'est pas retourné par
la direction d'écriture, seule la disposition des boîtes l'est.

### c) La sur-inversion — le piège principal

Un conteneur en `dir="rtl"` avec `flex-direction: row` place **déjà** le premier
enfant à droite : en CSS, `row` suit le sens d'écriture. Ajouter `row-reverse`
« pour corriger » annule ce retournement et remet la ligne en ordre latin, donc à
l'envers pour un arabophone.

**Correctif** : garder `flex-direction: row` sans condition. Ne jamais mettre
`row-reverse` en RTL. Le raisonnement « l'arabe se lit à l'envers donc il faut
inverser » est faux — le navigateur l'a déjà fait.

### Alignement

`flex-start` et `text-align: start` suivent le sens d'écriture : en RTL ils
désignent la droite. Utiliser `flex-end` alignerait à gauche, ce qui est l'erreur
inverse.

### Vérification rapide

Rendre une image du visuel arabe et vérifier qu'un montant de départ est bien à
droite de son montant d'arrivée. Si la flèche paraît juste mais que les nombres sont
dans le mauvais ordre, c'est le cas (c).

---

## 7. Ton

**En français** : direct, concret, adulte. On parle à une personne, pas à une foule.
Des phrases courtes. Des chiffres plutôt que des adjectifs. Pas de vocabulaire
d'école privée (« excellence », « épanouissement », « accompagnement
personnalisé »).

**En darija** : la langue parlée de Fès, pas l'arabe classique. Les mots techniques
se disent en français et c'est volontaire — « diplôme », « Bac+3 », « labo »,
« click ». Personne ne dit autrement, et traduire ces mots sonnerait faux.

**Ce qu'on ne fait pas** :
- Pas d'apostrophe personnelle du lecteur (« Tu es au chômage ? », « Tu ne sais pas
  quoi faire après le bac ? »). C'est mauvais éditorialement, et Meta refuse les
  annonces qui laissent entendre qu'elles connaissent la situation du lecteur.
- Pas de ton « annonce de radio », pas de majuscules criées, pas de triple point
  d'exclamation.
- Pas d'emoji en série. Un, à la rigueur, en fin de légende.

**Principe de rédaction pour la vidéo** : le texte affiché et le texte dit ne sont
pas le même texte. L'écran porte les chiffres exacts et les mentions ; la voix ne
garde que ce qui doit être entendu. Une publicité qu'on lit et qu'on entend en même
temps n'a pas besoin de dire deux fois la même chose.

---

## 8. Ce qu'on peut affirmer

Chiffres vérifiés, utilisables sans réserve :

| Fait | Source |
|---|---|
| Institut ouvert depuis 2006 | Site et documents de l'école |
| Diplôme Bac+3 reconnu par l'État | Arrêté DFP n° 5/10/3/2006 |
| 3 ans · 6 semestres · 2 808 heures | Programme publié |
| 68 % de pratique en laboratoire | Programme publié |
| Plus de 500 diplômés | Site |
| 90 % trouvent un emploi dans l'année qui suit le diplôme | istd.ma/debouches, promotion 2024 |
| Promotion limitée à 108 étudiants · 5 formateurs | Site |
| Salaire : 4 500 DH en début de carrière | Grille publiée sur istd.ma/debouches |
| Salaire : 15 000 DH après 5 ans | Direction ISTD (Mme El Hraiki) |
| 1 200 entreprises recrutent au Maroc | Direction ISTD (Mme El Hraiki) |

Partenaires citables : SMART Lab, Laboratoire dentaire SABEL RACHID, Global Dentaire,
Maroc Dentaire Benjelloun, Digital Lab.

### Salaires moyens à l'étranger, convertis en dirhams

Moyennes brutes du métier, **toutes expériences confondues** — ce ne sont pas des
salaires de débutant, et il faut le préciser à chaque fois qu'on les affiche.

| Pays | Local | ≈ DH / mois |
|---|---|---|
| Suisse | ≈ 6 500 CHF | 74 000 |
| Émirats | ≈ 3 500 $US | 35 000 |
| Pays-Bas | ≈ 3 050 € | 32 000 |
| Belgique | ≈ 3 000 € | 32 000 |
| France | ≈ 2 500 € | 27 000 |
| Royaume-Uni | ≈ 2 080 £ | 26 000 |
| Allemagne | ≈ 2 400 € | 26 000 |
| Canada | ≈ 3 460 $CA | 25 000 |
| Italie | ≈ 2 030 € | 21 000 |
| Arabie saoudite | ≈ 5 650 SAR | 15 000 |

---

## 9. Ce qu'on n'affirme pas

- **Aucune promesse de visa.** L'idée avait été demandée puis écartée : aucune source
  ne l'étaye, et la formulation « visas faciles » ressemble aux annonces frauduleuses
  qui circulent sur le sujet. Elle exposerait l'école.
- **Aucun emploi garanti.** Le chiffre de 90 % est une statistique de promotion, pas
  un engagement.
- **Aucun nombre de places restantes inventé.** L'école ne le communique pas.
  Formulation retenue : « Places limitées », qui est la mention publiée sur le site.
- **La reconnaissance du diplôme à l'étranger** (Belgique, France, Allemagne, Canada)
  vient de la direction, pas d'une source publiée. C'est l'affirmation la plus
  fragile du lot : à faire confirmer par écrit avant chaque nouvelle publication qui
  s'appuie dessus.
- **Aucun visage généré par IA** présenté comme un étudiant de l'ISTD. Pour les
  visuels, préférer les mains, les gestes, les plans d'atelier. Les vraies photos de
  promotion valent mieux que n'importe quel visuel construit.

---

## 10. Coordonnées

| | |
|---|---|
| Adresse | 5, avenue Ibn Khatib — Quartier Atlas, Fès (face à la maison Mercedes) |
| Mobile / WhatsApp | **+212 661-256965** |
| Fixes | 05 35 65 96 82 · 05 35 73 10 90 |
| E-mail | **contact@istd.ma** |
| Horaires | Lundi à samedi, 9h – 18h |
| Site | istd.ma · page d'inscription : istd.ma/inscription |

**Deux points de vigilance :**

L'adresse **istdentaire@gmail.com a été piratée**. Elle ne doit apparaître nulle
part. Elle figure encore sur des annuaires externes (Telecontact, Etudiant.ma,
Annuaire-Gratuit, Glunis) et devrait y être corrigée.

Trois numéros fixes circulent encore selon les sources (0535 65 96 82, 0535 73 10 90,
0535 65 54 58). Seuls les deux premiers sont retenus. Tous les **mobiles** ont été
unifiés sur +212 661-256965 ; les fixes sont conservés tels quels.

---

## 11. Environnement technique du site

WordPress 6.9.7 · PHP 8.3 · Hello Elementor + Elementor Pro · Polylang (FR/AR) ·
FluentForm (formulaire d'inscription, ID 5) · LiteSpeed · Metricool ·
Google Site Kit · plugin maison `istd-whatsapp-button`.

Pipeline vidéo et visuels : Remotion 4.0.380, rendu via `chrome-headless-shell`.

---

## 12. Jetons prêts à l'emploi

### CSS

```css
:root{
  /* Duo de marque */
  --istd-orange:#F4380F;
  --istd-blue:#0C0CC4;
  /* Surfaces */
  --istd-bg-light:#FAF6F3;
  --istd-bg-beige:#F3E9E1;
  --istd-bg-dark:#1C1C1C;
  --istd-black:#000000;
  --istd-white:#FFFFFF;
  /* Texte */
  --istd-heading:#110E0E;
  --istd-body:#493C3C;
  /* Accents chauds */
  --istd-warm-1:#E9BFB3;
  --istd-warm-2:#D7CAC6;
  --istd-warm-3:#DBC1BD;
  --istd-line:#DCDCDE;
  /* Typographie */
  --istd-display:"Jost","Helvetica Neue",Helvetica,Arial,sans-serif;
  --istd-text:"Inter","Helvetica Neue",Helvetica,Arial,sans-serif;
  --istd-arabic:"Cairo","Tajawal","Noto Naskh Arabic",sans-serif;
}
```

### TypeScript / JavaScript

```ts
export const istd = {
  orange: '#F4380F',
  blue: '#0C0CC4',
  bgLight: '#FAF6F3',
  bgBeige: '#F3E9E1',
  bgDark: '#1C1C1C',
  bgBlack: '#000000',
  white: '#FFFFFF',
  heading: '#110E0E',
  body: '#493C3C',
  warm1: '#E9BFB3',
  warm2: '#D7CAC6',
  warm3: '#DBC1BD',
  line: '#DCDCDE',
} as const;

export const istdFonts = {
  display: '"Jost", "Helvetica Neue", Helvetica, Arial, sans-serif',
  body: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  arabic: '"Cairo", "Tajawal", "Noto Naskh Arabic", sans-serif',
} as const;
```

### Tailwind

```js
theme: {
  extend: {
    colors: {
      istd: {
        orange:'#F4380F', blue:'#0C0CC4',
        light:'#FAF6F3', beige:'#F3E9E1', dark:'#1C1C1C',
        heading:'#110E0E', body:'#493C3C',
        warm1:'#E9BFB3', warm2:'#D7CAC6', warm3:'#DBC1BD', line:'#DCDCDE',
      },
    },
    fontFamily: {
      display:['Jost','Helvetica Neue','Arial','sans-serif'],
      body:['Inter','Helvetica Neue','Arial','sans-serif'],
      arabic:['Cairo','Tajawal','Noto Naskh Arabic','sans-serif'],
    },
  },
}
```

### Import Google Fonts

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600&family=Jost:wght@400;600;700&display=swap">
```

---

## 13. Ce qui existe déjà

| Livrable | Fichier |
|---|---|
| Reel sponsorisé darija | `ISTD-reel-DARIJA-1080x1920.mp4` — 36,5 s |
| Reel sponsorisé français | `ISTD-reel-FR-1080x1920.mp4` — 30,0 s |
| Les 16 plans isolés | `ISTD-clips-par-plan.zip` |
| 4 posts Instagram de lancement | `Post1Identite.png` … `Post4International.png` (1080 × 1350) |
| Logo officiel | `logo-istd.png` (768 × 703, transparent) |

Sources dans le dépôt `chanhgn/guyenne-marketing.com`, branche
`claude/istd-sponsored-video-prbp88` : `src/istd/` pour les compositions Remotion,
`brief/` pour les documents.
