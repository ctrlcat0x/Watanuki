# Publishing Watanuki to npm

## Packages (publish order)

Publish from the monorepo root after `pnpm build`. Order matters for peer/workspace resolution:

1. `@watanuki/theme`
2. `@watanuki/tailwind`
3. `@watanuki/core`
4. `@watanuki/mdx`
5. `@watanuki/ui`
6. `@watanuki/typescript` (optional AutoTypeTable)
7. `@fumari/stf`
8. `@watanuki/api-docs`
9. `@watanuki/openapi`
10. `create-watanuki` (last — pins versions from workspace packages)

| Package | npm name | Notes |
|---------|----------|--------|
| theme | `@watanuki/theme` | Styles + presets |
| core | `@watanuki/core` | Kernel |
| mdx | `@watanuki/mdx` | Content compiler + `watanuki-mdx` bin |
| ui | `@watanuki/ui` | Docs UI |
| typescript | `@watanuki/typescript` | AutoTypeTable |
| openapi | `@watanuki/openapi` | OpenAPI pages |
| api-docs | `@watanuki/api-docs` | Schema UI |
| create-app | `create-watanuki` | CLI scaffolder |

All publishable packages set `"publishConfig": { "access": "public" }`.

## Auth / org

1. Create (or get access to) the `@watanuki` and `@fumari` npm orgs: https://www.npmjs.com/org/create
2. Log in: `npm login` (or `npm login --auth-type=web`)
3. Confirm: `npm whoami` and that you can publish under `@watanuki` and `@fumari`
4. Create an npm automation token, then add it to GitHub repository Actions secrets as `NPM_TOKEN`.

## Versioning

This repo does **not** currently ship Changesets. Bump versions manually (or add Changesets later):

```bash
# example: bump ui
pnpm --filter @watanuki/ui exec npm version patch --no-git-tag-version
```

Keep `create-watanuki` and `create-watanuki-versions` aligned — `create-app` copies live versions from `packages/*/package.json` into scaffold `package.json` at generate time.

Before publishing `create-watanuki`, run its build (syncs templates from `examples/`):

```bash
pnpm --filter create-watanuki build
```

## Build + publish

```bash
pnpm install
pnpm build
pnpm types:check   # recommended

# build, publish unpublished package versions in dependency order
pnpm publish:packages

# build + pack only; does not publish
PUBLISH_DRY_RUN=1 pnpm publish:packages
```

## GitHub Actions

The `Publish packages` workflow runs when a `v*` tag is pushed. It skips package versions already on npm, so a release tag can safely be retried.

```bash
git tag v16.10.8
git push origin v16.10.8
```

Before pushing a tag, bump every changed package and set GitHub repository secret `NPM_TOKEN` to an npm automation token with access to `@watanuki` and `@fumari`.

## End-user install

### Scaffold a new docs site

```bash
pnpm create watanuki
# or
npm create watanuki@latest
# or
npx create-watanuki@latest
```

Non-interactive (CI):

```bash
CI=true pnpm create watanuki my-docs --template next --search local --style classic --pm pnpm --install --no-git
```

Then:

```bash
cd my-docs
pnpm install   # if you skipped --install
pnpm dev       # docs at /docs
```

### Add packages to an existing app

```bash
pnpm add @watanuki/core @watanuki/mdx @watanuki/ui @watanuki/theme
# optional
pnpm add @watanuki/typescript @watanuki/openapi
```

Enable KaTeX math (opt-in):

```ts
// source.config.ts
export default defineConfig({
  mdxOptions: {
    remarkMathOptions: {},
    rehypeKatexOptions: {},
  },
});
```

```css
/* global.css */
@import 'katex/dist/katex.min.css';
```

AutoTypeTable:

```tsx
import { createGenerator } from '@watanuki/typescript';
import { AutoTypeTable } from '@watanuki/typescript/ui';

const generator = createGenerator();
// in MDX components: <AutoTypeTable generator={generator} path="…" name="…" />
```
