#!/usr/bin/env python3
"""
LITTLE BOOKS MARK LIBRARY
Gold line marks from The Little Book of Reprogramming.

STATUS: SVG RECREATIONS, not vector traces. The originals arrived as raster
images in conversation and were never files on disk. These are built to match
the observed geometry. Replace with the authored vectors when they surface.

The signature element in every mark is one continuous line carrying two
hearts, a large one and a small one, riding a horizontal wave. The line runs
edge to edge and passes through whatever frame encloses it. The frame changes.
The line does not.

GOLD: #B8902F
"""

GOLD = "#B8902F"

# The signature. One line, two hearts, running the full width.
_LINE = (
  "M4 62 C60 50 130 44 196 54 C232 60 254 66 272 68 "
  "M272 68 C300 70 330 64 362 56 C404 46 452 44 492 52 "
  "C536 61 574 78 616 80 C660 82 700 66 740 54 C776 44 796 42 812 44"
)
_HEART_BIG = (
  "M196 54 C186 26 206 8 224 16 C234 20 240 32 242 42 "
  "C248 30 262 20 274 26 C292 34 290 58 272 68 "
  "C258 76 244 88 240 100 C236 88 222 74 208 66 Z"
)
_HEART_SMALL = (
  "M300 62 C294 42 308 30 320 36 C327 39 331 47 333 54 "
  "C337 45 347 38 356 42 C369 48 367 64 354 72 "
  "C344 78 336 86 333 94 C330 86 320 76 310 70 Z"
)
_TAIL = "M240 100 C232 118 236 134 244 134 C252 134 254 118 240 100 Z"

SIGNATURE = _LINE + " " + _HEART_BIG + " " + _HEART_SMALL + " " + _TAIL

MARKS = {
  # 1 · the bare signature. Used as a divider and as the base of every other mark.
  "signature": {
    "viewBox": "0 0 816 150",
    "paths": [(SIGNATURE, 3.0)],
    "meaning": "Two hearts on one unbroken line. Self and other, never separate.",
  },
  # 2 · three concentric rings. The field at three resolutions.
  "rings": {
    "viewBox": "0 0 816 816",
    "paths": [
      ("M408 60 A348 348 0 1 1 407 60 Z", 20),
      ("M408 160 A248 248 0 1 1 407 160 Z", 16),
      ("M408 300 A108 108 0 1 1 407 300 Z", 13),
      (SIGNATURE, 2.2),
    ],
    "transform_last": "translate(0,333)",
    "meaning": "Body, field, source. The same mechanism at three scales.",
  },
  # 3 · the eye with rays. Perception, open.
  "eye": {
    "viewBox": "0 0 816 640",
    "paths": [
      ("M40 330 C180 170 300 140 408 140 C516 140 636 170 776 330 "
       "C636 490 516 520 408 520 C300 520 180 490 40 330 Z", 26),
      ("M408 220 A110 110 0 1 1 407 220 Z", 22),
      ("M300 96 L272 30 M408 76 L408 6 M516 96 L544 30 "
       "M196 150 L146 96 M620 150 L670 96 M110 224 L44 186 M706 224 L772 186", 26),
      (SIGNATURE, 2.2),
    ],
    "transform_last": "translate(0,255)",
    "meaning": "Seeing without scanning for threat. The eye is open, not guarding.",
  },
  # 4 · the triangle. Structure, and what it holds.
  "triangle": {
    "viewBox": "0 0 816 700",
    "paths": [
      ("M408 40 L784 650 L32 650 Z", 26),
      (SIGNATURE, 3.4),
    ],
    "transform_last": "translate(0,400) scale(0.86,1)",
    "meaning": "Intention, integrity, resistance. The three terms, and the line through them.",
  },
  # 5 · the portal. A threshold you pass through.
  "portal": {
    "viewBox": "0 0 816 816",
    "paths": [
      ("M196 60 H620 V740 H196 Z", 20),
      (SIGNATURE, 2.6),
    ],
    "transform_last": "translate(0,333)",
    "meaning": "The door. The line crosses it and keeps going, so the threshold is not an end.",
  },
  # 6 · the closed eye. The pair to `eye`. Lashes down, line riding above the lid.
  "eye_closed": {
    "viewBox": "0 0 816 640",
    "paths": [
      ("M70 300 C200 470 300 520 408 520 C516 520 616 470 746 300", 30),
      ("M112 372 L54 452 M214 448 L170 540 M330 494 L312 590 "
       "M486 494 L504 590 M602 448 L646 540 M704 372 L762 452", 30),
      (SIGNATURE, 2.2),
    ],
    "transform_last": "translate(0,120) scale(0.82,1) translate(90,0)",
    "meaning": "Closed. The line is still there, riding above the lid, unseen and running.",
  },
  # 7 · the single ring. One field, not three.
  "circle": {
    "viewBox": "0 0 816 816",
    "paths": [
      ("M408 56 A352 352 0 1 1 407 56 Z", 24),
      (SIGNATURE, 2.4),
    ],
    "transform_last": "translate(0,333)",
    "meaning": "One field. The line enters, crosses, and leaves without breaking.",
  },
  # 8 · the bolt. Discharge. The moment the charge leaves.
  "bolt": {
    "viewBox": "0 0 816 1000",
    "paths": [
      ("M470 60 L232 470 L400 470 L176 940 L634 400 L452 400 L640 60 Z", 22),
      (SIGNATURE, 2.6),
    ],
    "transform_last": "translate(0,430) scale(0.9,1) translate(45,0)",
    "meaning": "Discharge. The charge leaves in one stroke and the line runs on through it.",
  },
}


def svg(name, size=None, color=GOLD, cap="round"):
    """One mark as SVG. size=None omits width/height so CSS can scale it."""
    m = MARKS[name]
    dim = f'width="{size}" height="{size}" ' if size else ""
    out = [f'<svg viewBox="{m["viewBox"]}" {dim}'
           f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{name} mark">']
    last = len(m["paths"]) - 1
    for i, (d, w) in enumerate(m["paths"]):
        t = ""
        if i == last and m.get("transform_last"):
            t = f' transform="{m["transform_last"]}"'
        out.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" '
                   f'stroke-linecap="{cap}" stroke-linejoin="{cap}"{t}/>')
    out.append("</svg>")
    return "".join(out)


def write_all(outdir="."):
    import pathlib
    p = pathlib.Path(outdir)
    p.mkdir(parents=True, exist_ok=True)
    for name in MARKS:
        (p / f"{name}.svg").write_text(svg(name, size=None))
    return sorted(MARKS)


if __name__ == "__main__":
    import pathlib
    here = pathlib.Path(__file__).resolve().parent
    for n in write_all(here):
        print(f"  {n}.svg  ·  {MARKS[n]['meaning']}")
