#!/usr/bin/env python3
"""
Anonymisation d'UN dossier de photos : bandeau de floutage sur les YEUX
(mode STRICT). Pour traiter toute une arborescence d'un coup, voir blur_batch.py.
Pour tracer le bandeau à la main sur les photos ratées, voir blur_manual.py.

Usage:
    python3 scripts/blur_images_eyes.py <dossier_entree> <dossier_sortie>

Réglages via variables d'environnement : PAD_X, PAD_Y, CONF, MAX_OOB, MIN_SIZE,
MODEL_PATH (voir scripts/README.md). Les images d'entrée ne sont jamais
modifiées ; tout est écrit dans le dossier de sortie. Un fichier
`_A_REPRENDRE.txt` liste les photos à vérifier/reprendre à la main.
"""
import os
import sys
import shutil
import anonymize_lib as A


def main():
    if len(sys.argv) < 3:
        sys.exit("Usage: blur_images_eyes.py <dossier_entree> <dossier_sortie>")
    in_dir, out_dir = sys.argv[1], sys.argv[2]
    if not os.path.isdir(in_dir):
        sys.exit(f"Dossier d'entrée introuvable : {in_dir}")
    os.makedirs(out_dir, exist_ok=True)

    files = A.list_images(in_dir)
    if not files:
        sys.exit(f"Aucune image trouvée dans {in_dir}")

    print(f"{len(files)} image(s) | mode STRICT | CONF={A.CONF} "
          f"MAX_OOB={A.MAX_OOB} MIN_SIZE={A.MIN_SIZE}\n")

    blurred, to_redo, no_face, failed = [], [], [], []
    with A.make_landmarker() as landmarker:
        for f in files:
            src = os.path.join(in_dir, f)
            dst = os.path.join(out_dir, f)
            img = A.load_image_oriented(src)
            if img is None:
                failed.append(f)
                print(f"  ✗ {f} : illisible")
                continue
            n, reasons = A.blur_eyes_strict(img, landmarker)
            import cv2
            if n > 0:
                cv2.imwrite(dst, img)
                blurred.append((f, n))
                extra = f" (+{len(reasons)} douteuse ignorée)" if reasons else ""
                print(f"  ✓ {f} : {n} visage(s) flouté(s){extra}")
            else:
                cv2.imwrite(dst, img)  # recopie (réorientée) pour un dossier complet
                if reasons:
                    to_redo.append((f, reasons))
                    print(f"  ⚠ {f} : À VÉRIFIER — {', '.join(reasons)}")
                else:
                    no_face.append(f)
                    print(f"  ⚠ {f} : À VÉRIFIER — aucun visage détecté "
                          f"(peut quand même contenir des yeux)")

    print(f"\n{'='*60}")
    print(f"Terminé. {len(files)} image(s) | {len(blurred)} floutée(s) sûres | "
          f"{len(to_redo)+len(no_face)} à vérifier à la main")
    print('='*60)

    report = os.path.join(out_dir, '_A_REPRENDRE.txt')
    write_report(report, to_redo, no_face, failed)
    if to_redo:
        print(f"\n⚠ {len(to_redo)} photo(s) avec visage détecté NON flouté de façon sûre :")
        for f, reasons in to_redo:
            print(f"    - {f}  [{', '.join(reasons)}]")
    if no_face:
        print(f"\n⚠ {len(no_face)} photo(s) sans visage détecté — à vérifier.")
    print(f"\n📄 Liste écrite dans : {report}")
    if to_redo or no_face:
        print("   → Reprends-les avec : python3 scripts/blur_manual.py "
              f"\"{out_dir}\"")


def write_report(path, to_redo, no_face, failed):
    with open(path, 'w') as fp:
        fp.write("PHOTOS À VÉRIFIER / REPRENDRE MANUELLEMENT\n")
        fp.write("Le bandeau yeux n'a PAS été appliqué automatiquement de façon sûre.\n")
        fp.write("⚠ « Aucun visage détecté » ne garantit PAS l'absence d'yeux : "
                 "vérifier chaque photo.\n")
        fp.write("="*70 + "\n\n")
        if to_redo:
            fp.write(">> Visage détecté mais jugé NON fiable (à flouter à la main) :\n")
            for f, reasons in to_redo:
                fp.write(f"   - {f}  [{', '.join(reasons)}]\n")
            fp.write("\n")
        if no_face:
            fp.write(">> Aucun visage détecté (vérifier qu'il n'y a pas d'yeux visibles) :\n")
            for f in no_face:
                fp.write(f"   - {f}\n")
            fp.write("\n")
        if failed:
            fp.write(">> Fichiers illisibles :\n")
            for f in failed:
                fp.write(f"   - {f}\n")
        if not (to_redo or no_face or failed):
            fp.write("Rien à reprendre : toutes les images ont été traitées avec succès.\n")


if __name__ == '__main__':
    main()
