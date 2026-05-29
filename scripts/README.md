# Scripts d'anonymisation

## Photos (images fixes) — bandeau yeux

`blur_images_eyes.py` traite **un dossier entier de photos** et applique un
bandeau de floutage **sur les yeux uniquement** (la peau, le teint et la lésion
restent visibles — pensé pour les avant/après dermatologiques).

```bash
pip install opencv-python-headless mediapipe numpy
python3 scripts/blur_images_eyes.py <dossier_entree> <dossier_sortie>
```

Le modèle de détection (`face_landmarker.task`, ~3,7 Mo) se télécharge
automatiquement au premier lancement.

### Mode STRICT (important pour l'usage médical)

Les détecteurs de visage sont entraînés sur des **visages entiers**. Sur les
**gros plans / cadrages partiels** typiques en dermato (front seul, œil au bord,
lèvre, etc.), ils peuvent rater l'œil ou placer le bandeau au mauvais endroit.

Pour ne **jamais** laisser un œil exposé en croyant avoir réussi, le script
ne floute QUE les visages jugés entiers et fiables. Tout le reste n'est PAS
flouté et est listé dans `<dossier_sortie>/_A_REPRENDRE.txt` pour traitement
manuel.

> ⚠ « Aucun visage détecté » ne garantit PAS l'absence d'yeux sur la photo.
> Vérifier visuellement chaque entrée de la liste `_A_REPRENDRE.txt`.

### Réglages (variables d'environnement)

| Variable     | Défaut | Rôle                                          |
|--------------|--------|-----------------------------------------------|
| `PAD_X`      | 0.35   | Marge horizontale du bandeau (+35%)           |
| `PAD_Y`      | 0.80   | Marge verticale du bandeau (+80%)             |
| `CONF`       | 0.5    | Confiance min. de détection (↑ = plus strict) |
| `MAX_OOB`    | 0.02   | % max de points hors-cadre tolérés            |
| `MIN_SIZE`   | 0.30   | Taille min. du visage / image                 |
| `MODEL_PATH` | auto   | Chemin du modèle `.task`                       |

Exemple plus permissif (détecte plus de visages, à vérifier davantage) :

```bash
CONF=0.3 MIN_SIZE=0.20 python3 scripts/blur_images_eyes.py in/ out/
```

## Vidéos (rushes) — voir aussi

- `blur_face.py` — floute le visage entier (vidéo)
- `blur_mouth.py` — floute la bouche (vidéo)
- `blur_keyframes.py`, `blur_kf.py` — bandeau réglé à la main par keyframes (vidéo)
