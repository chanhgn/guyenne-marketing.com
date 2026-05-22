#!/usr/bin/env python3
"""
Manual keyframe-based eye band occlusion.
Keyframes are hand-picked from visual inspection (1 per second on rush_02).
Between keyframes we lerp the rectangle coords linearly so the band stays glued
to the eyes/lashes despite head movement and camera rotation.
Coords below are in the source video's native 1920x1080 resolution.
"""
import sys
import cv2
import numpy as np

IN  = sys.argv[1]
OUT = sys.argv[2]

cap = cv2.VideoCapture(IN)
fps     = cap.get(cv2.CAP_PROP_FPS)
W       = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H       = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
nframes = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Input: {W}x{H} @ {fps:.2f}fps, {nframes} frames")

# Keyframes: (time_seconds, rect_in_1920x1080_coords)
# Each rect = (x1, y1, x2, y2). Coords inspected manually on extracted frames.
KEYFRAMES = [
    (0.0,  (0,   0, 1920, 620)),
    (1.0,  (0,   0, 1920, 600)),
    (2.0,  (0,   0, 1920, 540)),
    (3.0,  (0,   0, 1920, 560)),
    (4.0,  (0,   0, 1920, 640)),
    (5.0,  (0,   0, 1920, 640)),
    (6.0,  (0,   0, 1920, 760)),
    (7.0,  (0,   0, 1920, 700)),
    (8.0,  (0,   0, 1920, 700)),
    (9.0,  (0,   0, 1920, 700)),
    (10.0, (0,   0, 1920, 700)),
]


def rect_for_frame(idx, fps):
    """Linearly interpolate the rect at the given frame index."""
    t = idx / fps
    if t <= KEYFRAMES[0][0]:  return KEYFRAMES[0][1]
    if t >= KEYFRAMES[-1][0]: return KEYFRAMES[-1][1]
    for i in range(len(KEYFRAMES) - 1):
        t0, r0 = KEYFRAMES[i]
        t1, r1 = KEYFRAMES[i + 1]
        if t0 <= t <= t1:
            alpha = (t - t0) / (t1 - t0)
            return tuple(int(r0[k] * (1 - alpha) + r1[k] * alpha) for k in range(4))
    return KEYFRAMES[-1][1]


def obscure(frame, x1, y1, x2, y2):
    """Very aggressive anonymisation — tiny mosaic + heavy Gaussian + repeat blur.
    The goal is that nothing identifiable (eye shape, iris, lashes) survives,
    even when the band is large."""
    if x2 <= x1 or y2 <= y1:
        return
    roi = frame[y1:y2, x1:x2]
    h, w = roi.shape[:2]
    # Step 1 — very chunky mosaic (~12 columns total across the region)
    target_w = max(2, w // 60)
    target_h = max(2, h // 60)
    small  = cv2.resize(roi, (target_w, target_h), interpolation=cv2.INTER_AREA)
    mosaic = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    # Step 2 — heavy gaussian
    k = max(31, (min(w, h) // 3) | 1)
    blurred = cv2.GaussianBlur(mosaic, (k, k), 0)
    # Step 3 — second gaussian to fully smooth out
    k2 = max(21, (min(w, h) // 6) | 1)
    blurred = cv2.GaussianBlur(blurred, (k2, k2), 0)
    frame[y1:y2, x1:x2] = blurred


fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(OUT, fourcc, fps, (W, H))
i = 0
while True:
    ok, frame = cap.read()
    if not ok: break
    x1, y1, x2, y2 = rect_for_frame(i, fps)
    obscure(frame, x1, y1, x2, y2)
    out.write(frame)
    i += 1
cap.release()
out.release()
print(f"Done. Wrote {OUT}")
