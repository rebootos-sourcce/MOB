"""Builds the GIF and the phase strip for one recording, from the frames
record.js stepped through. Called by record.js; not run by hand.

  argv: frame_dir out_stem gif_fps on_ms strip_json look
"""
import sys, os, json, glob
from PIL import Image, ImageDraw, ImageFont

src, stem, gfps, on_ms, strip, look = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), json.loads(sys.argv[5]), sys.argv[6]
W = int(sys.argv[7]) if len(sys.argv) > 7 else 420
frames = sorted(glob.glob(os.path.join(src, '[0-9]*.jpg')))
step = 1000 / 60

# THE GIF. Resampled from the 60 a second capture to the GIF's own rate by
# nearest frame, never by blending, so no frame in it is one the page did not
# draw. Scaled to 420 across, and one palette for the whole run so the ground
# does not flicker between frames.
n_out = int(len(frames) * step / (1000 / gfps))
pick = [frames[min(len(frames) - 1, round(i * (1000 / gfps) / step))] for i in range(n_out)]
def fit(im):
    return im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
imgs = [fit(Image.open(f).convert('RGB')) for f in pick]
# the palette comes from the busiest frames, the middle of the run
H = imgs[0].height
probe = Image.new('RGB', (W, H * 3))
for k, fr in enumerate([imgs[len(imgs) // 3], imgs[len(imgs) // 2], imgs[2 * len(imgs) // 3]]):
    probe.paste(fr, (0, H * k))
pal = probe.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
q = [im.quantize(palette=pal, dither=Image.Dither.NONE) for im in imgs]
q[0].save(stem + '.gif', save_all=True, append_images=q[1:], duration=int(1000 / gfps), loop=0, optimize=True, disposal=1)

# THE STRIP. Six phases in a row, each marked with its time after Active was
# pressed, so the motion can be read in a medium that cannot play it.
picks = sorted(glob.glob(os.path.join(src, 'pick-*.png')), key=lambda f: float(os.path.basename(f)[5:-4].replace('m', '-')))
if picks:
    ims = [Image.open(f).convert('RGB') for f in picks]
    # three across and two down at 520, because six in a row at 360 made the
    # difference between two phases of a string too small to see
    # a side by side comparison is already three wide, so it stacks one a row
    s, cols = (520, 3) if look != 'compare' else (ims[0].width, 1)
    sh = round(ims[0].height * s / ims[0].width)
    ims = [im.resize((s, sh), Image.LANCZOS) for im in ims]
    pad, top = 12, 30
    rows = (len(ims) + cols - 1) // cols
    out = Image.new('RGB', (cols * (s + pad) + pad, rows * (sh + top + pad) + pad), (11, 11, 13))
    d = ImageDraw.Draw(out)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
    except Exception:
        font = ImageFont.load_default()
    for k, (im, f) in enumerate(zip(ims, picks)):
        t = float(os.path.basename(f)[5:-4].replace('m', '-'))
        x = pad + (k % cols) * (s + pad)
        y = pad + (k // cols) * (sh + top + pad)
        out.paste(im, (x, y + top))
        lab = ('%d ms before Active' % -t) if t < 0 else ('%d ms after Active' % t)
        d.text((x + 2, y + 7), lab, fill=(180, 176, 168), font=font)
    out.save(stem + '-strip.png', optimize=True)
print(os.path.basename(stem), 'gif', len(q), 'frames at', gfps, 'fps,', os.path.getsize(stem + '.gif') // 1024, 'KB')
