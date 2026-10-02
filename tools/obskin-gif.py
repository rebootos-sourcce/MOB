"""Turn tools/obskin-motion.js frames into one animated GIF per width.

    python3 tools/obskin-gif.py OUT

Each transition plays at its own 40ms a frame, and the last frame of each is
held so the eye can read where it landed before the next one starts. The
width is cut down for size: 1600 to 720, 390 to 360. Frames are exact, from frozen and seeked animations, so this is
the choreography as designed, not as one machine happened to play it."""
import sys, os, glob, re
from PIL import Image
OUT = sys.argv[1] if len(sys.argv) > 1 else 'motion'
SCALE = {'1600': 720, '390': 360}
HOLD = 900
# ONE PALETTE, NO DITHER. The first cut quantised every frame to its own
# palette with Floyd-Steinberg, so two frames of a still background differed in
# every pixel and nothing compressed: 51 MB at 1600 and 42 at 390, too large to
# send. One palette built from frames across the whole walk, and no dither, so
# a pixel that does not move is the same index in every frame and the writer
# stores only the part of each frame that changed. The cost is some banding in
# the soft wash, which is a property of GIF and not of the build. Octree and
# not median cut: median cut spent the palette on the dark ground and the
# small bright seat glows came out grey, octree keeps them their own colour,
# and the seat's colour is the one thing in a frame that must survive. The
# walk-W.webm beside it is colour true, for when banding matters.
for w, tw in SCALE.items():
    d = os.path.join(OUT, 'frames-' + w)
    fs = sorted(glob.glob(os.path.join(d, '*.png')))
    if not fs:
        continue
    frames, durs, last = [], [], None
    # forty eight frames from across the walk, at output size: twelve left the
    # seat colours out of the palette and the Heart's green glow went grey,
    # and in this product the colour of a seat is the reading
    def small(f):
        im = Image.open(f).convert('RGB')
        return im.resize((tw, round(im.height * tw / im.width))) if im.width != tw else im
    sample = [small(fs[k]) for k in range(0, len(fs), max(1, len(fs) // 48))]
    sheet = Image.new('RGB', (sum(im.width for im in sample), max(im.height for im in sample)))
    x = 0
    for im in sample:
        sheet.paste(im, (x, 0)); x += im.width
    pal = sheet.quantize(colors=255, method=Image.Quantize.FASTOCTREE)
    for i, f in enumerate(fs):
        mv = re.match(r'\d+-(.+)-\d+\.png$', os.path.basename(f)).group(1)
        nxt = re.match(r'\d+-(.+)-\d+\.png$', os.path.basename(fs[i + 1])).group(1) if i + 1 < len(fs) else None
        im = Image.open(f).convert('RGB')
        if im.width != tw:
            im = im.resize((tw, round(im.height * tw / im.width)), Image.LANCZOS)
        frames.append(im.quantize(palette=pal, dither=Image.Dither.NONE))
        durs.append(HOLD if nxt != mv else 40)
    dst = os.path.join(OUT, 'onboarding-motion-' + w + '.gif')
    frames[0].save(dst, save_all=True, append_images=frames[1:], duration=durs, loop=0, optimize=True, disposal=1)
    print(dst, len(frames), 'frames', round(os.path.getsize(dst) / 1e6, 1), 'MB')
