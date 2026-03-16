#!/bin/bash
set -e
cd ~/Desktop/portfolio-3d
git add index.html
git commit -m "deploy: update game portfolio" || echo "nothing to commit"
git push origin main

# Copy to gh-pages
TMPFILE=$(mktemp)
cp index.html "$TMPFILE"
git checkout gh-pages 2>/dev/null || git checkout --orphan gh-pages
git rm -rf . --quiet 2>/dev/null || true
cp "$TMPFILE" index.html
git add index.html
git commit -m "deploy: game portfolio $(date '+%Y-%m-%d %H:%M')"
git push origin gh-pages --force
git checkout main
echo "Deployed to https://sriram006sjm.github.io/portfolio-3d/"
