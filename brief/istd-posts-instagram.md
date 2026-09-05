# Premiers posts — @istd.fes

**4 visuels 1080 × 1350 (4:5) · `out/insta/`**

Le format 4:5 est celui qui occupe le plus de hauteur dans le fil Instagram.
Les fonds alternent noir / bleu / beige / noir : en vue grille 3 colonnes, ça
donne un damier lisible plutôt qu'un bloc uniforme.

Ordre de publication : 1, 2, 3, 4, un post tous les deux jours. Le premier
ancre le compte, les trois suivants installent l'argument.

---

## 1 · Carte d'identité — `Post1Identite.png`

> Bienvenue sur le compte officiel de l'ISTD Fès.
>
> Institut Spécialisé en Technologies d'Art Dentaire. On forme des prothésistes
> dentaires depuis 2006, ici à Fès. Plus de 500 diplômés sont passés par nos
> laboratoires.
>
> Sur ce compte : le métier, la formation, les débouchés, et la vie de l'institut.
>
> 📍 Fès · istd.ma
> 📲 Vos questions en message privé, on répond dans la journée.
>
> #ISTDFès #ProthèseDentaire #Fès #FormationMaroc #ArtDentaire #OrientationBac

---

## 2 · Le métier — `Post2Metier.png`

> C'est quoi, un prothésiste dentaire ?
>
> Quand le dentiste pose une couronne, un bridge ou un appareil, quelqu'un l'a
> fabriqué. C'est lui. Il travaille en laboratoire, à la main et sur machine, au
> dixième de millimètre.
>
> C'est un métier de la santé — mais on n'y entre pas par médecine. Trois ans
> après le bac suffisent.
>
> Des questions sur le métier ? Écrivez-nous.
>
> #ProthésisteDentaire #MétierDeLaSanté #Fès #OrientationBac #ISTDFès #Bac2026

---

## 3 · Le débouché — `Post3Debouche.png`

> 9 diplômés sur 10 travaillent dans l'année qui suit le diplôme.
>
> Ce n'est pas une promesse commerciale, c'est le chiffre de nos promotions. Au
> Maroc, environ 1 200 structures — laboratoires, cliniques, cabinets — recrutent
> des prothésistes dentaires. Le métier manque de bras, et ça se voit à l'embauche.
>
> Côté salaire : de 4 500 DH en début de carrière à 15 000 DH après cinq ans
> d'expérience.
>
> Le détail est sur istd.ma/debouches
>
> #Débouchés #EmploiMaroc #ProthèseDentaire #Fès #ISTDFès #MétierQuiRecrute

---

## 4 · L'international — `Post4International.png`

> Le diplôme ne s'arrête pas à la frontière.
>
> La Belgique, la France, l'Allemagne et le Canada manquent de prothésistes
> dentaires. Ce sont des métiers en tension là-bas, et le diplôme marocain,
> accrédité par l'État, y est reconnu.
>
> Les montants affichés sont des salaires moyens du métier, toutes expériences
> confondues, convertis en dirhams. Pas des salaires de débutant.
>
> Se former à Fès, pouvoir exercer ailleurs.
>
> #MétierEnTension #DiplômeReconnu #ProthèseDentaire #Fès #ISTDFès #TravaillerÀLÉtranger

---

## Points de vigilance

**La reconnaissance à l'étranger** (post 4) vient de la direction de l'ISTD, pas
d'une source publiée. C'est la seule affirmation du lot qui mérite une
confirmation écrite de Saloua avant publication : elle est vérifiable par
n'importe quel candidat, et une approximation ici coûterait la crédibilité de
tout le reste.

**Aucune date de rentrée n'est affichée.** Tant qu'on ne sait pas si les
inscriptions restent ouvertes après le 7 septembre, les quatre posts tiennent
sans mention de calendrier — ils restent valables quelle que soit la réponse.

**Pas de visage.** Aucune photo de personne, donc aucun risque de laisser croire
qu'un visage générique serait un étudiant de l'ISTD. Les vraies photos de
promotion, quand il y en aura, seront plus fortes que n'importe quel visuel
construit.

---

## Photos Magnific en réserve

Quatre photos ont été générées pour ce compte et sont dans le projet Personnel
du compte Magnific — établi de laboratoire, mains d'un technicien sculptant une
couronne, technicien de dos à l'établi, à-plat d'instruments. Elles n'ont pas pu
être rapatriées ici (le CDN de Magnific est bloqué par la politique réseau de
cette session), donc les posts ci-dessus sont construits en typographie pure,
comme les vidéos.

Les photos restent utiles pour la suite du fil : elles se téléchargent depuis
magnific.com et se glissent en fond derrière les mêmes calques de texte.

Techniquement, les quatre compositions sont dans `src/istd/Posts.tsx` et se
re-rendent avec `npx remotion still src/istd/index.ts <Post…> out/insta/<Post…>.png`.
