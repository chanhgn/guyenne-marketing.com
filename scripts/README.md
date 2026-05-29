# Scripts d'anonymisation

Floutage **du bandeau des yeux** sur des photos (la peau / la lésion restent
visibles — pensé pour les avant/après dermatologiques). Détection automatique
via MediaPipe + reprise manuelle pour les cas que l'auto ne sait pas traiter.

## Installation

```bash
# Traitement automatique (serveur ou poste) :
pip install opencv-python-headless mediapipe numpy Pillow

# Pour le mode MANUEL (fenêtre graphique), il faut la version NON headless :
pip install opencv-python mediapipe numpy Pillow
```

Le modèle de détection (`face_landmarker.task`, ~3,7 Mo) se télécharge tout seul
au premier lancement.

## Les 3 outils

### 1. Un seul dossier — `blur_images_eyes.py`
```bash
python3 scripts/blur_images_eyes.py <dossier_entree> <dossier_sortie>
```

### 2. Toute une arborescence — `blur_batch.py`
Parcourt tous les sous-dossiers (ACNE, BOTOX, ROSACEE…) et recrée la structure.
```bash
python3 scripts/blur_batch.py <racine_entree> <racine_sortie>

# Avec renommage anonyme des fichiers (recommandé : les noms contiennent
# les patients) + table de correspondance CSV à garder en lieu sûr :
ANON=1 python3 scripts/blur_batch.py <racine_entree> <racine_sortie>
```
- Ignore les doublons `Copy of X` quand `X` existe dans le même dossier.
- `ANON=1` renomme en `DOSSIER_001_avant.jpg` et écrit `_correspondance.csv`
  à la racine de sortie (⚠ ce CSV contient les vrais noms).

### 3. Reprise manuelle — `blur_manual.py` (à lancer en LOCAL)
Pour les photos signalées « à reprendre » (gros plans front/yeux, etc.).
```bash
python3 scripts/blur_manual.py <dossier_sortie>
```
Par défaut ne propose que les photos de `_A_REPRENDRE.txt` (mets `ALL=1` pour
toutes). On trace le bandeau à la souris. Commandes : `glisser`=zone,
`a`/Entrée=appliquer+suivante, `p`=pré-remplir auto, `u`=annuler, `r`=reset,
`s`=passer, `q`=quitter. **Modifie les fichiers sur place.**

## ⚠️ Important pour l'usage médical

Les détecteurs de visage sont entraînés sur des **visages entiers**. Sur les
**gros plans** typiques en dermato (front seul, œil au bord, photo tournée),
ils ratent souvent l'œil ou se trompent. Pour ne **jamais** laisser un œil
exposé en croyant avoir réussi, le mode auto est **STRICT** : il ne floute que
les visages fiables et **liste tout le reste** dans `_A_REPRENDRE.txt`.

> Sur un échantillon réel de gros plans BOTOX, l'auto a tout renvoyé en
> « à reprendre » → la reprise manuelle (`blur_manual.py`) est l'outil principal
> pour ce type d'archive, l'auto n'étant fiable que sur les vrais plans visage.
>
> « Aucun visage détecté » **ne garantit pas** l'absence d'yeux : vérifier
> chaque photo de la liste.

## Réglages (variables d'environnement)

| Variable     | Défaut | Rôle                                          |
|--------------|--------|-----------------------------------------------|
| `PAD_X`      | 0.35   | Marge horizontale du bandeau (+35%)           |
| `PAD_Y`      | 0.80   | Marge verticale du bandeau (+80%)             |
| `CONF`       | 0.4    | Confiance min. de détection (↑ = plus strict) |
| `MAX_OOB`    | 0.02   | % max de points hors-cadre tolérés            |
| `MIN_SIZE`   | 0.25   | Taille min. du visage / image                 |
| `ANON`       | 0      | (batch) renommage anonyme + CSV               |
| `ALL`        | 0      | (manual) passer en revue toutes les images    |
| `MODEL_PATH` | auto   | Chemin du modèle `.task`                       |

## Vidéos (rushes) — voir aussi
`blur_face.py` (visage entier), `blur_mouth.py` (bouche),
`blur_keyframes.py` / `blur_kf.py` (bandeau réglé par keyframes).
