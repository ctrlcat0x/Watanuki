# search-orama-tanstack

This is a TanStack Start application generated with [Create Watanuki](https://watanuki.dev).

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/docs](http://localhost:3000/docs).

## Layout

| Path | Purpose |
| --- | --- |
| `content/docs/` | MDX pages |
| `src/lib/source.ts` | Source loader |
| `src/lib/watanuki.config.ts` | Theme and search config |

Static search indexes are served from `/static.json` after build.

Set `NEXT_PUBLIC_SITE_URL` in `.env` (see `.env.example`) for absolute URLs in `/sitemap.xml`.


## Orama Cloud search

Fill the Orama Cloud env vars in `.env`, then open search — `DocsRootProvider` wires `search-orama` from `lib/search.ts`.