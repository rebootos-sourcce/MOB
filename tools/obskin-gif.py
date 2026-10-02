"""Turn tools/obskin-motion.js frames into one animated GIF per width.

    python3 tools/obskin-gif.py OUT

Each transition plays at its own 40ms a frame, and the last frame of each is
held so the eye can read where it landed before the next one starts. The
width is cut down for size: 1600 to 800, 390 to 390 (a phone is shown at its
own width). Frames are exact, from paused and seeked animations, so this is
the choreography as designed, not as one machine happened to play it."""
import sys, os, glob, re
from PIL import Image
OUT = sys.argv[1] if len(sys.argv) > 1 else 'motion'
SCALE = {'1600': 800, '390': 390}
HOLD = 900
for w, tw in SCALE.items():
    d = os.path.join(OUT, 'frames-' + w)
    fs = sorted(glob.glob(os.path.join(d, '*.png')))
    if not fs:
        continue
    frames, durs, last = [], [], None
    for i, f in enumerate(fs):
        mv = re.match(r'\d+-(.+)-\d+\.png$', os.path.basename(f)).group(1)
        nxt = re.match(r'\d+-(.+)-\d+\.png$', os.path.basename(fs[i + 1])).group(1) if i + 1 < len(fs) else None
        im = Image.open(f).convert('RGB')
        if im.width != tw:
            im = im.resize((tw, round(im.height * tw / im.width)), Image.LANCZOS)
        frames.append(im.convert('P', palette=Image.ADAPTIVE, colors=255, dither=Image.FLOYDSTEINBERG))
        durs.append(HOLD if nxt != mv else 40)
    dst = os.path.join(OUT, 'onboarding-motion-' + w + '.gif')
    frames[0].save(dst, save_all=True, append_images=frames[1:], duration=durs, loop=0, optimize=False, disposal=1)
    print(dst, len(frames), 'frames', round(os.path.getsize(dst) / 1e6, 1), 'MB')
