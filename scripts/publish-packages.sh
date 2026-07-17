#!/usr/bin/env bash
set -euo pipefail

readonly registry="${NPM_CONFIG_REGISTRY:-https://registry.npmjs.org}"
readonly dry_run="${PUBLISH_DRY_RUN:-0}"
readonly trusted_publishing="${NPM_TRUSTED_PUBLISHING:-0}"
publish_directory=""

cleanup() {
  if [[ -n "${publish_directory}" && -d "${publish_directory}" ]]; then
    rm -rf -- "${publish_directory}"
  fi
}

trap cleanup EXIT

publish_package() {
  local directory="$1"
  local package_json="packages/${directory}/package.json"
  local package_name
  local version

  package_name="$(node -p "require('./${package_json}').name")"
  version="$(node -p "require('./${package_json}').version")"

  if npm view "${package_name}@${version}" version --registry="${registry}" >/dev/null 2>&1; then
    echo "✓ ${package_name}@${version} already published"
    return
  fi

  echo "→ ${package_name}@${version}"
  if [[ "${dry_run}" == "1" ]]; then
    pnpm --filter "${package_name}" publish --access public --no-git-checks --dry-run
    return
  fi

  if [[ "${trusted_publishing}" != "1" ]]; then
    pnpm --filter "${package_name}" publish --access public --no-git-checks
    return
  fi

  if [[ -z "${publish_directory}" ]]; then
    publish_directory="$(mktemp -d "${TMPDIR:-/tmp}/watanuki-publish.XXXXXX")"
  fi

  local archive_name="${package_name#@}"
  archive_name="${archive_name//\//-}-${version}.tgz"

  pnpm --filter "${package_name}" pack --pack-destination "${publish_directory}"
  npm publish "${publish_directory}/${archive_name}" --access public
}

pnpm build
pnpm --filter create-watanuki build

# Keep dependency order so newly published workspace packages resolve on npm.
publish_package theme
publish_package tailwind
publish_package core
publish_package mdx
publish_package ui
publish_package typescript
publish_package api-docs
publish_package openapi
publish_package create-app
