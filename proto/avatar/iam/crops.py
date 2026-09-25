#!/usr/bin/env python3
"""THE PIECES OF FIELD NOTE 11 EACH QUESTION IS ABOUT.

python3 proto/avatar/iam/crops.py  ->  proto/avatar/iam/crops/*.jpg

Ruled: a question about a drawing is asked with the drawing, and a question
about something earlier carries the earlier thing. So every question in the
comp carries the part of his page it is asking about, cut from the photograph
itself rather than described.

The photograph is stored landscape with an EXIF rotation. The first cut of
these crops read the raw pixels and came back sideways, so the orientation is
applied before anything is cut, and every box below is in the upright page's
own pixels, 1848 by 4000.
"""
import os
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '../../../docs/field-notes/11-discovery-character-sheet.jpg')
OUT = os.path.join(HERE, 'crops')
os.makedirs(OUT, exist_ok=True)

im = ImageOps.exif_transpose(Image.open(SRC)).convert('RGB')
assert im.size == (1848, 4000), im.size

BOXES = {
    # name        box in the upright page          width to save
    'sheet':    ((40, 700, 1790, 3230), 560),
    'title':    ((400, 720, 1848, 1080), 620),
    'rail':     ((60, 1080, 800, 1880), 360),
    'column':   ((560, 1020, 1320, 2800), 300),
    'boxes':    ((500, 1000, 1320, 1700), 460),
    'badges':   ((1100, 1060, 1848, 2140), 420),
    'low3':     ((700, 1930, 1560, 2790), 460),
    'weeks':    ((820, 2800, 1848, 3200), 520),
    'link':     ((1050, 1120, 1500, 1640), 300),
}
# the seven circles, top to bottom, as he drew them. centre and half width.
CIRCLES = [('belief', 866, 1150, 128), ('perception', 894, 1362, 140),
           ('speak', 896, 1580, 140), ('compassion', 882, 1812, 134),
           ('empowerment', 942, 2078, 152), ('passion', 946, 2366, 152),
           ('survival', 944, 2660, 128)]
for nm, cx, cy, h in CIRCLES:
    BOXES['c_' + nm] = ((cx - h, cy - h, cx + h, cy + h), 120)

for nm, (box, w) in BOXES.items():
    c = im.crop(box)
    c = c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
    c.save(os.path.join(OUT, nm + '.jpg'), quality=72, optimize=True, progressive=True)

# a contact sheet, for looking, never shipped
sheet = Image.new('RGB', (7 * 124, 124), 'white')
for i, (nm, *_rest) in enumerate(CIRCLES):
    sheet.paste(Image.open(os.path.join(OUT, 'c_' + nm + '.jpg')), (i * 124 + 2, 2))
sheet.save(os.path.join(HERE, '_contact.png'))
print('wrote', len(BOXES), 'crops to', OUT)
