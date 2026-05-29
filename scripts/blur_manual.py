#!/usr/bin/env python3
"""
Tracé MANUEL du bandeau de floutage sur les yeux — pour reprendre les photos
que l'auto n'a pas su traiter (gros plans front/yeux, photos tournées, etc.).

⚠ Nécessite une interface graphique : installer `opencv-python` (PAS la version
   -headless) sur ta machine. À lancer en LOCAL, pas dans un conteneur distant.

Usage:
    python3 scripts/blur_manual.py <dossier>

Par défaut, ne propose que les photos listées dans `<dossier>/_A_REPRENDRE.txt`
(celles signalées par l'auto). Mets ALL=1 pour passer en revue TOUTES les images.
Les fichiers sont modifiés SUR PLACE (lance-le sur ton dossier de SORTIE).

Commandes (fenêtre image) :
    glisser la souris   tracer un rectangle sur les yeux (plusieurs possibles)
    a / Entrée / Espace appliquer le flou aux rectangles, enregistrer, suivante
    p                   pré-remplir avec la détection auto (si trouvée)
    u                   annuler le dernier rectangle
    r                   tout effacer
    s                   passer sans rien flouter (pas d'yeux visibles)
    q / Échap           quitter
"""
import os
import sys
import cv2
import anonymize_lib as A

MAX_DISP = 1000  # taille max d'affichage (px)


def load_redo_list(folder):
    path = os.path.join(folder, '_A_REPRENDRE.txt')
    if not os.path.isfile(path):
        return None
    names = []
    for line in open(path):
        line = line.strip()
        if line.startswith('- '):
            # format "   - nom.jpg  [raison]"
            name = line[2:].split('  [')[0].strip()
            names.append(os.path.basename(name))
    return names


def run(folder):
    all_imgs = A.list_images(folder, dedup_copies=False)
    redo = None if os.environ.get('ALL') in ('1', 'true', 'yes') else load_redo_list(folder)
    if redo is not None:
        wanted = set(redo)
        files = [f for f in all_imgs if f in wanted]
        print(f"{len(files)} photo(s) à reprendre (d'après _A_REPRENDRE.txt). "
              f"ALL=1 pour toutes.")
    else:
        files = all_imgs
        print(f"{len(files)} photo(s) dans le dossier.")
    if not files:
        print("Rien à faire.")
        return

    landmarker = A.make_landmarker()
    state = {'boxes': [], 'drag': None, 'scale': 1.0}

    def on_mouse(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            state['drag'] = (x, y)
        elif event == cv2.EVENT_LBUTTONUP and state['drag']:
            x0, y0 = state['drag']
            x1, y1 = min(x0, x), min(y0, y)
            x2, y2 = max(x0, x), max(y0, y)
            if x2 - x1 > 3 and y2 - y1 > 3:
                s = state['scale']
                state['boxes'].append((int(x1/s), int(y1/s), int(x2/s), int(y2/s)))
            state['drag'] = None

    win = "Floutage yeux — a:appliquer  p:auto  u:annuler  r:reset  s:passer  q:quitter"
    cv2.namedWindow(win, cv2.WINDOW_NORMAL)
    cv2.setMouseCallback(win, on_mouse)

    idx = 0
    while idx < len(files):
        f = files[idx]
        path = os.path.join(folder, f)
        img = A.load_image_oriented(path)
        if img is None:
            print(f"  ✗ {f} illisible, ignorée"); idx += 1; continue
        H, W = img.shape[:2]
        state['scale'] = min(1.0, MAX_DISP / max(W, H))
        state['boxes'] = []

        while True:
            disp = cv2.resize(img, None, fx=state['scale'], fy=state['scale'])
            for (x1, y1, x2, y2) in state['boxes']:
                s = state['scale']
                cv2.rectangle(disp, (int(x1*s), int(y1*s)), (int(x2*s), int(y2*s)),
                              (0, 0, 255), 2)
            label = f"[{idx+1}/{len(files)}] {f}  ({len(state['boxes'])} zone(s))"
            cv2.setWindowTitle(win, label)
            cv2.imshow(win, disp)
            key = cv2.waitKey(20) & 0xFF

            if key in (ord('a'), 13, 32):          # appliquer + enregistrer
                if state['boxes']:
                    for b in state['boxes']:
                        A.obscure(img, *b)
                    cv2.imwrite(path, img)
                    print(f"  ✓ {f} : {len(state['boxes'])} zone(s) floutée(s)")
                else:
                    print(f"  ·  {f} : aucune zone tracée (inchangée)")
                idx += 1; break
            elif key == ord('p'):                  # pré-remplir auto
                H2, W2 = img.shape[:2]
                import mediapipe as mp
                rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                res = landmarker.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
                for face in res.face_landmarks:
                    state['boxes'].append(A.eye_rect(face, W2, H2))
                print(f"     auto : {len(res.face_landmarks)} visage(s) proposé(s)")
            elif key == ord('u'):                  # annuler dernier
                if state['boxes']: state['boxes'].pop()
            elif key == ord('r'):                  # reset
                state['boxes'] = []
            elif key == ord('s'):                  # passer
                print(f"  ·  {f} : passée"); idx += 1; break
            elif key in (ord('q'), 27):            # quitter
                print("Arrêt."); cv2.destroyAllWindows(); landmarker.close(); return

    cv2.destroyAllWindows()
    landmarker.close()
    print("Terminé.")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit("Usage: blur_manual.py <dossier>")
    run(sys.argv[1])
