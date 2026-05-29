#!/usr/bin/env bash
#
# Adds the copyright notice from the LICENSE file to the top of all .md files
# in the repository. Skips files that already contain the notice.
#

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

LICENSE_FILE="$REPO_ROOT/LICENSE"

if [[ ! -f "$LICENSE_FILE" ]]; then
  echo "ERROR: LICENSE file not found at $LICENSE_FILE" >&2
  exit 1
fi

# Extract the copyright line from the LICENSE file
COPYRIGHT_LINE=$(grep -m1 '^Copyright' "$LICENSE_FILE")

if [[ -z "$COPYRIGHT_LINE" ]]; then
  echo "ERROR: No copyright notice found in $LICENSE_FILE" >&2
  exit 1
fi

NOTICE="<!-- $COPYRIGHT_LINE -->"

echo "Copyright notice: $NOTICE"
echo ""

# Find all .md files in the repo (excluding .git directory)
while IFS= read -r -d '' md_file; do
  # Skip if file already contains the copyright notice
  if grep -qF "$COPYRIGHT_LINE" "$md_file"; then
    echo "SKIP (already present): $md_file"
    continue
  fi

  # Prepend the notice to the file
  tmpfile=$(mktemp)
  {
    echo "$NOTICE"
    echo ""
    cat "$md_file"
  } > "$tmpfile"
  mv "$tmpfile" "$md_file"

  echo "ADDED: $md_file"
done < <(find "$REPO_ROOT" -path "$REPO_ROOT/.git" -prune -o -name '*.md' -type f -print0)

echo ""
echo "Done."
