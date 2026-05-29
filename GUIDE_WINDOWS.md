# Guide simple — Anonymiser les yeux des photos (Windows)

Aucune connaissance technique nécessaire. Tu fais surtout des **double-clics**.

---

## Étape 1 — Installer Python (une seule fois, ~3 min)

1. Va sur **https://www.python.org/downloads/**
2. Clique sur le gros bouton jaune **« Download Python »**.
3. Ouvre le fichier téléchargé.
4. ⚠️ **TRÈS IMPORTANT** : en bas de la première fenêtre, **coche la case
   « Add Python to PATH »**, puis clique sur **« Install Now »**.
5. Attends la fin, puis ferme.

> Si tu sautes la case « Add Python to PATH », les scripts ne marcheront pas.

---

## Étape 2 — Récupérer l'outil

1. Va sur la page du projet :
   **https://github.com/chanhgn/guyenne-marketing.com/tree/claude/pensive-turing-FjjXA**
2. Clique sur le bouton vert **« Code »** puis **« Download ZIP »**.
3. Ouvre le fichier ZIP téléchargé et **« Extraire tout »** (clic droit → Extraire).
4. Tu obtiens un dossier `guyenne-marketing.com-...`. Ouvre-le : tu dois y voir
   `Anonymiser_les_yeux.bat` et `Reprendre_a_la_main.bat`.

---

## Étape 3 — Mettre tes photos sur l'ordinateur

Les photos sont sur le Google Drive du cabinet. Deux options :

- **Si tu as Google Drive pour ordinateur** : le dossier est déjà accessible
  comme un dossier normal.
- **Sinon** : sur le Drive, fais un clic droit sur le dossier de photos →
  **« Télécharger »** (il arrive en ZIP) → extrais-le quelque part (ex. Bureau).

---

## Étape 4 — Lancer l'anonymisation automatique

1. Double-clique sur **`Anonymiser_les_yeux.bat`**.
   - La 1re fois, il installe ses outils (1-2 min, c'est normal).
   - *(Si Windows affiche un avertissement bleu « Windows a protégé votre PC »,
     clique « Informations complémentaires » → « Exécuter quand même ».)*
2. Une fenêtre s'ouvre : **choisis le dossier de tes photos**, valide.
3. Laisse travailler. À la fin, un dossier **`..._ANONYMISE`** est créé à côté,
   avec les photos floutées + des noms anonymes.

---

## Étape 5 — Finir les photos « à reprendre »

L'automatique ne sait pas traiter tous les gros plans (front, œil au bord…).
Elles sont listées dans le fichier `_A_REPRENDRE.txt` du dossier résultat.

1. Double-clique sur **`Reprendre_a_la_main.bat`**.
2. Choisis le dossier **`..._ANONYMISE`** (ou un sous-dossier comme `BOTOX`).
3. Pour chaque photo affichée :
   - **glisse la souris** pour dessiner un rectangle sur les yeux,
   - appuie sur **A** pour appliquer le flou et passer à la suivante,
   - (ou **P** pour une proposition auto, **U** pour annuler, **S** pour passer
     une photo sans yeux, **Q** pour quitter).

---

## ⚠️ À retenir (important)

- **Garde le fichier `_correspondance.csv`** (dans le dossier résultat) **en lieu
  sûr** : il fait le lien entre les noms anonymes et les vrais noms de patients.
  Ne le diffuse pas avec les photos.
- **« Aucun visage détecté » ne veut pas dire « pas d'yeux »** : vérifie chaque
  photo de la liste `_A_REPRENDRE.txt`.
- Tes photos d'origine ne sont **jamais** modifiées : tout est écrit dans le
  dossier `..._ANONYMISE`.

---

Un souci ? Note le message d'erreur affiché dans la fenêtre noire et envoie-le moi.
