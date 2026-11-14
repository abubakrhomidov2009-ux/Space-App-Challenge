"""Redraws the Lunokhod-1 traverse from the MIIGAiK/DLR map as data for the story page.

    python scripts/extract-lunokhod-track.py <Lunokhod-1_traverse_map_Luna_17.pdf> app/museum/routes/lunokhod.ts

Needs: pymupdf, numpy, scipy, scikit-image.

Source map: "Lunokhod-1 traverse map (Landing site Luna-17)", Moscow State University of
Geodesy and Cartography (MIIGAiK) with the German Aerospace Center (DLR), 2012.
https://planetarynames.wr.usgs.gov/images/Lunar/Lunokhod-1_traverse_map_Luna_17.pdf

The PDF is one raster picture. The pink traverse line is picked out by colour, thinned to a
one-pixel track and placed with the map's own graticule. The map shows the SHAPE of the
traverse, not the ORDER in which it was driven, so the output stores each branch with its
distance along the track from the landing site instead of a drive sequence.
"""
import sys
from collections import defaultdict
from heapq import heappop, heappush

import numpy as np
import pymupdf
from scipy import ndimage as ndi
from skimage.draw import line as draw_line
from skimage.morphology import binary_closing, binary_dilation, disk, skeletonize

pdf_path, out_path = sys.argv[1], sys.argv[2]

# Graticule of this map, read from the tick marks around the frame (pixels of the embedded image).
FRAME = (195, 532, 1891, 4023)          # left, top, right, bottom
LAT_TOP_PX, LAT_STEP_PX = 547.0, 199.2  # 38 deg 20' N, every 30"
LON_LEFT_PX, LON_STEP_PX = 279.0, 161.5  # 35 deg 3' W, every 30"
LAT_DEG = 38.25
MOON_KM_PER_DEG = 1737.4 * np.pi / 180
NORTH_M_PER_PX = 30 / 3600 * MOON_KM_PER_DEG * 1000 / LAT_STEP_PX
EAST_M_PER_PX = 30 / 3600 * MOON_KM_PER_DEG * 1000 * np.cos(np.radians(LAT_DEG)) / LON_STEP_PX

doc = pymupdf.open(pdf_path)
page = doc[0]
image = page.get_images(full=True)[0]
pix = pymupdf.Pixmap(doc, image[0])
rgb = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3].astype(int)
R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]

inside = np.zeros(R.shape, bool)
inside[FRAME[1]:FRAME[3], FRAME[0]:FRAME[2]] = True
pink = (R > 170) & (B > 110) & (G < 110) & (R - G > 110) & inside

# Keep real pieces of the line, drop specks.
labels, count = ndi.label(binary_dilation(pink, disk(2)))
sizes = ndi.sum(pink, labels, range(1, count + 1))
pink &= np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s > 200])
# Close breaks of a few pixels where grid lines and labels cross the line, then thin it.
skeleton = skeletonize(binary_closing(pink, disk(5)))

# The landing and crossroad symbols hide short pieces of the line. Repeatedly join the two nearest
# separate parts of the track until it is one line, as long as the gap is small.
from scipy.spatial import cKDTree

MAX_GAP_PX = 120
joined = []
while True:
    parts, n_parts = ndi.label(skeleton, structure=np.ones((3, 3)))
    sizes = ndi.sum(skeleton, parts, range(1, n_parts + 1))
    for i, size in enumerate(sizes, start=1):
        if size < 40:
            skeleton[parts == i] = False  # specks, not track
    parts, n_parts = ndi.label(skeleton, structure=np.ones((3, 3)))
    if n_parts <= 1:
        break
    best = None
    points_of = {i: np.argwhere(parts == i) for i in range(1, n_parts + 1)}
    for a in range(1, n_parts + 1):
        tree = cKDTree(points_of[a])
        for b in range(a + 1, n_parts + 1):
            distances, indices = tree.query(points_of[b])
            j = int(distances.argmin())
            if best is None or distances[j] < best[0]:
                best = (float(distances[j]), points_of[a][indices[j]], points_of[b][j])
    if best is None or best[0] > MAX_GAP_PX:
        break
    rr, cc = draw_line(*best[1], *best[2])
    skeleton[rr, cc] = True
    joined.append(round(best[0]))
print('gaps joined (px):', joined)

# Keep only the connected track; stray specks near the symbols are not part of it.
connected, n_connected = ndi.label(skeleton, structure=np.ones((3, 3)))
largest = 1 + int(np.argmax(ndi.sum(skeleton, connected, range(1, n_connected + 1))))
skeleton &= connected == largest

# Landing site (green symbol) and final position (red square).
def centre(mask):
    """Centre of the largest blob of this colour: the map symbol, not stray similar shades."""
    blobs, n = ndi.label(mask & inside)
    biggest = 1 + int(np.argmax(ndi.sum(mask & inside, blobs, range(1, n + 1))))
    ys, xs = np.nonzero(blobs == biggest)
    return ys.mean(), xs.mean()

green = (G > 200) & (R < 100) & (B < 100)
red = (R > 200) & (G < 60) & (B < 60)
landing_y, landing_x = centre(green)
final_y, final_x = centre(red)
print('landing symbol at', round(landing_x), round(landing_y), 'final symbol at', round(final_x), round(final_y))

pixels = {tuple(p) for p in np.argwhere(skeleton)}
steps = [(dy, dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy, dx) != (0, 0)]

def step_m(dy, dx):
    return float(np.hypot(dy * NORTH_M_PER_PX, dx * EAST_M_PER_PX))

def nearest(y, x):
    return min(pixels, key=lambda p: (p[0] - y) ** 2 + (p[1] - x) ** 2)

start = nearest(landing_y, landing_x)

# Distance along the track from the landing site (Dijkstra) and the shortest-path tree.
dist = {start: 0.0}
parent = {start: None}
queue = [(0.0, start)]
while queue:
    d, p = heappop(queue)
    if d > dist[p]:
        continue
    for dy, dx in steps:
        q = (p[0] + dy, p[1] + dx)
        if q in pixels:
            nd = d + step_m(dy, dx)
            if nd < dist.get(q, 1e18):
                dist[q] = nd
                parent[q] = p
                heappush(queue, (nd, q))

# The final position symbol sits beside the line, so take the nearest point the rover could reach.
pixels = set(dist)
end = nearest(final_y, final_x)

children = defaultdict(list)
for p, par in parent.items():
    if par is not None:
        children[par].append(p)

# Cut the tree into chains that run outward from the landing site, so distance grows along each one.
chains = []
stack = [(start, [start])]
while stack:
    node, chain = stack.pop()
    kids = children[node]
    if len(kids) == 1:
        chain.append(kids[0])
        stack.append((kids[0], chain))
        continue
    chains.append(chain)
    for kid in kids:
        stack.append((kid, [node, kid]))

def simplify(points, tolerance):
    keep = [0, len(points) - 1]
    stack = [(0, len(points) - 1)]
    flags = np.zeros(len(points), bool)
    flags[0] = flags[-1] = True
    while stack:
        a, b = stack.pop()
        (ay, ax), (by, bx) = points[a], points[b]
        length = np.hypot(by - ay, bx - ax) or 1
        worst, index = 0, -1
        for i in range(a + 1, b):
            py, px = points[i]
            dd = abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / length
            if dd > worst:
                worst, index = dd, i
        if worst > tolerance:
            flags[index] = True
            stack += [(a, index), (index, b)]
    return [p for p, f in zip(points, flags) if f]

def to_metres(y, x):
    return [round((x - landing_x) * EAST_M_PER_PX), round((landing_y - y) * NORTH_M_PER_PX)]

out_chains = []
for chain in chains:
    if len(chain) < 3:
        continue
    d0, d1 = dist[chain[0]], dist[chain[-1]]
    is_leaf = not children[chain[-1]]
    # Drop pixel-sized spurs left by the thinning.
    if is_leaf and d1 - d0 < 30:
        continue
    pts = simplify(chain, 1.6)
    out_chains.append({
        'from': round(d0),
        'to': round(d1),
        'pts': [to_metres(*p) for p in pts],
    })

reach = max(c['to'] for c in out_chains)
final = to_metres(*end)
final_d = round(dist[end])
body = f"""// Generated by scripts/extract-lunokhod-track.py. Do not edit by hand.
// Redrawn from the Lunokhod-1 traverse map by MIIGAiK and DLR (2012).
// The map shows the shape of the traverse, not the order it was driven in.
// Every chain runs outward from the landing site: [metres east, metres north] points,
// with the distance along the track from the landing site at its start and end.
export const lunokhodTrack = {{
  // Distance along the track from the landing site to its farthest point, in metres.
  reachM: {reach},
  // Final position of the rover and its distance along the track from the landing site.
  final: {{ point: {final} as [number, number], atM: {final_d} }},
  chains: [{','.join(f"{{from:{c['from']},to:{c['to']},pts:{c['pts']}}}" for c in out_chains).replace(' ', '')}] as {{ from: number; to: number; pts: [number, number][] }}[],
}};
"""
open(out_path, 'w', encoding='utf-8').write(body)
total_pts = sum(len(c['pts']) for c in out_chains)
print(f'{len(out_chains)} chains, {total_pts} points, reach {reach} m, final at {final} m ({final_d} m along track)')
