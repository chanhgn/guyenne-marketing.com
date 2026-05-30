#!/usr/bin/env python3
"""Convertit les bandeaux flous en bandeaux NOIRS OPAQUES + logo.
Détecte la zone floutée en comparant à l'original (diff), sinon par lissage.
Usage: opaque.py <arbre_floute> <arbre_sortie>"""
import os, sys, glob, cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import anonymize_lib as A
from PIL import Image

SRC, DST = sys.argv[1], sys.argv[2]
LOGO = Image.open("/tmp/logo_blanc.png").convert("RGBA")

# index basename -> chemin original (brut, dans un *_in)
INDEX={}
for f in glob.glob("/tmp/*_in/**/*", recursive=True):
    if os.path.isfile(f): INDEX.setdefault(os.path.basename(f), f)

def detect_boxes(orig, blur):
    H,W=blur.shape[:2]
    if orig is None or orig.shape!=blur.shape:
        return []   # pas d'original fiable -> on ne devine pas (évite les parasites)
    d=cv2.absdiff(cv2.cvtColor(orig,cv2.COLOR_BGR2GRAY),cv2.cvtColor(blur,cv2.COLOR_BGR2GRAY))
    mask=(d>30).astype(np.uint8)*255
    k=max(10,W//50)
    mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((k,k),np.uint8))
    mask=cv2.morphologyEx(mask,cv2.MORPH_OPEN,np.ones((max(5,k//2),)*2,np.uint8))
    cnts,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    boxes=[]
    for c in cnts:
        x,y,w,h=cv2.boundingRect(c)
        region_mean=float(d[y:y+h,x:x+w].mean())
        if w*h > 0.004*W*H and w>0.05*W and region_mean>42:
            boxes.append((x,y,w,h))
    return boxes

def draw(base_img, boxes):
    im=Image.fromarray(cv2.cvtColor(base_img,cv2.COLOR_BGR2RGB)).convert("RGB")
    from PIL import ImageDraw
    d=ImageDraw.Draw(im)
    for (x,y,w,h) in boxes:
        pad=max(2,int(0.006*min(im.size)))
        x0,y0,x1,y1=x-pad,y-pad,x+w+pad,y+h+pad
        r=max(6,h//5)
        d.rounded_rectangle([x0,y0,x1,y1],radius=r,fill=(0,0,0))
        bw,bh=x1-x0,y1-y0
        if bh>=22:
            lw=int(min(bw*0.6, bh*0.72*(LOGO.width/LOGO.height)))
            lw=max(20,lw); lh=int(lw*LOGO.height/LOGO.width)
            if lh>bh*0.82: lh=int(bh*0.82); lw=int(lh*LOGO.width/LOGO.height)
            lg=LOGO.resize((lw,lh),Image.LANCZOS)
            im.paste(lg,(x0+(bw-lw)//2, y0+(bh-lh)//2), lg)
    return cv2.cvtColor(np.array(im),cv2.COLOR_RGB2BGR)

n=nb=0
for dp,_,_ in os.walk(SRC):
    for f in A.list_images(dp, dedup_copies=False):
        rel=os.path.relpath(os.path.join(dp,f),SRC)
        outp=os.path.join(DST,rel); os.makedirs(os.path.dirname(outp),exist_ok=True)
        blur=cv2.imread(os.path.join(dp,f))
        if blur is None: continue
        orig=A.load_image_oriented(INDEX[f]) if f in INDEX else None
        boxes=detect_boxes(orig,blur)
        base=orig if (orig is not None and orig.shape==blur.shape) else blur
        out=draw(base.copy(),boxes) if boxes else (base.copy())
        cv2.imwrite(outp,out); n+=1; nb+=len(boxes)
print(f"{n} images, {nb} bandeaux opaques posés -> {DST}")
