#!/usr/bin/env python3
"""
Bibliothèque partagée d'anonymisation (floutage des yeux).

Regroupe la logique commune aux scripts :
  - blur_images_eyes.py  : un dossier
  - blur_batch.py        : récursif (toute l'arborescence) + renommage + CSV
  - blur_manual.py       : tracé manuel du bandeau (pour les ratés de l'auto)

Détection via MediaPipe FaceLandmarker (478 points). Gère la rotation EXIF
(photos de téléphone tournées) et applique une validation STRICTE : on ne
floute que les visages jugés entiers et fiables (sinon on signale).
"""
import os
import urllib.request
import cv2
import numpy as np
from PIL import Image, ImageOps
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision

# --- Points de repère FaceLandmarker (topologie 478 pts) --------------------
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
CONF     = float(os.environ.get('CONF', 0.4))
MAX_OOB  = float(os.environ.get('MAX_OOB', 0.02))
MIN_SIZE = float(os.environ.get('MIN_SIZE', 0.25))

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.environ.get('MODEL_PATH', os.path.join(_SCRIPT_DIR, 'face_landmarker.task'))
MODEL_URL = ("https://storage.googleapis.com/mediapipe-models/face_landmarker/"
             "face_landmarker/float16/1/face_landmarker.task")


def ensure_model():
    if not os.path.isfile(MODEL_PATH):
        print(f"Téléchargement du modèle FaceLandmarker → {MODEL_PATH} ...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print("Modèle téléchargé.\n")


def make_landmarker(conf=None, num_faces=5):
    ensure_model()
    options = mp_vision.FaceLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=MODEL_PATH),
        running_mode=mp_vision.RunningMode.IMAGE,
        num_faces=num_faces,
        min_face_detection_confidence=CONF if conf is None else conf,
    )
    return mp_vision.FaceLandmarker.create_from_options(options)


def load_image_oriented(path):
    """Charge une image en BGR (numpy) en appliquant l'orientation EXIF.
    Retourne None si illisible."""
    try:
        pim = Image.open(path)
        pim = ImageOps.exif_transpose(pim)   # corrige les photos tournées
        pim = pim.convert('RGB')
        rgb = np.array(pim)
        return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    except Exception:
        return None


def face_quality(face):
    """(ok, raison) : décide si un visage détecté est assez fiable à flouter."""
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
    x1 = max(0, int(cx - half_w)); x2 = min(W, int(cx + half_w))
    y1 = max(0, int(cy - half_h)); y2 = min(H, int(cy + half_h))
    return (x1, y1, x2, y2)


def obscure(img, x1, y1, x2, y2):
    """Anonymisation agressive : mosaïque fine + double flou gaussien."""
    x1, y1 = max(0, int(x1)), max(0, int(y1))
    x2, y2 = min(img.shape[1], int(x2)), min(img.shape[0], int(y2))
    if x2 <= x1 or y2 <= y1:
        return
    roi = img[y1:y2, x1:x2]
    h, w = roi.shape[:2]
    tw = max(2, w // 40); th = max(2, h // 40)
    small  = cv2.resize(roi, (tw, th), interpolation=cv2.INTER_AREA)
    mosaic = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    k = max(31, (min(w, h) // 3) | 1)
    blurred = cv2.GaussianBlur(mosaic, (k, k), 0)
    k2 = max(21, (min(w, h) // 6) | 1)
    blurred = cv2.GaussianBlur(blurred, (k2, k2), 0)
    img[y1:y2, x1:x2] = blurred


def blur_eyes_strict(img, landmarker):
    """Détecte et floute les yeux des visages fiables. Modifie img sur place.
    Retourne (n_floutes, reasons)."""
    H, W = img.shape[:2]
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = landmarker.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
    n, reasons = 0, []
    for face in result.face_landmarks:
        ok, why = face_quality(face)
        if not ok:
            reasons.append(why)
            continue
        obscure(img, *eye_rect(face, W, H))
        n += 1
    return n, reasons


def list_images(folder, dedup_copies=True):
    """Liste les images d'un dossier. Si dedup_copies, ignore les
    'Copy of X' quand 'X' existe aussi."""
    files = [f for f in os.listdir(folder)
             if f.lower().endswith(IMG_EXTS) and os.path.isfile(os.path.join(folder, f))]
    if dedup_copies:
        names = set(files)
        kept = []
        for f in files:
            low = f.lower()
            if low.startswith('copy of ') and f[len('Copy of '):] in names:
                continue
            kept.append(f)
        files = kept
    return sorted(files)
