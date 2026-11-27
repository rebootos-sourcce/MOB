"""compress.py. The last step after shots.js, strips.py and field-baseline.js: turns every photograph into a high quality JPEG
   (quality 88, no chroma subsampling) and rewrites the image paths in index.html, so the folder is a few megabytes and not fifty.
   Indexing the colours down to a palette was tried first and muted the band colours, so it is not used.
   Run from the repo root:  python3 mockups/layer-observatory/compress.py"""
import os, glob, re
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
a = b = 0
for f in glob.glob(D + '/shots/*.png') + glob.glob(D + '/baseline/*.png'):
    a += os.path.getsize(f)
    out = f[:-4] + '.jpg'
    Image.open(f).convert('RGB').save(out, 'JPEG', quality=88, subsampling=0, optimize=True)
    b += os.path.getsize(out)
    os.remove(f)
p = os.path.join(D, 'index.html')
s = open(p).read()
s = re.sub(r'((?:shots|baseline)/[A-Za-z0-9_\-]+)\.png', r'\1.jpg', s)
open(p, 'w').write(s)
print('%d KB -> %d KB' % (a // 1024, b // 1024))
