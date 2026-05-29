#!/usr/bin/env python3
"""
Anonymisation RÉCURSIVE de toute une arborescence de photos (bandeau yeux,
mode STRICT). Parcourt tous les sous-dossiers (ACNE, BOTOX, ROSACEE…),
recrée la même structure en sortie, et produit un rapport global.

Usage:
    python3 scripts/blur_batch.py <racine_entree> <racine_sortie>

Options (variables d'environnement) :
    ANON=1   renomme les fichiers de sortie en codes anonymes
             (ex. BOTOX_001_apres.JPEG) et écrit une table de correspondance
             `_correspondance.csv` à la RACINE de sortie. ⚠ Ce CSV contient
             les vrais noms : à conserver séparément / en lieu sûr.
    + tous les réglages de anonymize_lib (PAD_X, CONF, MIN_SIZE, …)

Les doublons « Copy of X » sont ignorés quand « X » existe dans le même dossier.
Un fichier `_A_REPRENDRE.txt` global liste tout ce qui reste à faire à la main.
"""
import os
import re
import sys
import csv
import cv2
import anonymize_lib as A

ANON = os.environ.get('ANON', '0') in ('1', 'true', 'True', 'yes')


def slugify(s):
    s = os.path.splitext(s)[0]
    s = re.sub(r'[^A-Za-z0-9]+', '_', s).strip('_').upper()
    return s or 'DOSSIER'


def avant_apres(name):
    low = name.lower()
    if 'apres' in low or 'après' in low or 'after' in low:
        return 'apres'
    if 'avant' in low or 'before' in low:
        return 'avant'
    return ''


def main():
    if len(sys.argv) < 3:
        sys.exit("Usage: blur_batch.py <racine_entree> <racine_sortie>")
    root_in, root_out = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
    if not os.path.isdir(root_in):
        sys.exit(f"Racine d'entrée introuvable : {root_in}")
    os.makedirs(root_out, exist_ok=True)

    print(f"Anonymisation récursive\n  entrée : {root_in}\n  sortie : {root_out}")
    print(f"  CONF={A.CONF} MIN_SIZE={A.MIN_SIZE} | renommage anonyme : "
          f"{'OUI' if ANON else 'non'}\n")

    correspondance = []   # (code_sortie, chemin_relatif_origine)
    tot = dict(blurred=0, to_redo=0, no_face=0, failed=0, total=0)
    to_redo_all, no_face_all = [], []

    with A.make_landmarker() as landmarker:
        for dirpath, _dirs, _files in os.walk(root_in):
            files = A.list_images(dirpath)
            if not files:
                continue
            rel = os.path.relpath(dirpath, root_in)
            out_dir = os.path.join(root_out, rel) if rel != '.' else root_out
            os.makedirs(out_dir, exist_ok=True)
            folder_code = slugify(os.path.basename(dirpath)) if rel != '.' else 'RACINE'
            print(f"[{rel}]  {len(files)} image(s)")

            for i, f in enumerate(files, 1):
                tot['total'] += 1
                src = os.path.join(dirpath, f)
                img = A.load_image_oriented(src)
                rel_src = os.path.join(rel, f) if rel != '.' else f
                if img is None:
                    tot['failed'] += 1
                    print(f"   ✗ {f} : illisible")
                    continue
                n, reasons = A.blur_eyes_strict(img, landmarker)

                if ANON:
                    suff = avant_apres(f)
                    code = f"{folder_code}_{i:03d}" + (f"_{suff}" if suff else "")
                    ext = os.path.splitext(f)[1]
                    out_name = code + ext
                    correspondance.append((os.path.join(rel, out_name) if rel != '.' else out_name,
                                           rel_src))
                else:
                    out_name = f
                dst = os.path.join(out_dir, out_name)
                cv2.imwrite(dst, img)

                if n > 0:
                    tot['blurred'] += 1
                    print(f"   ✓ {out_name} : {n} visage(s) flouté(s)")
                elif reasons:
                    tot['to_redo'] += 1
                    to_redo_all.append((os.path.join(rel, out_name), reasons))
                    print(f"   ⚠ {out_name} : À VÉRIFIER — {', '.join(reasons)}")
                else:
                    tot['no_face'] += 1
                    no_face_all.append(os.path.join(rel, out_name))
                    print(f"   ⚠ {out_name} : À VÉRIFIER — aucun visage détecté")

    # --- Correspondance CSV -------------------------------------------------
    if ANON and correspondance:
        csv_path = os.path.join(root_out, '_correspondance.csv')
        with open(csv_path, 'w', newline='') as fp:
            w = csv.writer(fp)
            w.writerow(['fichier_anonyme', 'fichier_origine'])
            w.writerows(correspondance)
        print(f"\n🔑 Table de correspondance : {csv_path}  (À CONSERVER EN LIEU SÛR)")

    # --- Rapport global -----------------------------------------------------
    report = os.path.join(root_out, '_A_REPRENDRE.txt')
    with open(report, 'w') as fp:
        fp.write("PHOTOS À VÉRIFIER / REPRENDRE MANUELLEMENT (lot complet)\n")
        fp.write("⚠ « Aucun visage détecté » ne garantit PAS l'absence d'yeux.\n")
        fp.write("="*70 + "\n\n")
        if to_redo_all:
            fp.write(">> Visage détecté mais NON fiable (flouter à la main) :\n")
            for f, reasons in to_redo_all:
                fp.write(f"   - {f}  [{', '.join(reasons)}]\n")
            fp.write("\n")
        if no_face_all:
            fp.write(">> Aucun visage détecté (vérifier l'absence d'yeux) :\n")
            for f in no_face_all:
                fp.write(f"   - {f}\n")

    print(f"\n{'='*60}")
    print(f"TERMINÉ : {tot['total']} image(s)")
    print(f"  ✓ {tot['blurred']} floutée(s) automatiquement")
    print(f"  ⚠ {tot['to_redo']+tot['no_face']} à vérifier/reprendre à la main")
    print(f"  ✗ {tot['failed']} illisible(s)")
    print('='*60)
    print(f"\n📄 Liste à reprendre : {report}")
    print(f"   → Reprends chaque dossier avec : python3 scripts/blur_manual.py <dossier_sortie>")


if __name__ == '__main__':
    main()
