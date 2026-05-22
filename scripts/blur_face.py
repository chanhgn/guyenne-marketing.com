#!/usr/bin/env python3
"""
Full-face blur via MediaPipe FaceMesh.
For each detected face, build a bounding rectangle of ALL landmarks (with
padding), then apply mosaic + Gaussian blur. Can target only the lower face
(patient when 2 are visible) via mode='lower'.
"""
import sys, cv2, numpy as np, mediapipe as mp

mp_fm = mp.solutions.face_mesh

IN  = sys.argv[1]
OUT = sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else 'all'

cap = cv2.VideoCapture(IN)
fps     = cap.get(cv2.CAP_PROP_FPS)
W       = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H       = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
nframes = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Input: {W}x{H} @ {fps:.2f}fps, {nframes} frames | mode={mode}")


def face_rect(lm, W, H):
    xs = [p.x * W for p in lm]
    ys = [p.y * H for p in lm]
    cx = (max(xs) + min(xs)) / 2
    cy = (max(ys) + min(ys)) / 2
    half_w = (max(xs) - min(xs)) * 0.5 * 1.25
    half_h = (max(ys) - min(ys)) * 0.5 * 1.25
    x1 = max(0, int(cx - half_w))
    x2 = min(W, int(cx + half_w))
    y1 = max(0, int(cy - half_h))
    y2 = min(H, int(cy + half_h))
    return (x1, y1, x2, y2)


def face_centroid_y(lm, H):
    return sum(p.y for p in lm) / len(lm) * H


def obscure(frame, x1, y1, x2, y2):
    if x2 <= x1 or y2 <= y1: return
    roi = frame[y1:y2, x1:x2]
    h, w = roi.shape[:2]
    tw = max(3, w // 40)
    th = max(3, h // 40)
    small = cv2.resize(roi, (tw, th), interpolation=cv2.INTER_AREA)
    mosaic = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    k = max(21, (min(w, h) // 4) | 1)
    blurred = cv2.GaussianBlur(mosaic, (k, k), 0)
    frame[y1:y2, x1:x2] = blurred


detections = [None] * nframes
with mp_fm.FaceMesh(static_image_mode=False, max_num_faces=2,
                    refine_landmarks=False, min_detection_confidence=0.3,
                    min_tracking_confidence=0.3) as fm:
    i = 0
    while True:
        ok, frame = cap.read()
        if not ok: break
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        r = fm.process(rgb)
        rects = []
        if r.multi_face_landmarks:
            faces = list(r.multi_face_landmarks)
            if mode == 'lower' and len(faces) > 1:
                faces.sort(key=lambda f: face_centroid_y(f.landmark, H), reverse=True)
                faces = faces[:1]
            for face in faces:
                rects.append(face_rect(face.landmark, W, H))
        if rects:
            detections[i] = rects
        i += 1
        if i % 50 == 0:
            print(f"  pass1: frame {i}/{nframes}")
cap.release()
print(f"Detected: {sum(1 for d in detections if d)}/{nframes}")

filled = list(detections)
last = None
for i in range(nframes):
    if filled[i] is not None: last = filled[i]
    elif last is not None: filled[i] = last
nxt = None
for i in range(nframes - 1, -1, -1):
    if detections[i] is not None: nxt = detections[i]
    elif filled[i] is None and nxt is not None: filled[i] = nxt

cap = cv2.VideoCapture(IN)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(OUT, fourcc, fps, (W, H))
i = 0
while True:
    ok, frame = cap.read()
    if not ok: break
    for (x1, y1, x2, y2) in (filled[i] or []):
        obscure(frame, x1, y1, x2, y2)
    out.write(frame)
    i += 1
cap.release(); out.release()
print(f"Done. {OUT}")
