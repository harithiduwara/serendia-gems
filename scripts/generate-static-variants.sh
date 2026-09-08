#!/usr/bin/env bash
# Pre-generates responsive image variants for the STATIC EXPORT build.
#
# Why this exists: GitHub Pages has no server, so next/image's on-demand
# optimiser cannot run. Without pre-generated variants the site would ship the
# full 1600px master (~500 KB) to a 360px phone. These files are committed so
# the CI build (Ubuntu, no sips) can simply copy them.
#
# Paired with src/lib/image-loader.ts, which maps a requested width to the
# nearest variant below.
#
#   ./scripts/generate-static-variants.sh
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)/public/gems"
OUT="$SRC/r"
# Width → JPEG quality. Larger tiers take lower quality: they are viewed at
# lower effective zoom, and the 1600px tier is omitted entirely because the
# existing master IS 1600px — the loader falls back to it for large requests.
WIDTHS=(96 256 480 768 1200)
QUALITY=(82 82 80 76 68)

mkdir -p "$OUT"
count=0
for f in "$SRC"/*.jpg; do
  [ -e "$f" ] || continue
  base="$(basename "$f" .jpg)"
  for i in "${!WIDTHS[@]}"; do
    w="${WIDTHS[$i]}"; q="${QUALITY[$i]}"
    sips -Z "$w" -s format jpeg -s formatOptions "$q" "$f" --out "$OUT/${base}-${w}.jpg" >/dev/null
    count=$((count + 1))
  done
done
echo "Generated $count variants in $OUT"
du -sh "$OUT"
