#!/usr/bin/env python3
"""Planche-contact : assemble les images d'un dossier en une grille indexée
pour inspection rapide. Usage: montage.py <dossier> <sortie.jpg> [cols] [cell]"""
import sys, os, math, cv2
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import anonymize_lib as A
import numpy as np

folder=sys.argv[1]; out=sys.argv[2]
cols=int(sys.argv[3]) if len(sys.argv)>3 else 3
cell=int(sys.argv[4]) if len(sys.argv)>4 else 360
files=A.list_images(folder,dedup_copies=False)
n=len(files); rows=math.ceil(n/cols)
lbl=46
canvas=np.full((rows*(cell+lbl), cols*cell, 3), 255, np.uint8)
for i,f in enumerate(files):
    img=A.load_image_oriented(os.path.join(folder,f))
    if img is None: continue
    h,w=img.shape[:2]; s=cell/max(h,w)
    im=cv2.resize(img,(int(w*s),int(h*s)))
    r,c=divmod(i,cols); y0=r*(cell+lbl)+lbl; x0=c*cell
    yy=y0+(cell-im.shape[0])//2; xx=x0+(cell-im.shape[1])//2
    canvas[yy:yy+im.shape[0], xx:xx+im.shape[1]]=im
    cv2.putText(canvas,f"[{i}]",(x0+6,r*(cell+lbl)+34),cv2.FONT_HERSHEY_SIMPLEX,0.8,(0,0,200),2)
cv2.imwrite(out,canvas)
print(f"{n} images -> {out}")
for i,f in enumerate(files): print(f"  [{i}] {f}")
