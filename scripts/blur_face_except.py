#!/usr/bin/env python3
"""Flou très fort sur tout le visage SAUF une fenêtre nette sur la lésion, + logo.
Lit un dict de fenêtres {basename: (x0,y0,x1,y1) en fractions}. Usage:
  blur_face_except.py  (les fenêtres sont définies dans WINDOWS ci-dessous OU via stdin)"""
import os, sys, glob, cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import anonymize_lib as A
from PIL import Image

LOGO = Image.open("/tmp/logo_blanc.png").convert("RGBA")
INDEX = {}
for f in glob.glob("/tmp/*_in/**/*", recursive=True):
    if os.path.isfile(f): INDEX.setdefault(os.path.basename(f), f)


def heavy_blur_except(img, keep, logo=True):
    """keep=(x0,y0,x1,y1) en fractions. Flou TRÈS fort partout sauf keep."""
    H, W = img.shape[:2]
    # mosaïque très grossière + double gaussien -> aucun trait ne survit
    tw = max(5, W // 45); th = max(5, H // 45)
    small = cv2.resize(img, (tw, th), interpolation=cv2.INTER_AREA)
    mos = cv2.resize(small, (W, H), interpolation=cv2.INTER_NEAREST)
    k = max(81, (min(W, H) // 6) | 1)
    blur = cv2.GaussianBlur(mos, (k, k), 0)
    k2 = max(41, (min(W, H) // 12) | 1)
    blur = cv2.GaussianBlur(blur, (k2, k2), 0)
    # masque fenêtre nette
    kx0, ky0, kx1, ky1 = [int(v * s) for v, s in zip(keep, (W, H, W, H))]
    m = np.zeros((H, W), np.uint8)
    cv2.rectangle(m, (kx0, ky0), (kx1, ky1), 255, -1)
    feather = max(21, W // 50) | 1
    m = cv2.GaussianBlur(m, (feather, feather), 0)
    m3 = cv2.cvtColor(m, cv2.COLOR_GRAY2BGR).astype(float) / 255
    out = (img.astype(float) * m3 + blur.astype(float) * (1 - m3)).astype(np.uint8)
    if logo:
        im = Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
        lw = int(W * 0.34); lh = int(lw * LOGO.height / LOGO.width)
        ly = int(H * 0.04) if ky0 > H * 0.28 else int(H * 0.94) - lh
        lg = LOGO.resize((lw, lh), Image.LANCZOS)
        im.paste(lg, ((W - lw) // 2, ly), lg)
        out = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    return out


def process(name, keep, out_path):
    if name not in INDEX:
        print("MANQUE:", name); return False
    o = A.load_image_oriented(INDEX[name])
    cv2.imwrite(out_path, heavy_blur_except(o, keep))
    return True


if __name__ == '__main__':
    import json
    # usage: blur_face_except.py <out_dir> <json_windows>
    out_dir = sys.argv[1]; wins = json.load(open(sys.argv[2]))
    os.makedirs(out_dir, exist_ok=True)
    n = 0
    for name, keep in wins.items():
        if process(name, tuple(keep), os.path.join(out_dir, name)):
            n += 1
    print(f"{n}/{len(wins)} traitées -> {out_dir}")
