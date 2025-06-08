#!/usr/bin/env bash
# Recursively search docs directory for AGENTS.md files and print their paths and contents.
# Hidden files and directories are ignored.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/docs"

if [ ! -d "$DOCS_DIR" ]; then
  echo "Docs directory '$DOCS_DIR' not found." >&2
  exit 1
fi

found=false
while IFS= read -r file; do
  found=true
  echo "===== ${file#$SCRIPT_DIR/} ====="
  cat "$file"
  echo
done < <(find "$DOCS_DIR" -type d -name '.*' -prune -o -type f -name 'AGENTS.md' -print)

if ! $found; then
  echo "No AGENTS.md files found under $DOCS_DIR"
fi
