"""strips.py. Stitches the four seek frames (0, 0.5, 1, 2 s) of the observatory into one strip, time written under each.
   Run from the repo root after shots.js: python3 mockups/layer-observatory/strips.py"""
import os
from PIL import Image, ImageDraw, ImageFont
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots')
TS = ['0', '0_5', '1', '2']
LAB = ['0 s', '0.5 s', '1 s', '2 s']
def font(sz):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf']:
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
for w, tw in [(1600, 640), (390, 330)]:
    ims = []
    for t in TS:
        f = os.path.join(D, '%d-strip-t%s.png' % (w, t))
        if not os.path.exists(f):
            break
        im = Image.open(f).convert('RGB')
        s = tw / im.width
        ims.append(im.resize((tw, round(im.height * s)), Image.LANCZOS))
    if len(ims) < 4:
        continue
    gap, lab = 10, 26
    H = max(i.height for i in ims)
    out = Image.new('RGB', (tw * 4 + gap * 5, H + lab + gap * 2), (12, 13, 18))
    dr = ImageDraw.Draw(out)
    for k, im in enumerate(ims):
        x = gap + k * (tw + gap)
        out.paste(im, (x, gap))
        dr.text((x + 4, gap + H + 4), LAB[k], fill=(180, 176, 168), font=font(14))
    out.save(os.path.join(D, '%d-strip.png' % w))
    print('strip', w, out.size)
