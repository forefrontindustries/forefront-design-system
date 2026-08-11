#!/usr/bin/env bash
# Strips the injected analytics badge script from the built output before deploy.
# The badge is injected into index.html at build time and is not wanted on a
# public work sample, so both the script file and the tag that loads it go.
set -euo pipefail
DIST="$(cd "$(dirname "$0")/.." && pwd)/packages/web/dist"
rm -f "$DIST/runable.js"
if [ -f "$DIST/index.html" ]; then
  # Remove any script tag pointing at the injected file, however it is formatted.
  perl -0pi -e 's{<script[^>]*runable\.js[^>]*>\s*</script>}{}gis' "$DIST/index.html"
  perl -0pi -e 's{<script[^>]*runable\.js[^>]*/?>}{}gis' "$DIST/index.html"
fi
echo "prepare: badge stripped"
grep -c runable "$DIST/index.html" 2>/dev/null && echo "WARNING: 'runable' still present in index.html" || echo "prepare: index.html clean"
