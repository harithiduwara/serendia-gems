#!/usr/bin/env python3
"""
Generates the two committed brand rasters.

    public/og-default.jpg   1200x630  the card shown when a link to the site is
                                      shared on WhatsApp, Facebook, X, LinkedIn
                                      or iMessage. Stone pages use their own
                                      photograph; this is every other page's.
    src/app/apple-icon.png   180x180   iOS home-screen icon.

Usage:

    python3 scripts/generate-brand-assets.py

The OUTPUT is committed, deliberately. Rendering needs Pillow and the brand
fonts, so doing it during the build would make every deploy depend on both and
could change the image under us. Generating once and committing keeps deploys
identical and the build host-independent. Re-run this only when the brand, the
copy, or the chosen stone changes.

Fonts are fetched from Google Fonts (the same families the site loads, OFL
licensed) and are NOT committed. Without a network the script falls back to
system serif/sans, which renders a usable card that will not match the site
exactly; it says so when that happens.
"""
from __future__ import annotations

import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path("/tmp/serendia-brand-fonts")

# Design tokens — keep in step with src/app/globals.css.
WHITE = (255, 255, 255)
ROYAL = (0x16, 0x32, 0x7E)
ROYAL_BRIGHT = (0x2B, 0x57, 0xC4)
ROYAL_DEEP = (0x0B, 0x18, 0x38)
GOLD = (0x82, 0x64, 0x24)
GOLD_LINE = (0xC9, 0xA9, 0x61)
INK_MUTED = (0x5A, 0x61, 0x78)
LINE = (0xE6, 0xE6, 0xE2)

FONT_SOURCES = {
    "display": "https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "sans": "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf",
}
FALLBACKS = {
    "display": "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "sans": "/System/Library/Fonts/Helvetica.ttc",
}

_exact_fonts = True


def font_file(kind: str) -> str:
    """Brand font if obtainable, else a system face (and say so)."""
    global _exact_fonts
    CACHE.mkdir(parents=True, exist_ok=True)
    cached = CACHE / f"{kind}.ttf"
    if cached.exists():
        return str(cached)
    try:
        urllib.request.urlretrieve(FONT_SOURCES[kind], cached)
        return str(cached)
    except Exception as exc:  # offline, or Google Fonts moved the file
        _exact_fonts = False
        print(f"  ! could not fetch the {kind} brand font ({exc.__class__.__name__}); using the system face")
        return FALLBACKS[kind]


def load(kind: str, size: int, weight: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(font_file(kind), size)
    try:
        axes = [a["name"] for a in f.get_variation_axes()]
        # Inter exposes optical size before weight; set every axis positionally.
        f.set_variation_by_axes([float(size) if b"Optical" in bytes(axes[0]) else float(weight)]
                                + ([float(weight)] if len(axes) > 1 else []))
    except Exception:
        pass  # static font: nothing to vary
    return f


def width_of(draw: ImageDraw.ImageDraw, text: str, font) -> int:
    return int(draw.textlength(text, font=font))


def fitted(draw, text: str, kind: str, size: int, weight: int, max_width: int):
    """Largest size at or below `size` whose text fits `max_width`."""
    while size > 10:
        f = load(kind, size, weight)
        if width_of(draw, text, f) <= max_width:
            return f
        size -= 1
    return load(kind, size, weight)


def tracked(draw, xy, text: str, font, fill, tracking: float) -> None:
    """Letter-spaced text. Pillow has no tracking, so step glyph by glyph."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking


def gem(draw: ImageDraw.ImageDraw, x: float, y: float, s: float) -> None:
    """The sapphire mark: table, crown facets, pavilion — same shape as the logo."""
    p = lambda pts: [(x + px * s, y + py * s) for px, py in pts]
    outline = [(21.5, 2), (42, 15.5), (21.5, 50), (1, 15.5)]
    draw.polygon(p(outline), fill=ROYAL)
    draw.polygon(p([(21.5, 2), (42, 15.5), (21.5, 21.3), (1, 15.5)]), fill=ROYAL_BRIGHT)
    draw.polygon(p([(21.5, 21.3), (42, 15.5), (21.5, 50)]), fill=ROYAL_DEEP)
    draw.line(p(outline + [outline[0]]), fill=GOLD_LINE, width=max(1, int(2 * s)), joint="curve")


def cover(img: Image.Image, w: int, h: int) -> Image.Image:
    """Centre-crop to the target aspect, then resize — CSS object-fit: cover."""
    target = w / h
    src = img.width / img.height
    if src > target:
        new_w = int(img.height * target)
        box = ((img.width - new_w) // 2, 0, (img.width + new_w) // 2, img.height)
    else:
        new_h = int(img.width / target)
        box = (0, (img.height - new_h) // 2, img.width, (img.height + new_h) // 2)
    return img.crop(box).resize((w, h), Image.LANCZOS)


def build_social_card() -> None:
    W, H, PHOTO_W = 1200, 630, 520
    card = Image.new("RGB", (W, H), WHITE)

    photo = Image.open(ROOT / "public" / "gems" / "HR16_1.jpg").convert("RGB")
    card.paste(cover(photo, PHOTO_W, H), (0, 0))

    d = ImageDraw.Draw(card)
    d.rectangle([PHOTO_W, 0, PHOTO_W + 1, H], fill=LINE)

    left = PHOTO_W + 76           # 596
    right_edge = W - 76           # 1124
    col = right_edge - left       # 528

    gem(d, left, 86, 1.15)
    d.text((left + 68, 86), "Serendia", font=load("display", 46, 500), fill=ROYAL_DEEP)
    tracked(d, (left + 70, 140), "CEYLON GEMS", load("sans", 15, 600), GOLD, 4.0)

    line1 = fitted(d, "Ceylon sapphires,", "display", 58, 400, col)
    line2 = fitted(d, "one stone at a time", "display", 58, 400, col)
    d.text((left, 236), "Ceylon sapphires,", font=line1, fill=ROYAL_DEEP)
    d.text((left, 304), "one stone at a time", font=line2, fill=ROYAL)

    body = load("sans", 20, 400)
    d.text((left, 404), "Unheated and heated sapphire from Sri Lanka,", font=body, fill=INK_MUTED)
    d.text((left, 436), "photographed and specified one stone at a time.", font=body, fill=INK_MUTED)

    d.rectangle([left, 512, left + 190, 513], fill=GOLD_LINE)
    tracked(d, (left, 540), "SERENDIAGEMS.COM", load("sans", 18, 600), GOLD, 2.6)

    # JPEG, not PNG: the card is mostly photograph, and WhatsApp — the channel
    # that matters most here — commonly skips preview images much over ~300 KB.
    # PNG of this card is ~650 KB; JPEG at 86 is ~10x smaller and visually equal.
    out = ROOT / "public" / "og-default.jpg"
    card.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    size_kb = out.stat().st_size // 1024
    print(f"· {out.relative_to(ROOT)}  {W}x{H}  {size_kb} KB")
    if size_kb > 300:
        print("  ! over 300 KB — WhatsApp may not render the preview; lower the quality")


# Bounds of the gem path at scale 1, used to centre it rather than eyeball it.
GEM_X0, GEM_Y0, GEM_W, GEM_H = 1.0, 2.0, 41.0, 48.0


def build_apple_icon() -> None:
    # 4x then downsample: the facet edges are thin and alias badly at 180px.
    S = 180 * 4
    icon = Image.new("RGB", (S, S), WHITE)
    d = ImageDraw.Draw(icon)

    # Fill ~72% of the canvas, centred on the mark's own bounds. iOS shows this
    # at ~60px on a home screen, so anything smaller reads as a dot.
    scale = (S * 0.72) / GEM_H
    x = (S - GEM_W * scale) / 2 - GEM_X0 * scale
    y = (S - GEM_H * scale) / 2 - GEM_Y0 * scale

    # No rounded corners, no transparency: iOS masks and composites the icon
    # itself, and a transparent icon renders black on the home screen.
    gem(d, x, y, scale)
    icon = icon.resize((180, 180), Image.LANCZOS)
    out = ROOT / "src" / "app" / "apple-icon.png"
    icon.save(out, "PNG", optimize=True)
    print(f"· {out.relative_to(ROOT)}  180x180  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    build_social_card()
    build_apple_icon()
    if not _exact_fonts:
        print("\n! Rendered with system fonts — the card will not match the site's type.")
        print("  Re-run with a network connection before committing.")
        sys.exit(1)
    print("\nBoth files are committed to the repository — see the note at the top of this script.")
