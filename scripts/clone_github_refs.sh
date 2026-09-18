#!/bin/bash
# Shallow-clone the most relevant GitHub reference repos for pattern study
set -u
DEST=/home/z/my-project/research/github-refs
mkdir -p "$DEST"
cd "$DEST"

clone() {
  local name=$1; local url=$2; local branch=${3:-main}
  if [ -d "$name" ]; then echo "[skip] $name (exists)"; return; fi
  echo "[clone] $name ..."
  timeout 90 git clone --depth 1 --single-branch --branch "$branch" "$url" "$name" 2>&1 | tail -1
}

# Group A — components / motion / design systems
clone react-bits   https://github.com/DavidHDev/react-bits.git main
clone magicui      https://github.com/magicuidesign/magicui.git main
clone motion-primitives https://github.com/ibelick/motion-primitives.git main

# Group B — full-page composition
clone space-portfolio https://github.com/sanidhyy/space-portfolio.git main
clone play-nextjs   https://github.com/NextJSTemplates/play-nextjs.git main
clone portfolio-2025 https://github.com/davidhckh/portfolio-2025.git main

echo "=== RESULTS ==="
du -sh "$DEST"/* 2>/dev/null | sort -k2
