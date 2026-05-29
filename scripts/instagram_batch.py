#!/usr/bin/env python3
"""Génère en lot les visuels Instagram avant/après (portrait 1080x1350) pour
toute l'arborescence anonymisée. Apparie automatiquement avant<->apres."""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import instagram_post as IG
import anonymize_lib as A

ROOT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/TOUT_ANONYMISE"
OUT  = sys.argv[2] if len(sys.argv) > 2 else "/tmp/INSTAGRAM"

TITLES = {
 "BOTOX":"Botox","ACNE":"Acné","ACNE SCARS":"Cicatrices d'acné","ROSACEE":"Rosacée",
 "PAPULOSA NIGRA":"Papulosa nigra","RHINOPHYMA":"Rhinophyma","TUMEUR DIVERS":"Tumeurs & nævus",
 "EPILATION":"Épilation laser","ALOPECIE":"Alopécie","ECZEMA":"Eczéma","BRULURE":"Brûlure",
 "LESIONS VASCULAIRES":"Lésions vasculaires","KYSTES":"Kystes","PIGMENTATION":"Pigmentation",
 "CICATRICES":"Cicatrices","CARCINOMES":"Carcinomes","ESTHETIQUE DIVERS":"Esthétique",
}
DROP = ['apres','après','avant','before','after','finale','finle','fnle','oblic',
        'vue globale','globale','ablation fils','ablation','po gauche','po droite',
        'rasé','rase','photo','cortesia','dr shan','r avant','1 apres','1 avant']

def phase(name):
    n=name.lower(); toks=re.findall(r'[a-zàâéèêîïôûç]+', n)
    ap = ('apres' in n) or ('après' in n) or ('after' in n) or ('ap' in toks) or ('despues' in n)
    av = ('avant' in n) or ('before' in n) or ('av' in toks) or ('antes' in n)
    if ap and not av: return 'apres'
    if av and not ap: return 'avant'
    return None

def key(name):
    k=os.path.splitext(name)[0].lower()
    for w in DROP: k=k.replace(w,' ')
    k=re.sub(r'\(.*?\)',' ',k)            # enlève (1),(2)...
    k=re.sub(r'\d+',' ',k)                # enlève chiffres
    k=re.sub(r'\b(ap|av)\b',' ',k)
    k=re.sub(r'[^a-zàâéèêîïôûç ]+',' ',k)
    return re.sub(r'\s+',' ',k).strip()

def topcat(rel):
    return rel.split(os.sep)[0]

n=0
for dirpath,_,_ in os.walk(ROOT):
    files=A.list_images(dirpath, dedup_copies=False)
    if not files: continue
    rel=os.path.relpath(dirpath, ROOT)
    cat=topcat(rel)
    title=TITLES.get(cat, cat.title())
    groups={}
    for f in files:
        ph=phase(f)
        if ph is None: continue
        groups.setdefault(key(f), {})[ph]=f
    outdir=os.path.join(OUT, cat); os.makedirs(outdir, exist_ok=True)
    for k,pair in groups.items():
        if 'avant' in pair and 'apres' in pair:
            av=os.path.join(dirpath,pair['avant']); ap=os.path.join(dirpath,pair['apres'])
            safe=re.sub(r'[^A-Za-z0-9]+','_',k)[:40] or 'post'
            out=os.path.join(outdir, f"IG_{cat.replace(' ','_')}_{safe}.jpg")
            try:
                IG.make(av,ap,title,out,'portrait'); n+=1
            except Exception as e:
                print("ERR",k,e)
print(f"\n{n} visuels Instagram générés dans {OUT}")
