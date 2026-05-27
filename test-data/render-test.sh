#!/usr/bin/env bash
set -euo pipefail

DATA_FILE="$(dirname "$0")/lifeng-resume.json"

if [ ! -f "$DATA_FILE" ]; then
  echo "Error: $DATA_FILE not found"
  exit 1
fi

case "${1:-html}" in
  html)
    out="/tmp/resume-preview.html"
    curl -s -X POST http://localhost:3001/api/render-test \
      -H "Content-Type: application/json" \
      -d "$(jq -n '{template: "resume", format: "html", data: inputs}' "$DATA_FILE")" \
      -o "$out"
    echo "Saved to $out"
    xdg-open "$out" 2>/dev/null || open "$out" 2>/dev/null || echo "Open $out in a browser"
    ;;
  pdf)
    curl -s -X POST http://localhost:3001/api/render-test \
      -H "Content-Type: application/json" \
      -d "$(jq -n '{template: "resume", format: "pdf", data: inputs}' "$DATA_FILE")"
    echo
    ;;
  *)
    echo "Usage: $0 [html|pdf]"
    exit 1
    ;;
esac
