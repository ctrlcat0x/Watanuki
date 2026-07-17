# search-algolia-next

# Watanuki Docs

A documentation site powered by [Watanuki](https://watanuki.dev).

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/docs](http://localhost:3000/docs).

## Project layout

| Path | Purpose |
| --- | --- |
| `content/docs/` | MDX pages and `meta.json` navigation |
| `lib/source.ts` | Source loader for pages, search, and metadata |
| `lib/watanuki.config.ts` | Layout style, theme, TOC, and search settings |
| `source.config.ts` | MDX collections and frontmatter schema |

## Customize

- **Layout style** — edit `style` in `lib/watanuki.config.ts` (`classic`, `minimal`, `modern`)
- **Pages** — add `.mdx` files under `content/docs/`
- **Navigation** — update `content/docs/meta.json`
- **Search** — see [Search docs](https://watanuki.dev/docs/search)

## Build

```bash
pnpm build
pnpm start
```

Static search indexes are emitted at `/static.json` during build — no runtime search API is required.

## SEO

Set `NEXT_PUBLIC_SITE_URL` in `.env` (see `.env.example`). The sitemap is served at `/sitemap.xml`.


## Algolia search

Fill the Algolia env vars in `.env`, then open search — `DocsRootProvider` wires `search-algolia` from `lib/search.ts`.