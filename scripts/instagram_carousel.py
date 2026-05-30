#!/usr/bin/env python3
"""Génère des CARROUSELS Instagram (3 diapos/cas : Couverture + Avant + Après),
portrait 1080x1350, charte Dr Lakhssassi. 1 carrousel par cas avant/après.
Usage: instagram_carousel.py <arbre_photos> <sortie>"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import anonymize_lib as A
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = sys.argv[1] if len(sys.argv)>1 else "/tmp/OPAQUE"
OUT  = sys.argv[2] if len(sys.argv)>2 else "/tmp/CARROUSELS"
W,H=1080,1350
NAVY=(20,38,99); CORAL=(222,32,104); PAPER=(250,247,242); WHITE=(255,255,255); MUTE=(118,134,168)
SERIF="/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SERIFB="/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SANSB="/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
LOGO=Image.open("/home/user/guyenne-marketing.com/public/logo-lakhssassi.png").convert("RGBA")
def F(p,s): return ImageFont.truetype(p,s)

TITLES={"BOTOX":"Botox","ACNE":"Acné","ACNE SCARS":"Cicatrices d'acné","ROSACEE":"Rosacée",
 "PAPULOSA NIGRA":"Papulosa nigra","RHINOPHYMA":"Rhinophyma","TUMEUR DIVERS":"Tumeurs & nævus",
 "EPILATION":"Épilation laser","ALOPECIE":"Alopécie","ECZEMA":"Eczéma","BRULURE":"Brûlure",
 "LESIONS VASCULAIRES":"Lésions vasculaires","KYSTES":"Kystes","PIGMENTATION":"Pigmentation",
 "CICATRICES":"Cicatrices","CARCINOMES":"Carcinomes","ESTHETIQUE DIVERS":"Esthétique"}
DROP=['apres','après','avant','before','after','finale','finle','fnle','oblic','vue globale',
      'globale','ablation fils','ablation','po gauche','po droite','rasé','rase','photo',
      'cortesia','dr shan','r avant','1 apres','1 avant']

def phase(n):
    n=n.lower(); t=re.findall(r'[a-zàâéèêîïôûç]+',n)
    ap=('apres' in n)or('après' in n)or('after' in n)or('ap' in t)or('despues' in n)
    av=('avant' in n)or('before' in n)or('av' in t)or('antes' in n)
    return 'apres' if ap and not av else 'avant' if av and not ap else None
def key(n):
    k=os.path.splitext(n)[0].lower()
    for w in DROP: k=k.replace(w,' ')
    k=re.sub(r'\(.*?\)',' ',k); k=re.sub(r'\d+',' ',k); k=re.sub(r'\b(ap|av)\b',' ',k)
    k=re.sub(r'[^a-zàâéèêîïôûç ]+',' ',k); return re.sub(r'\s+',' ',k).strip()

def ctext(d,cx,y,t,f,col):
    b=d.textbbox((0,0),t,font=f); d.text((cx-(b[2]-b[0])/2,y),t,font=f,fill=col); return b[3]-b[1]
def logo_top(im,wpx,y):
    lw=wpx; lh=int(LOGO.height*lw/LOGO.width); lg=LOGO.resize((lw,lh),Image.LANCZOS)
    im.paste(lg,((W-lw)//2,y),lg); return y+lh
def pill(d,cx,y,t,f):
    b=d.textbbox((0,0),t,font=f); w=b[2]-b[0];h=b[3]-b[1];px,py=40,18
    d.rounded_rectangle([cx-w/2-px,y,cx+w/2+px,y+h+2*py],radius=(h+2*py)//2,fill=CORAL)
    d.text((cx-w/2,y+py-2),t,font=f,fill=WHITE)

def slide_cover(title):
    im=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(im)
    d.rectangle([0,0,W,14],fill=NAVY); d.rectangle([0,H-14,W,H],fill=CORAL)
    y=logo_top(im,560,250)
    y+=90; y+=ctext(d,W//2,y,title.upper(),F(SERIFB,82),NAVY)
    y+=30; d.rounded_rectangle([W//2-70,y,W//2+70,y+6],3,fill=CORAL)
    y+=70; ctext(d,W//2,y,"AVANT  •  APRÈS",F(SANSB,46),CORAL)
    ctext(d,W//2,H-150,"Dermatologie & Lasers",F(SERIF,34),MUTE)
    return im
def slide_photo(path,label):
    im=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(im)
    logo_top(im,300,46)
    # zone photo
    bx0,by0,bx1,by1=50,210,W-50,H-150
    ph=Image.open(path).convert("RGB")
    fit=ImageOps.contain(ph,(bx1-bx0,by1-by0),Image.LANCZOS)
    px=bx0+((bx1-bx0)-fit.width)//2; py=by0+((by1-by0)-fit.height)//2
    im.paste(fit,(px,py)); d.rectangle([px-2,py-2,px+fit.width+2,py+fit.height+2],outline=NAVY,width=3)
    pill(d,W//2,150,label,F(SANSB,40))
    ctext(d,W//2,H-120,"Dr Lakhssassi — Dermatologie & Lasers",F(SERIF,30),MUTE)
    return im

n=0
for dp,_,_ in os.walk(ROOT):
    files=A.list_images(dp,dedup_copies=False)
    if not files: continue
    cat=os.path.relpath(dp,ROOT).split(os.sep)[0]
    title=TITLES.get(cat,cat.title())
    groups={}
    for f in files:
        ph=phase(f)
        if ph: groups.setdefault(key(f),{})[ph]=f
    for k,pr in groups.items():
        if 'avant' in pr and 'apres' in pr:
            safe=re.sub(r'[^A-Za-z0-9]+','_',k)[:38] or 'cas'
            cdir=os.path.join(OUT,cat,safe); os.makedirs(cdir,exist_ok=True)
            try:
                slide_cover(title).save(os.path.join(cdir,"1_couverture.jpg"),quality=92)
                slide_photo(os.path.join(dp,pr['avant']),"AVANT").save(os.path.join(cdir,"2_avant.jpg"),quality=92)
                slide_photo(os.path.join(dp,pr['apres']),"APRÈS").save(os.path.join(cdir,"3_apres.jpg"),quality=92)
                n+=1
            except Exception as e: print("ERR",k,e)
print(f"\n{n} carrousels (x3 diapos) générés dans {OUT}")
