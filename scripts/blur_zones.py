#!/usr/bin/env python3
"""Garde l'image NETTE et floute UNIQUEMENT des zones (yeux, bouche) pour
cacher l'identité, sans toucher la zone de lésion. + logo optionnel.

Usage: blur_zones.py <out_dir> <json>
json: { "fichier.jpg": {"zones":[[x0,y0,x1,y1],...], "logo":true} }  (fractions)
"""
import os, sys, glob, cv2, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import anonymize_lib as A
from PIL import Image

LOGO = Image.open("/tmp/logo_blanc.png").convert("RGBA")
INDEX = {}
for f in glob.glob("/tmp/*_in/**/*", recursive=True):
    if os.path.isfile(f): INDEX.setdefault(os.path.basename(f), f)


def blur_zone(img, x0, y0, x1, y1):
    """Floute fortement une zone rectangulaire (mosaïque + gaussien), bords adoucis."""
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
    blurred = cv2.GaussianBlur(mos, (k, k), 0)
    blurred = cv2.GaussianBlur(blurred, (k, k), 0)
    # masque adouci pour fondre les bords
    m = np.zeros((h, w), np.uint8)
    cv2.rectangle(m, (0, 0), (w, h), 255, -1)
    fk = max(11, (min(w, h)//4) | 1)
    m = cv2.GaussianBlur(m, (fk, fk), 0)
    m3 = cv2.cvtColor(m, cv2.COLOR_GRAY2BGR).astype(float)/255
    img[y0i:y1i, x0i:x1i] = (blurred*m3 + roi*(1-m3)).astype(np.uint8)


def process(name, spec, out_path):
    if name not in INDEX:
        print("MANQUE:", name); return False
    img = A.load_image_oriented(INDEX[name])
    for (x0, y0, x1, y1) in spec.get("zones", []):
        blur_zone(img, x0, y0, x1, y1)
    if spec.get("logo"):
        H, W = img.shape[:2]
        im = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        lw = int(W*0.30); lh = int(lw*LOGO.height/LOGO.width)
        im.paste(LOGO.resize((lw, lh), Image.LANCZOS), ((W-lw)//2, int(H*0.03)),
                 LOGO.resize((lw, lh), Image.LANCZOS))
        img = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    cv2.imwrite(out_path, img)
    return True


if __name__ == '__main__':
    out_dir = sys.argv[1]; wins = json.load(open(sys.argv[2]))
    os.makedirs(out_dir, exist_ok=True)
    n = 0
    for name, spec in wins.items():
        if process(name, spec, os.path.join(out_dir, name)): n += 1
    print(f"{n}/{len(wins)} traitées -> {out_dir}")
