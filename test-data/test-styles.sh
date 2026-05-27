#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "═══ pdfgen — style test runner ═══"
echo ""

# Check that Playwright browsers are installed
if ! npx playwright install --dry-run 2>/dev/null | grep -q "already installed"; then
  echo "Playwright browsers not found. Run: npm run playwright:install"
  echo ""
fi

echo "Generating PDFs for all 6 resume styles..."
npx tsx test-data/test-styles.ts
