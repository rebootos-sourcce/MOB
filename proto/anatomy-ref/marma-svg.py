"""The marma chart as a clean vector asset: the two body outlines and the points,
with every word, leader line and interior stroke taken out.

    python3 proto/anatomy-ref/marma-svg.py

Writes marma-points-clean.svg beside this file. Needs numpy, scipy and
opencv-python-headless. Run from the repo root; it calls node once to read
charts.js.

WHY THE OUTLINE IS TRACED AND NOT THE BODY PAGE'S BODYPATH. The points were
drawn on this figure. Traced, every coordinate stays a pixel of
refs/marma-points-chart.png and every dot lands where the chart put it with no
mapping at all. BODYPATH is a different body, and carrying 82 points onto it
through landmarks (the work charts.js and measure.js do for the Body page) is
a fit with its own error, which is the wrong trade for an asset whose whole
job is to be this chart without its clutter.

HOW THE OUTLINE IS FOUND. Everything lighter than 175 is background. The
background regions that touch the image border are outside. That alone fills
too much, because a gap enclosed by the drawing (between the legs, under an
arm) or a triangle closed by two leader lines is background that does not
touch the border. Those regions are named below by id, each one read off a
numbered, zoomed region map rather than seeded by coordinate. A coordinate
seed was tried first: it ran through small arm pieces cut off by leader lines,
no size limit could tell them from a gap, and the arms vanished. Then the
mask is opened to cut the one and two pixel leader strands and letters, the
two largest shapes are kept, and the contour is smoothed along its own length
(so the scan grain goes and the fingers stay), simplified, and written as
Catmull-Rom curves.

The front head is a knot of seven leaders (charts.js: "illegible"), so it
alone gets a harder opening, inside a box around it.

THE POINTS. Every trunk and head point is charts.js's reading, reused as it
stands. The limb points were not needed for the Body page and were never read
there, so they were read for this asset the same way: find.py's discs where it
saw them, a grid crop by eye where a dot sits on a line, and every eye reading
checked against the centroid of the darkest pixels within two pixels of it
(largest shift 1.5 pixels, and every one sits on a pixel darker than 70).
charts.js's m.face entry has no position and is not drawn. Its ok:false on
Matrika means the point cannot stand for a place on our figure; the dot is on
this chart, so it is kept here. Names ride along as data-name and are never
drawn.
"""
import json
import os
import subprocess

import cv2
import numpy as np
from scipy import ndimage as ndi
from scipy.ndimage import gaussian_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, 'refs', 'marma-points-chart.png')
OUT = os.path.join(HERE, 'marma-points-clean.svg')

THR = 175     # darker than this is ink
S = 4         # work at four times the chart, for a smooth edge
SIG = 7       # smoothing along the contour, in 4x samples: about 1.75 chart pixels
EPS = 1.6     # simplification tolerance, in 4x pixels
INK = '#3A3833'
DOT_R = 2.1   # in chart pixels
LINE_W = 1.2

# Background regions that are outside the body although the border cannot
# reach them. Ids are scipy.ndimage.label of (gray >= THR), default 4-connected;
# they are stable for this image and this threshold and nothing else.
ENCLOSED_OUTSIDE = {
    'front, left armpit': [239],
    'front, right arm gap': [282, 317],
    'front, between the legs, crotch to feet': [474, 489, 513, 549, 557, 565],
    'front, leader triangles at the feet': [538, 542, 576],
    'front, leader pockets at thigh and elbow': [495, 284],
    'back, between the thighs': [456],
    'back, left arm gap': [273, 299, 322],
    'back, right arm gap': [255, 287],
    'back, leader triangles at the feet': [547, 579],
}
HEAD_BOX = (145, 40, 215, 118)   # x0 y0 x1 y1, chart pixels, the front head knot

# limb points read for this asset, in chart pixels. .r and .l are the
# person's right and left: image left is the right on the front and the left
# on the back.
EYE = {
    'MF': [
        ('chest-unlabelled', [(152.5, 142.0), (206.5, 141.5)]),
        ('urvi-arm', [(123.0, 151.1), (234.0, 150.7)]),
        ('ani-arm', [(130.0, 190.5), (226.3, 190.4)]),
        ('kurpara.r', [(129.0, 202.0)]),
        ('kurpara.l', [(220.2, 201.5), (239.5, 202.0)]),
        ('indrabasti-arm', [(124.8, 224.6), (235.8, 224.0)]),
        ('wrist.r', [(106.0, 253.0), (112.7, 255.3), (120.0, 257.0)]),
        ('wrist.l', [(238.3, 258.5), (246.3, 260.3), (253.5, 259.5)]),
        ('kurchcha-hand.r', [(105.8, 264.8)]),
        ('talahridaya.r', [(109.8, 268.2)]),
        ('kurchcha-hand.l', [(259.5, 284.5)]),
        ('urvi', [(160.3, 307.0), (203.8, 306.7)]),
        ('ani', [(162.0, 338.5), (202.5, 338.0)]),
        ('janu', [(158.8, 367.4), (203.3, 366.0)]),
        ('ankle.r', [(158.3, 444.0), (174.5, 443.5)]),
        ('ankle.l', [(187.2, 445.5), (202.5, 445.0)]),
        ('kshipra.r', [(171.2, 452.6), (171.9, 456.5)]),
        ('kshipra.l', [(192.5, 452.4), (191.6, 456.5)]),
    ],
    'MB': [
        ('urvi', [(415.5, 294.5), (458.4, 294.4)]),
        ('ani', [(415.5, 318.3), (458.5, 318.0)]),
        ('janu', [(416.0, 355.5), (459.5, 355.6)]),
        ('indrabasti', [(416.5, 378.5), (459.5, 377.7)]),
        ('gulpha', [(426.5, 443.0), (450.5, 443.0)]),
    ],
}


def points():
    js = ("const {PTS}=require(process.argv[1]);"
          "console.log(JSON.stringify(PTS.filter(p=>p.fig.startsWith('M')&&p.p)))")
    pts = json.loads(subprocess.check_output(['node', '-e', js, os.path.join(HERE, 'charts.js')]))
    out = []
    for p in pts:
        pair = isinstance(p['p'][0], list)
        for i, q in enumerate(p['p'] if pair else [p['p']]):
            side = ('.l', '.r') if p['fig'] == 'MB' else ('.r', '.l')
            name = p['id'][2:] + (side[i] if pair else '')
            out.append((p['fig'], name, q[0], q[1]))
    for fig, rows in EYE.items():
        for name, qs in rows:
            for i, q in enumerate(qs):
                if len(qs) == 1:
                    suffix = ''
                elif name.endswith(('.r', '.l')):      # one side already: number them, image left first
                    suffix = f'.{i + 1}'
                else:                                  # a pair: the person's right is image left on the front
                    suffix = ('.l', '.r')[i] if fig == 'MB' else ('.r', '.l')[i]
                out.append((fig, name + suffix, q[0], q[1]))
    return out


def silhouette():
    g = cv2.imread(REF, cv2.IMREAD_GRAYSCALE)
    lab, _ = ndi.label(g >= THR)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    outside = set(border)
    for ids in ENCLOSED_OUTSIDE.values():
        outside |= set(ids)
    o = np.isin(lab, list(outside)).astype(np.uint8)
    o = cv2.resize(o, None, fx=S, fy=S, interpolation=cv2.INTER_NEAREST)
    # grow the outside half a stroke, so the edge runs down the middle of the drawn line
    o = cv2.dilate(o, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    body = (1 - o).astype(np.uint8)
    body = cv2.morphologyEx(body, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
    x0, y0, x1, y1 = HEAD_BOX
    sl = (slice(y0 * S, y1 * S), slice(x0 * S, x1 * S))
    body[sl] = cv2.morphologyEx(body[sl].copy(), cv2.MORPH_OPEN,
                                cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (29, 29)))
    l2, _ = ndi.label(body)
    sz = np.bincount(l2.ravel())
    sz[0] = 0
    body = np.isin(l2, np.argsort(sz)[::-1][:2]).astype(np.float32)
    body = (cv2.GaussianBlur(body, (0, 0), 3.0) > 0.5).astype(np.uint8)
    cs, _ = cv2.findContours(body, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    return sorted(cs, key=lambda c: c[:, 0, 0].mean())   # front, then back


def path(c):
    c = c[:, 0, :].astype(float)
    c = np.stack([gaussian_filter1d(c[:, 0], SIG, mode='wrap'),
                  gaussian_filter1d(c[:, 1], SIG, mode='wrap')], 1)
    c = cv2.approxPolyDP(c.astype(np.float32)[:, None, :], EPS, True)[:, 0, :].astype(float)
    P = (c + 0.5) / S - 0.5          # centre of a 4x pixel, in chart pixel index space
    n = len(P)
    d = f'M{P[0, 0]:.1f} {P[0, 1]:.1f}'
    for i in range(n):               # closed Catmull-Rom, as cubic Beziers
        p0, p1, p2, p3 = P[i - 1], P[i], P[(i + 1) % n], P[(i + 2) % n]
        a, b = p1 + (p2 - p0) / 6, p2 - (p3 - p1) / 6
        d += f'C{a[0]:.1f} {a[1]:.1f} {b[0]:.1f} {b[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d + 'Z'


def main():
    cs = silhouette()
    pts = points()
    xs = np.concatenate([c[:, 0, 0] for c in cs]) / S
    ys = np.concatenate([c[:, 0, 1] for c in cs]) / S
    pad = 12
    x0, y0, x1, y1 = xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad

    def group(gid, label, c, fig):
        dots = '\n'.join(f'      <circle cx="{x:.1f}" cy="{y:.1f}" r="{DOT_R}" data-name="{n}"/>'
                         for f, n, x, y in pts if f == fig)
        return (f'  <g id="{gid}" aria-label="{label}">\n'
                f'    <path class="outline" d="{path(c)}" fill="none" stroke="{INK}" '
                f'stroke-width="{LINE_W}" stroke-linejoin="round"/>\n'
                f'    <g class="points" fill="{INK}">\n{dots}\n    </g>\n  </g>')

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.0f} {y0:.0f} {x1 - x0:.0f} {y1 - y0:.0f}" '
           f'width="{(x1 - x0) * 2:.0f}" height="{(y1 - y0) * 2:.0f}" role="img" '
           f'aria-label="Marma points, front and back">\n'
           '  <!-- Traced from proto/anatomy-ref/refs/marma-points-chart.png by marma-svg.py.\n'
           '       Coordinates are that image\'s pixels, so every point sits where the chart\n'
           '       drew it. Text, leader lines and interior strokes removed. Point names are\n'
           '       data attributes and are never drawn. -->\n'
           f'{group("front", "Front figure", cs[0], "MF")}\n'
           f'{group("back", "Back figure", cs[1], "MB")}\n'
           '</svg>\n')
    with open(OUT, 'w') as f:
        f.write(svg)
    nf = sum(1 for p in pts if p[0] == 'MF')
    print(f'{OUT}: {nf} front points, {len(pts) - nf} back, {len(svg)} bytes')


if __name__ == '__main__':
    main()
