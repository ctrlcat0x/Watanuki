#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

build_pkg() {
  echo "→ $1"
  (cd "$ROOT/packages/$1" && npx tsdown)
}

build_pkg theme
build_pkg core
build_pkg tailwind
build_pkg mdx
build_pkg ui
(cd "$ROOT/packages/ui" && npx tailwindcss -i css/build.css -o ./dist/style.css)
build_pkg typescript
build_pkg api-docs
build_pkg openapi
(cd "$ROOT/packages/create-app" && npx tsdown)

echo "✓ Watanuki packages built"
