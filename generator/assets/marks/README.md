# LITTLE BOOKS MARK LIBRARY

Five gold line marks from *The Little Book of Reprogramming*.

```python
from marks import svg, MARKS
svg("rings")            # scalable, no width/height
svg("eye", size=64)     # fixed pixel size
```

`python3 marks.py` writes all five as `.svg` files next to the module.

| Mark | Meaning |
|---|---|
| `signature` | Two hearts on one unbroken line. Self and other, never separate. |
| `rings` | Body, field, source. The same mechanism at three scales. |
| `eye` | Seeing without scanning for threat. Open, not guarding. |
| `triangle` | Intention, integrity, resistance. The three terms, and the line through them. |
| `portal` | The door. The line crosses it and keeps going, so the threshold is not an end. |
| `eye_closed` | Closed. The line is still there, riding above the lid, unseen and running. |
| `circle` | One field. The line enters, crosses, and leaves without breaking. |
| `bolt` | Discharge. The charge leaves in one stroke and the line runs on through it. |

## The pair

`eye` and `eye_closed` are one set, not two marks. They carry the
**when closed / when open** structure the energy pages are built on. Open,
the line runs through the pupil and the eye is seeing rather than scanning.
Closed, the line rides above the lid, still running, unwatched.

Use them together wherever that pair is the point.

## The system

Every mark is one continuous line carrying two hearts, a large one and a
small one, riding a horizontal wave. The line runs edge to edge and passes
straight through whatever frame encloses it. **The frame changes. The line
does not.** That is the whole idea and it should survive any future mark.

Gold is `#B8902F`.

## Status, read this before using them in print

**These are SVG recreations, not vector traces.** The originals arrived as
raster images in conversation and were never files on disk, so nothing could
be traced. The geometry was rebuilt by eye and rendered to check.

They are accurate enough for screen, social and layout. **Replace them with
the authored vectors before anything goes to print.** If the original AI, EPS
or SVG files exist, those win.

## Cover typography, from the printed COURAGE

Observed from the real cover, not invented.

```
The Little Book of        serif, roman, small
REPROGRAMMING             serif, letterspaced caps, medium
COURAGE                   serif, caps, very large, in the band colour
[mark]                    gold, centred, lower third
```

White ground. The title carries the band colour, red for Root. Everything
else is near-black. The mark sits alone in the lower third with air around
it. Trim is 396 x 612 pt, 5.5 x 8.5 in, which is the Little Books trim and
not the 306 x 492 used by the eleven volumes.

## Not the same system as the eleven volumes

The Somatic Books use a different mark set: one line-drawn mark per volume
carrying that volume's mechanism, held in `MARKS` inside `build_volume.py`.
These five are the earlier Little Books identity. Keep them apart.
