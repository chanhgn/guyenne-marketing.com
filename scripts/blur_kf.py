#!/usr/bin/env python3
"""
Multi-rush keyframe blur. Reads a config dict, applies time-keyed rectangle
mosaic+blur. Keyframes can be marked inactive (None) so the blur ONLY runs
on frames inside an active interval.

Usage: blur_kf.py <rush_name> <input.mp4> <output.mp4>
"""
import sys, cv2, numpy as np

RUSH, IN, OUT = sys.argv[1], sys.argv[2], sys.argv[3]

# Each entry: (time_sec, rect_or_None).  None = no blur applied.
# rect = (x1, y1, x2, y2) in NATIVE source coordinates.
CONFIGS = {
    # Rush 01: 1920x1080 landscape, 54s. Mouth visible only at t=0..1.2.
    '01': [
        (0.0,  (140, 700, 700, 1080)),
        (0.5,  (140, 600, 600, 1000)),
        (1.0,  (100, 700, 700, 1080)),
        (1.2,  (100, 750, 700, 1080)),
        (1.3,  None),   # mouth disappears
        (55.0, None),
    ],
    # Rush 03: 1080x1920 portrait, 44s. Patient visible throughout, growing.
    '03': [
        (0.0,  (0, 1300, 750,  1920)),
        (4.0,  (0, 1300, 700,  1920)),
        (8.0,  (0, 1250, 700,  1920)),
        (12.0, (0, 1200, 800,  1920)),
        (16.0, (0, 1100, 900,  1920)),
        (20.0, (0,  950, 1000, 1920)),
        (24.0, (0,  850, 1080, 1920)),
        (28.0, (0,  750, 1080, 1920)),
        (32.0, (0,  700, 1080, 1920)),
        (36.0, (0,  700, 1080, 1920)),
        (40.0, (0,  750, 1080, 1920)),
        (44.5, (0,  750, 1080, 1920)),
    ],
    # Rush 11: 720x1280 portrait, 27s.
    '11': [
        (0.0,  (240, 1080, 580, 1280)),
        (5.0,  (240, 1090, 560, 1280)),
        (10.0, (220, 1120, 560, 1280)),
        (15.0, (270,  980, 600, 1240)),
        (20.0, (200, 1120, 540, 1280)),
        (25.0, (180, 1030, 580, 1280)),
        (27.3, (260, 1030, 580, 1280)),
    ],
}

if RUSH not in CONFIGS:
    sys.exit(f"unknown rush: {RUSH}. Known: {list(CONFIGS)}")

KEYFRAMES = CONFIGS[RUSH]

cap = cv2.VideoCapture(IN)
fps     = cap.get(cv2.CAP_PROP_FPS)
W       = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H       = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
nframes = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Rush {RUSH}: {W}x{H} @ {fps:.2f}fps, {nframes} frames")


def rect_for_frame(idx, fps):
    """Returns rect or None for the given frame index."""
    t = idx / fps
    if t <= KEYFRAMES[0][0]:  return KEYFRAMES[0][1]
    if t >= KEYFRAMES[-1][0]: return KEYFRAMES[-1][1]
    for i in range(len(KEYFRAMES) - 1):
        t0, r0 = KEYFRAMES[i]
        t1, r1 = KEYFRAMES[i + 1]
        if t0 <= t <= t1:
            # If either side is None, the interval is inactive
            if r0 is None or r1 is None:
                return None
            alpha = (t - t0) / (t1 - t0)
            return tuple(int(r0[k] * (1 - alpha) + r1[k] * alpha) for k in range(4))
    return KEYFRAMES[-1][1]


def obscure(frame, rect):
    if rect is None: return
    x1, y1, x2, y2 = rect
    if x2 <= x1 or y2 <= y1: return
    roi = frame[y1:y2, x1:x2]
    h, w = roi.shape[:2]
    tw = max(3, w // 30)
    th = max(3, h // 30)
    small  = cv2.resize(roi, (tw, th), interpolation=cv2.INTER_AREA)
    mosaic = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    k = max(21, (min(w, h) // 4) | 1)
    blurred = cv2.GaussianBlur(mosaic, (k, k), 0)
    frame[y1:y2, x1:x2] = blurred


fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(OUT, fourcc, fps, (W, H))
i = 0
while True:
    ok, frame = cap.read()
    if not ok: break
    rect = rect_for_frame(i, fps)
    obscure(frame, rect)
    out.write(frame)
    i += 1
cap.release(); out.release()
print(f"Done. {OUT}")
