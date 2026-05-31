#!/usr/bin/env python3
"""Détection AUTO des traits (oeil -> nez/bouche déduits) et flou fort.
Marche sur les visages de profil où MediaPipe échoue.

Stratégie:
 1. Détecte les yeux (Haar). Garde le candidat le plus plausible (grande
    taille, dans la moitié haute du visage côté droit/gauche selon le profil).
 2. À partir de la boîte oeil, déduit nez et bouche par offsets relatifs.
 3. Floute fortement les 3 zones + logo.

Un offset global (dx, dy, scale) permet d'ajuster sans tout recalculer.
"""
import os, sys, glob, cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import anonymize_lib as A
from PIL import Image

LOGO = Image.open("/tmp/logo_blanc.png").convert("RGBA")
EYE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")


def detect_eye(gray):
    """Retourne la boîte d'oeil la plus plausible (x,y,w,h) ou None."""
    H, W = gray.shape
    boxes = EYE.detectMultiScale(gray, 1.1, 4, minSize=(W//12, W//12))
    if len(boxes) == 0:
        return None
    # candidat: grand, situé dans la moitié supérieure
    cand = [b for b in boxes if b[1] + b[3] < H * 0.6]
    cand = cand or list(boxes)
    # le plus grand
    return max(cand, key=lambda b: b[2] * b[3])


def zones_from_eye(eye, W, H):
    """Déduit 3 rectangles (oeil, nez, bouche) en fractions à partir de la
    boîte oeil en pixels. Calibré sur visage de profil."""
    ex, ey, ew, eh = eye
    u = ew  # unité = largeur de l'oeil
    # oeil élargi
    eye_z = (ex - 0.4*u, ey - 0.5*eh, ex + 1.5*u, ey + 1.6*eh)
    # nez: en dessous et légèrement vers l'avant (droite)
    nose_z = (ex + 0.3*u, ey + 1.6*eh, ex + 2.0*u, ey + 1.6*eh + 2.2*eh)
    # bouche: encore en dessous
    mouth_z = (ex - 0.2*u, ey + 3.8*eh, ex + 1.8*u, ey + 3.8*eh + 1.8*eh)
    out = []
    for (x0, y0, x1, y1) in (eye_z, nose_z, mouth_z):
        out.append((x0/W, y0/H, x1/W, y1/H))
    return out


def blur_zone(img, x0, y0, x1, y1):
    H, W = img.shape[:2]
    x0i, y0i, x1i, y1i = int(x0*W), int(y0*H), int(x1*W), int(y1*H)
    x0i, y0i = max(0, x0i), max(0, y0i)
    x1i, y1i = min(W, x1i), min(H, y1i)
    if x1i <= x0i or y1i <= y0i:
        return
    roi = img[y0i:y1i, x0i:x1i]
    h, w = roi.shape[:2]
    tw = max(2, w // 45); th = max(2, h // 45)
    small = cv2.resize(roi, (tw, th), interpolation=cv2.INTER_AREA)
    mos = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    k = max(61, (min(w, h) // 2) | 1)
    blurred = cv2.GaussianBlur(cv2.GaussianBlur(mos, (k, k), 0), (k, k), 0)
    m = np.zeros((h, w), np.uint8)
    cv2.rectangle(m, (0, 0), (w, h), 255, -1)
    fk = max(11, (min(w, h)//4) | 1)
    m = cv2.GaussianBlur(m, (fk, fk), 0)
    m3 = cv2.cvtColor(m, cv2.COLOR_GRAY2BGR).astype(float)/255
    img[y0i:y1i, x0i:x1i] = (blurred*m3 + roi*(1-m3)).astype(np.uint8)


def add_logo(img):
    H, W = img.shape[:2]
    im = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    lw = int(W*0.30); lh = int(lw*LOGO.height/LOGO.width)
    lg = LOGO.resize((lw, lh), Image.LANCZOS)
    im.paste(lg, ((W-lw)//2, int(H*0.03)), lg)
    return cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)


def process(path, out_path, dx=0.0, dy=0.0, scale=1.0, logo=True, debug=False):
    img = A.load_image_oriented(path)
    H, W = img.shape[:2]
    eye = detect_eye(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    if eye is None:
        print("AUCUN OEIL:", os.path.basename(path))
        return False
    zones = zones_from_eye(eye, W, H)
    for (x0, y0, x1, y1) in zones:
        # applique offset/scale autour du centre de la zone
        cx, cy = (x0+x1)/2, (y0+y1)/2
        hw, hh = (x1-x0)/2*scale, (y1-y0)/2*scale
        blur_zone(img, cx-hw+dx, cy-hh+dy, cx+hw+dx, cy+hh+dy)
    if debug:
        ex, ey, ew, eh = eye
        cv2.rectangle(img, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 4)
    if logo:
        img = add_logo(img)
    cv2.imwrite(out_path, img)
    return True


if __name__ == '__main__':
    src = sys.argv[1]; out = sys.argv[2]
    process(src, out, debug='--debug' in sys.argv)
