#!/bin/bash

# Script to clone a target repository and parse its JavaScript files using
# tree-sitter. It also clones a language grammar repository needed for
# tree-sitter to operate.

set -euo pipefail

REPO_URL=$1
LANGUAGE_GRAMMAR_REPO=$2

# Create a temporary workspace
WORK_DIR=$(mktemp -d)
cd "$WORK_DIR"

# Clone the repositories
git clone "$REPO_URL" target-repo

git clone "$LANGUAGE_GRAMMAR_REPO" grammar
cd grammar

# Generate the parser from the grammar
if command -v tree-sitter >/dev/null 2>&1; then
  tree-sitter generate
else
  echo "tree-sitter is not installed" >&2
  exit 1
fi
cd ../target-repo

# Parse each JavaScript file in the repository
find . -name '*.js' -print0 | while IFS= read -r -d '' file; do
  tree-sitter parse "$file"
done

