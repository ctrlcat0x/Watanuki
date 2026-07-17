# Watanuki

Opinionated documentation platform — Watanuki-shaped, simpler, style-first.

## Packages

| Package | Description |
|---------|-------------|
| `@watanuki/core` | Headless docs kernel (source, page tree, search, i18n) |
| `@watanuki/mdx` | MDX collections and content compiler |
| `@watanuki/ui` | Base UI + Motion docs UI |
| `@watanuki/theme` | One-variable style presets |
| `@watanuki/tailwind` | Tailwind utilities for UI |
| `@watanuki/typescript` | AutoTypeTable from TS types |
| `@watanuki/openapi` | OpenAPI docs generation |
| `@watanuki/api-docs` | Shared API docs UI components |
| `create-watanuki` | Project scaffolder |

## Development

```bash
pnpm install
pnpm build          # build all packages
pnpm types:check    # typecheck monorepo
pnpm lint           # lint packages
pnpm dev:docs       # run docs site
```

## Create a new project

```bash
pnpm create watanuki
```

See [PUBLISHING.md](./PUBLISHING.md) for npm publish order, auth, and end-user install details.
