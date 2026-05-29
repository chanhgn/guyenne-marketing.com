#!/usr/bin/env python3
"""
Génère un visuel Instagram "AVANT / APRÈS" à la charte graphique Dr Lakhssassi.

Usage:
    python3 scripts/instagram_post.py <avant.jpg> <apres.jpg> "<TITRE>" <sortie.jpg> [format]
    format = portrait (1080x1350, défaut) | square (1080x1080) | story (1080x1920)

Charte : navy #142663, corail #DE2068, fond papier #FAF7F2, logo du cabinet.
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageOps

NAVY=(20,38,99); CORAL=(222,32,104); PAPER=(250,247,242); WHITE=(255,255,255)
INK=(20,38,99); MUTE=(118,134,168)
SCRIPT_DIR=os.path.dirname(os.path.abspath(__file__))
LOGO=os.path.join(SCRIPT_DIR,'..','public','logo-lakhssassi.png')
SERIF="/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SERIF_B="/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SANS_B="/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

FORMATS={'portrait':(1080,1350),'square':(1080,1080),'story':(1080,1920)}


def font(path,size): return ImageFont.truetype(path,size)

def fit_panel(img, pw, ph):
    """Recadre (center-crop) l'image au ratio pw:ph puis redimensionne."""
    return ImageOps.fit(img, (pw, ph), method=Image.LANCZOS, centering=(0.5,0.4))

def rounded(draw, box, r, fill):
    draw.rounded_rectangle(box, radius=r, fill=fill)

def text_center(draw, cx, y, txt, fnt, fill):
    b=draw.textbbox((0,0),txt,font=fnt); w=b[2]-b[0]
    draw.text((cx-w/2, y), txt, font=fnt, fill=fill); return b[3]-b[1]

def pill(draw, cx, y, txt, fnt):
    b=draw.textbbox((0,0),txt,font=fnt); w=b[2]-b[0]; h=b[3]-b[1]
    padx,pady=34,16
    rounded(draw,(cx-w/2-padx, y, cx+w/2+padx, y+h+2*pady), (h+2*pady)//2, CORAL)
    draw.text((cx-w/2, y+pady-2), txt, font=fnt, fill=WHITE)
    return h+2*pady


def make(avant, apres, titre, out, fmt='portrait'):
    W,H=FORMATS[fmt]
    canvas=Image.new('RGB',(W,H),PAPER)
    d=ImageDraw.Draw(canvas)
    M=56

    # --- logo en haut ---
    logo=Image.open(LOGO).convert('RGBA')
    lw=440; lh=int(logo.height*lw/logo.width)
    logo=logo.resize((lw,lh),Image.LANCZOS)
    canvas.paste(logo,((W-lw)//2, 46), logo)
    y=46+lh+18

    # --- titre ---
    th=text_center(d,W//2,y,titre.upper(),font(SERIF_B,64),NAVY)
    y+=th+18
    # filet corail
    d.rounded_rectangle((W//2-60,y,W//2+60,y+5),2,fill=CORAL); y+=34

    # --- deux panneaux ---
    gap=28
    pw=(W-2*M-gap)//2
    # hauteur dispo jusqu'au footer
    footer_h=120
    ph=H-y-footer_h-40
    if fmt=='square': ph=int(pw*1.15)
    a=fit_panel(Image.open(avant).convert('RGB'),pw,ph)
    b=fit_panel(Image.open(apres).convert('RGB'),pw,ph)
    x1=M; x2=M+pw+gap
    # cadre navy fin
    for x,im in ((x1,a),(x2,b)):
        canvas.paste(im,(x,y))
        d.rectangle((x-2,y-2,x+pw+2,y+ph+2),outline=NAVY,width=3)
    # labels
    lf=font(SANS_B,34)
    pill(d, x1+pw//2, y+18, "AVANT", lf)
    pill(d, x2+pw//2, y+18, "APRÈS", lf)
    y+=ph+34

    # --- footer ---
    text_center(d,W//2,y,"Dermatologie & Lasers",font(SERIF,30),MUTE)

    canvas.save(out,quality=92)
    print("écrit:",out)


if __name__=='__main__':
    if len(sys.argv)<5: sys.exit("Usage: instagram_post.py <avant> <apres> <titre> <sortie> [format]")
    make(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4], sys.argv[5] if len(sys.argv)>5 else 'portrait')
