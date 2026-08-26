# 5. Charte graphique de la boutique

La boutique reprend les couleurs de misterjack.ma : rouge `#E3151A`, noir
`#171717`, gris `#EDEDED`, titres en Josefin Sans, textes en Inter.

Rien n'est modifié dans le thème livré par TastyIgniter (`vendor/`) : les
couleurs passent par les réglages du thème, exactement comme si on les avait
saisies dans l'admin. Une mise à jour de TastyIgniter ne les efface donc pas —
et si elle republie sa feuille de style d'origine, `scripts/update.sh` relance
la commande juste après.

## Les deux étages

| Où | Quoi | Fichier |
| --- | --- | --- |
| Réglages du thème | Couleurs, polices, hauteur du logo, bandeau cookies | `data/theme-misterjack.json` |
| Feuille de style | Police des titres, boutons, onglets, pied de page | `public/brand/misterjack.css` |

Le premier étage est recompilé en `app.css` : boutons, liens, pastilles
d'onglets, cases à cocher, barres de progression prennent le rouge de la marque
d'un coup, sans qu'on ait à lister les sélecteurs un par un.

Le second ne garde que ce que les réglages ne savent pas faire : la police des
titres, la casse des boutons, le liseré rouge sous la barre de navigation et
les deux ou trois endroits où le thème écrit son orange en dur.

## Changer une couleur

```bash
cd ~/apps/order
nano data/theme-misterjack.json      # modifier la valeur
php artisan misterjack:brand         # écrire et recompiler
php artisan optimize:clear
```

Le client peut aussi le faire depuis l'admin : **Design > Thèmes > Orange >
Personnaliser**. C'est le même formulaire et les mêmes valeurs. Attention :
relancer `misterjack:brand` plus tard réécrit les couleurs du fichier par-dessus
ses modifications. Tout ce qui n'est pas dans le fichier (le logo, le favicon,
les réseaux sociaux) est conservé dans tous les cas.

## Valeurs retenues

| Réglage | Valeur | Rôle |
| --- | --- | --- |
| Couleur primaire | `#E3151A` | Boutons, liens, onglet actif |
| Couleur du texte | `#171717` | Titres et textes |
| Bordures | `#EDEDED` | Cartes produits, séparateurs |
| Fond du pied de page | `#141414` | Pied de page et bandeau cookies |
| Fond de la navigation | `#FFFFFF` | Barre du haut, pour que le logo reste lisible |
| Police des textes | Inter | Déjà chargée par le thème |
| Police des titres | Josefin Sans | Ajoutée par `AppServiceProvider` |

La barre de navigation reste blanche volontairement : le thème lui applique un
style clair écrit en dur (`navbar-light`), et un fond noir rendrait le bouton
menu du mobile invisible. Le rouge de la marque y est repris par un liseré.

## Vérifié

- `app.css` recompilé : plus aucune trace de l'orange d'origine dans les
  variables du thème.
- La feuille de style de marque est bien assemblée **après** `app.css` — sinon
  elle ne servirait à rien.
- Rendu contrôlé sur la page d'accueil, la carte de Fès et la fiche d'un
  article : boutons rouges, onglets lisibles, pied de page noir, bandeau
  cookies au rouge de la marque.

## Reste à faire côté client

- **Photos** : le thème affiche encore l'image de démonstration en bandeau
  d'accueil et aucune photo sur les restaurants ni sur les articles. Ce sont
  des médias à charger depuis l'admin, pas du code.
- **Logo** : chargé dans les réglages généraux. La hauteur est réglée à 48 px.
