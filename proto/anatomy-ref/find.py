"""The dot finder charts.js names: every solid dark disc in a chart image.

    python3 proto/anatomy-ref/find.py refs/112-node-chart.png 70 3 7
    python3 proto/anatomy-ref/find.py refs/marma-points-chart.png 120 2 7

Arguments: the image, the darkness threshold, the smallest and largest
disc in pixels. Prints one line per disc, x y and pixel count, in reading
order. A leader line is one or two pixels wide and a letter is joined to
the rest of its word, so a component that is small, square and more than
half full is a drawn dot. Letters that are themselves small and round (a
full stop, the bowl of an o) come through too, which is why every point
charts.js uses was also checked by eye on a grid crop.
"""
import sys
from collections import deque
from PIL import Image


def discs(path, thr, lo, hi):
    img = Image.open(path).convert('L')
    w, h = img.size
    px = img.load()
    dark = [[px[x, y] < thr for x in range(w)] for y in range(h)]
    seen = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if not dark[y][x] or seen[y][x]:
                continue
            seen[y][x] = True
            q, pts = deque([(y, x)]), []
            while q:
                cy, cx = q.popleft()
                pts.append((cy, cx))
                for ny in (cy - 1, cy, cy + 1):
                    for nx in (cx - 1, cx, cx + 1):
                        if 0 <= ny < h and 0 <= nx < w and dark[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = True
                            q.append((ny, nx))
            ys = [p[0] for p in pts]
            xs = [p[1] for p in pts]
            bw, bh = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
            if lo <= bw <= hi and lo <= bh <= hi and len(pts) >= 0.55 * bw * bh:
                yield sum(xs) / len(xs), sum(ys) / len(ys), len(pts)


if __name__ == '__main__':
    path, thr, lo, hi = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
    for x, y, n in discs(path, thr, lo, hi):
        print(f'{x:7.1f} {y:7.1f} {n:3d}')
