#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Assemble les slides "deck éditorial" KOBO (PNG 1920x1080 rendus via Remotion,
composition KoboDeck) en un PowerPoint 16:9 plein cadre.
Entrée : out/deck_png/slide-01.png .. slide-10.png
Sortie : out/KOBO-BNI-Sexy.pptx
"""
import os
import glob
from pptx import Presentation
from pptx.util import Emu

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "out", "deck_png")
OUT = os.path.join(ROOT, "out", "KOBO-BNI-Sexy.pptx")
EMU_IN = 914400
SW, SH = 13.333, 7.5


def build():
    prs = Presentation()
    prs.slide_width = Emu(int(SW * EMU_IN))
    prs.slide_height = Emu(int(SH * EMU_IN))
    blank = prs.slide_layouts[6]
    pngs = sorted(glob.glob(os.path.join(SRC, "slide-*.png")))
    if not pngs:
        raise SystemExit("Aucune image dans " + SRC)
    for p in pngs:
        s = prs.slides.add_slide(blank)
        s.shapes.add_picture(p, 0, 0, width=prs.slide_width, height=prs.slide_height)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    prs.save(OUT)
    print("Saved:", OUT, "—", len(pngs), "slides")


if __name__ == "__main__":
    build()
