"""
Step 2 of the Earth texture build: rasterise the Natural Earth rings into an
equirectangular map the globe can sample.

Rendered at 4x then downsampled, which is cheaper than per-polygon AA and gives
clean coastlines. Styled to the LogiSetu palette rather than photographic, so
the globe sits inside the navy/gold design instead of fighting it.

    python .tools/rasterise-earth.py
"""
import json
import os
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'logisetu', 'assets', 'img')

W, H = 2048, 1024
SS = 2                      # supersample factor

OCEAN = (11, 30, 61)        # #0B1E3D
LAND = (37, 65, 108)        # #25416C
LAND_HI = (52, 84, 133)     # subtle inland lift
COAST = (201, 162, 39)      # brand gold
GRATICULE = (28, 52, 92)

rings = json.load(open(os.path.join(HERE, 'earth-rings.json')))


def project(lon, lat, w, h):
    """Equirectangular: lon/lat map linearly to x/y."""
    return ((lon + 180.0) / 360.0 * w, (90.0 - lat) / 180.0 * h)


def unwrap(ring):
    """
    Remove antimeridian seams.

    Countries spanning +/-180 (Russia, Fiji, Antarctica) arrive with longitudes
    that jump the full width of the map. Drawn as-is they smear a band right
    across the texture, so shift each point to stay continuous with the last.
    """
    out = []
    prev = None
    for lon, lat in ring:
        if prev is not None:
            while lon - prev > 180.0:
                lon -= 360.0
            while prev - lon > 180.0:
                lon += 360.0
        out.append((lon, lat))
        prev = lon
    return out


def ring_passes(ring, w, h):
    """Screen-space copies of a ring, repeated so wrapped shapes still land."""
    unwrapped = unwrap(ring)
    lons = [p[0] for p in unwrapped]

    passes = [0.0]
    if min(lons) < -180.0:
        passes.append(360.0)
    if max(lons) > 180.0:
        passes.append(-360.0)

    return [
        [project(lon + shift, lat, w, h) for lon, lat in unwrapped]
        for shift in passes
    ]


def draw_map(w, h, coast_width):
    img = Image.new('RGB', (w, h), OCEAN)
    d = ImageDraw.Draw(img)

    # Graticule every 15 degrees, under the land.
    for lon in range(-180, 181, 15):
        x, _ = project(lon, 0, w, h)
        d.line([(x, 0), (x, h)], fill=GRATICULE, width=max(1, w // 2048))
    for lat in range(-75, 76, 15):
        _, y = project(0, lat, w, h)
        d.line([(0, y), (w, y)], fill=GRATICULE, width=max(1, w // 2048))

    for poly in rings:
        if not poly or len(poly[0]) < 3:
            continue

        for pts in ring_passes(poly[0], w, h):
            d.polygon(pts, fill=LAND)
            d.line(pts + [pts[0]], fill=COAST, width=coast_width)

        # Holes (lakes, enclaves) punch back to ocean.
        for hole in poly[1:]:
            if len(hole) < 3:
                continue
            for pts in ring_passes(hole, w, h):
                d.polygon(pts, fill=OCEAN)

    return img


big = draw_map(W * SS, H * SS, coast_width=2 * SS)
earth = big.resize((W, H), Image.LANCZOS)

# Gentle inland shading so landmasses read as surfaces, not flat cutouts.
land_mask = Image.new('L', (W, H), 0)
mdraw = ImageDraw.Draw(land_mask)
for poly in rings:
    if poly and len(poly[0]) >= 3:
        for pts in ring_passes(poly[0], W, H):
            mdraw.polygon(pts, fill=255)
inland = land_mask.filter(ImageFilter.GaussianBlur(6))
earth = Image.composite(Image.new('RGB', (W, H), LAND_HI), earth, inland.point(lambda v: v // 3))
earth = Image.composite(earth, earth, land_mask)

os.makedirs(OUT, exist_ok=True)
earth.save(os.path.join(OUT, 'earth-map.png'), optimize=True)
print('earth-map.png', earth.size, os.path.getsize(os.path.join(OUT, 'earth-map.png')) // 1024, 'KB')
