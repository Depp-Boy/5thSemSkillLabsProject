#!/usr/bin/env bash
set -u

echo "Running automated deployment checks..."

REQUIRED_FILES=("index.html" "style.css" "Dockerfile")
FAILED=0

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "[PASS] Found required file: $file"
  else
    echo "[FAIL] Missing required file: $file"
    FAILED=1
  fi
done

if [ -f "index.html" ] && grep -q "Live Build:" index.html; then
  echo "[PASS] Verified 'Live Build:' banner string in index.html"
else
  echo "[FAIL] 'Live Build:' string not found in index.html"
  FAILED=1
fi

if [ "$FAILED" -ne 0 ]; then
  echo "Tests failed."
  exit 1
fi

echo "All tests passed!"
exit 0
