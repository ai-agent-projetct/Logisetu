"""
Derive web logo assets from the supplied LogiSetu artwork.

The source is a square, stacked lockup on white. A site header needs a
horizontal lockup (otherwise the wordmark renders ~10px tall), and the navy
footer needs a light variant, so both are composed here from the original
bands rather than redrawn.
"""
import numpy as np
from PIL import Image

import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'source', 'logisetu-logo.jpeg')
OUT = os.path.join(HERE, '..', 'logisetu', 'assets', 'img')

MARK = (378, 668)     # bridge + vehicles
WORD = (713, 790)     # LOGISETU
TAG = (828, 852)      # tagline rule + text


def keyed(img):
    """White background -> alpha, un-premultiplied so edges stay clean."""
    a = np.asarray(img.convert('RGB')).astype(float)
    alpha = 255.0 - a.min(axis=2)                      # white -> 0, ink -> ~255
    alpha = np.clip(alpha * 1.06, 0, 255)              # firm up near-solid ink

    safe = np.maximum(alpha, 1e-6)[..., None] / 255.0
    rgb = np.clip((a - 255.0 * (1.0 - safe)) / safe, 0, 255)

    out = np.dstack([rgb, alpha]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def to_light(img):
    """Recolour the navy portions to white; leave the orange alone."""
    a = np.asarray(img).astype(int)
    rgb, alpha = a[..., :3], a[..., 3]

    is_orange = (rgb[..., 0] > rgb[..., 2] + 55) & (rgb[..., 0] > 120)
    rgb = np.where(is_orange[..., None], rgb, np.full_like(rgb, 255))

    return Image.fromarray(np.dstack([rgb, alpha]).astype(np.uint8), 'RGBA')


def trim(img):
    box = img.getbbox()
    return img.crop(box) if box else img


def band(img, y0, y1):
    return trim(img.crop((0, y0, img.width, y1 + 1)))


def scale_h(img, h):
    return img.resize((max(1, round(img.width * h / img.height)), h), Image.LANCZOS)


def lockup(mark, word, mark_h=200, gap_ratio=0.10):
    """Horizontal lockup: mark left, wordmark optically centred to its right."""
    m = scale_h(mark, mark_h)
    w = scale_h(word, round(mark_h * 0.40))
    gap = round(mark_h * gap_ratio)

    canvas = Image.new('RGBA', (m.width + gap + w.width, mark_h), (0, 0, 0, 0))
    canvas.paste(m, (0, 0), m)
    canvas.paste(w, (m.width + gap, (mark_h - w.height) // 2), w)
    return canvas


src = keyed(Image.open(SRC))

mark = band(src, *MARK)
word = band(src, *WORD)
full = trim(src.crop((0, MARK[0], src.width, TAG[1] + 1)))

# NOTE: the horizontal lockup variants were dropped — the supplied artwork is
# to be used as-is, without recomposition.
assets = {
    'logo-mark.png':         scale_h(mark, 200),
    'logo-mark-light.png':   to_light(scale_h(mark, 200)),
    'logo-full.png':         scale_h(full, 420),
    'logo-full-light.png':   to_light(scale_h(full, 420)),
}

for name, img in assets.items():
    img.save(f'{OUT}/{name}', optimize=True)
    print(f'{name:24} {img.width}x{img.height}')

# Favicon: square crop of the mark, padded.
fav = scale_h(mark, 150)
icon = Image.new('RGBA', (180, 180), (0, 0, 0, 0))
icon.paste(fav, ((180 - fav.width) // 2, (180 - fav.height) // 2), fav)
icon.resize((64, 64), Image.LANCZOS).save(f'{OUT}/favicon.png', optimize=True)
print('favicon.png              64x64')
