#!/usr/bin/env python3
"""
Anonymisation par lot : bandeau de floutage sur les YEUX — mode STRICT.

Pensé pour des photos dermatologiques avant/après : on masque uniquement la
zone des yeux (anonymisation du regard) tout en gardant la peau, le teint et la
lésion parfaitement visibles.

Détection automatique des visages via MediaPipe FaceLandmarker (API Tasks,
478 points). IMPORTANT : les détecteurs de visage sont entraînés sur des
visages ENTIERS. Sur des gros plans / cadrages partiels (typiques en dermato),
ils peuvent rater l'œil ou mal placer le bandeau. Pour de l'anonymisation
médicale, mieux vaut NE PAS flouter et signaler, que flouter au mauvais endroit
en croyant avoir réussi.

Ce script applique donc une validation STRICTE : il ne floute QUE les visages
jugés entiers et fiables. Tout le reste (visage partiel, détection douteuse,
aucun visage) n'est PAS flouté et part dans une liste « à reprendre ».

Sortie :
  - les images floutées et les images recopiées telles quelles (pour avoir un
    dossier de sortie complet) ;
  - un fichier `_A_REPRENDRE.txt` listant précisément ce qu'il reste à traiter
    manuellement.

Usage:
    python3 scripts/blur_images_eyes.py <dossier_entree> <dossier_sortie>

Options (variables d'environnement) :
    PAD_X       marge horizontale du bandeau     (défaut 0.35 = +35%)
    PAD_Y       marge verticale du bandeau       (défaut 0.80 = +80%)
    CONF        confiance min. de détection      (défaut 0.5)
    MAX_OOB     % max de points hors-cadre tolérés (défaut 0.02 = 2%)
    MIN_SIZE    taille min. du visage / image    (défaut 0.30 = 30%)
    MODEL_PATH  chemin du modèle .task           (auto-téléchargé si absent)
"""
import os
import sys
import shutil
import urllib.request
import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision

# --- Points de repère FaceLandmarker (topologie 478 pts, = FaceMesh) --------
LEFT_EYE  = [33, 7, 163, 144, 145, 153, 154, 155, 133,
             246, 161, 160, 159, 158, 157, 173]
RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263,
             466, 388, 387, 386, 385, 384, 398]
LEFT_BROW  = [70, 63, 105, 66, 107, 46, 53, 52, 65, 55]
RIGHT_BROW = [300, 293, 334, 296, 336, 276, 283, 282, 295, 285]
EYE_POINTS = LEFT_EYE + RIGHT_EYE + LEFT_BROW + RIGHT_BROW

IMG_EXTS = ('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tif', '.tiff')

PAD_X    = float(os.environ.get('PAD_X', 0.35))
PAD_Y    = float(os.environ.get('PAD_Y', 0.80))
CONF     = float(os.environ.get('CONF', 0.5))
MAX_OOB  = float(os.environ.get('MAX_OOB', 0.02))
MIN_SIZE = float(os.environ.get('MIN_SIZE', 0.30))

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.environ.get('MODEL_PATH', os.path.join(_SCRIPT_DIR, 'face_landmarker.task'))
MODEL_URL = ("https://storage.googleapis.com/mediapipe-models/face_landmarker/"
             "face_landmarker/float16/1/face_landmarker.task")


def ensure_model():
    if os.path.isfile(MODEL_PATH):
        return
    print(f"Téléchargement du modèle FaceLandmarker → {MODEL_PATH} ...")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    print("Modèle téléchargé.\n")


def face_quality(face):
    """Retourne (ok, raison). Décide si un visage détecté est assez fiable
    pour être flouté automatiquement."""
    xs = [p.x for p in face]
    ys = [p.y for p in face]
    oob = sum(1 for p in face if p.x < 0 or p.x > 1 or p.y < 0 or p.y > 1)
    oob_ratio = oob / len(face)
    w = max(xs) - min(xs)
    h = max(ys) - min(ys)
    if oob_ratio > MAX_OOB:
        return False, f"visage partiel (hors-cadre {oob_ratio*100:.0f}%)"
    if w < MIN_SIZE or h < MIN_SIZE:
        return False, f"visage trop petit/douteux ({w*100:.0f}x{h*100:.0f}% image)"
    return True, ""


def eye_rect(lm, W, H):
    """Rectangle (x1,y1,x2,y2) couvrant les yeux + sourcils, avec marge."""
    xs = [lm[i].x * W for i in EYE_POINTS]
    ys = [lm[i].y * H for i in EYE_POINTS]
    cx = (max(xs) + min(xs)) / 2
    cy = (max(ys) + min(ys)) / 2
    half_w = (max(xs) - min(xs)) * 0.5 * (1 + PAD_X)
    half_h = (max(ys) - min(ys)) * 0.5 * (1 + PAD_Y)
    x1 = max(0, int(cx - half_w))
    x2 = min(W, int(cx + half_w))
    y1 = max(0, int(cy - half_h))
    y2 = min(H, int(cy + half_h))
    return (x1, y1, x2, y2)


def obscure(img, x1, y1, x2, y2):
    """Anonymisation agressive : mosaïque fine + double flou gaussien."""
    if x2 <= x1 or y2 <= y1:
        return
    roi = img[y1:y2, x1:x2]
    h, w = roi.shape[:2]
    tw = max(2, w // 40)
    th = max(2, h // 40)
    small  = cv2.resize(roi, (tw, th), interpolation=cv2.INTER_AREA)
    mosaic = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    k = max(31, (min(w, h) // 3) | 1)
    blurred = cv2.GaussianBlur(mosaic, (k, k), 0)
    k2 = max(21, (min(w, h) // 6) | 1)
    blurred = cv2.GaussianBlur(blurred, (k2, k2), 0)
    img[y1:y2, x1:x2] = blurred


def process_image(path, landmarker):
    """Retourne (img, n_floutes, reasons). reasons = motifs de rejet éventuels."""
    img = cv2.imread(path)
    if img is None:
        return None, 0, []
    H, W = img.shape[:2]
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = landmarker.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
    n = 0
    reasons = []
    for face in result.face_landmarks:
        ok, why = face_quality(face)
        if not ok:
            reasons.append(why)
            continue
        x1, y1, x2, y2 = eye_rect(face, W, H)
        obscure(img, x1, y1, x2, y2)
        n += 1
    return img, n, reasons


def main():
    if len(sys.argv) < 3:
        sys.exit("Usage: blur_images_eyes.py <dossier_entree> <dossier_sortie>")
    in_dir, out_dir = sys.argv[1], sys.argv[2]
    if not os.path.isdir(in_dir):
        sys.exit(f"Dossier d'entrée introuvable : {in_dir}")
    os.makedirs(out_dir, exist_ok=True)

    files = sorted(
        f for f in os.listdir(in_dir)
        if f.lower().endswith(IMG_EXTS) and os.path.isfile(os.path.join(in_dir, f))
    )
    if not files:
        sys.exit(f"Aucune image trouvée dans {in_dir}")

    ensure_model()
    print(f"{len(files)} image(s) | mode STRICT | CONF={CONF} "
          f"MAX_OOB={MAX_OOB} MIN_SIZE={MIN_SIZE}\n")

    options = mp_vision.FaceLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=MODEL_PATH),
        running_mode=mp_vision.RunningMode.IMAGE,
        num_faces=5,
        min_face_detection_confidence=CONF,
    )

    blurred, to_redo, no_face, failed = [], [], [], []
    with mp_vision.FaceLandmarker.create_from_options(options) as landmarker:
        for f in files:
            src = os.path.join(in_dir, f)
            dst = os.path.join(out_dir, f)
            img, n, reasons = process_image(src, landmarker)
            if img is None:
                failed.append(f)
                print(f"  ✗ {f} : illisible")
                continue
            if n > 0:
                cv2.imwrite(dst, img)
                blurred.append((f, n))
                extra = f" (+{len(reasons)} détection douteuse ignorée)" if reasons else ""
                print(f"  ✓ {f} : {n} visage(s) flouté(s){extra}")
            else:
                # Aucun visage flouté → on recopie l'original tel quel.
                shutil.copy2(src, dst)
                if reasons:
                    to_redo.append((f, reasons))
                    print(f"  ⚠ {f} : À VÉRIFIER — {', '.join(reasons)}")
                else:
                    no_face.append(f)
                    print(f"  ⚠ {f} : À VÉRIFIER — aucun visage détecté "
                          f"(peut quand même contenir des yeux)")

    # --- Rapport ------------------------------------------------------------
    print(f"\n{'='*60}")
    print(f"Terminé. {len(files)} image(s) | {len(blurred)} floutée(s) sûres | "
          f"{len(to_redo) + len(no_face)} à vérifier à la main")
    print('='*60)

    report = os.path.join(out_dir, '_A_REPRENDRE.txt')
    with open(report, 'w') as fp:
        fp.write("PHOTOS À VÉRIFIER / REPRENDRE MANUELLEMENT\n")
        fp.write("Le bandeau yeux n'a PAS été appliqué automatiquement de façon sûre.\n")
        fp.write("⚠ « Aucun visage détecté » ne garantit PAS l'absence d'yeux : "
                 "vérifier chaque photo.\n")
        fp.write("="*70 + "\n\n")
        if to_redo:
            fp.write(">> Visage détecté mais jugé NON fiable (à flouter à la main) :\n")
            for f, reasons in to_redo:
                fp.write(f"   - {f}  [{', '.join(reasons)}]\n")
            fp.write("\n")
        if no_face:
            fp.write(">> Aucun visage détecté (vérifier qu'il n'y a pas d'yeux visibles) :\n")
            for f in no_face:
                fp.write(f"   - {f}\n")
            fp.write("\n")
        if failed:
            fp.write(">> Fichiers illisibles :\n")
            for f in failed:
                fp.write(f"   - {f}\n")
        if not (to_redo or no_face or failed):
            fp.write("Rien à reprendre : toutes les images ont été traitées avec succès.\n")

    if to_redo:
        print(f"\n⚠ {len(to_redo)} photo(s) avec visage détecté NON flouté de façon sûre :")
        for f, reasons in to_redo:
            print(f"    - {f}  [{', '.join(reasons)}]")
    if no_face:
        print(f"\n⚠ {len(no_face)} photo(s) sans visage détecté — à vérifier "
              f"(peuvent contenir des yeux non floutés).")
    print(f"\n📄 Liste complète écrite dans : {report}")


if __name__ == '__main__':
    main()
