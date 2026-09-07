#!/usr/bin/env bash
# Regenerates public/gems/*.jpg (web masters) and src/data/placeholders.ts
# (blur-up data URIs) from the original photography.
#
#   ./scripts/generate-placeholders.sh "../Gem Lot Pics"
set -euo pipefail
SRC="${1:-../Gem Lot Pics}"
OUT="$(dirname "$0")/../public/gems"
TMP="$(mktemp -d)"
mkdir -p "$OUT"
for f in "$SRC"/*.jpg; do
  base="$(basename "$f" .jpg)"
  sips -Z 1600 -s format jpeg -s formatOptions 78 "$f" --out "$OUT/$base.jpg" >/dev/null
  sips -Z 16   -s format jpeg -s formatOptions 40 "$f" --out "$TMP/$base.jpg" >/dev/null
done
echo "Optimised masters written to $OUT"
echo "Blur sources in $TMP — regenerate placeholders.ts from these."
