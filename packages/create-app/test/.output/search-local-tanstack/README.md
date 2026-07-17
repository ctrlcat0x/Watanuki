# search-local-tanstack

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


## Local search

Search indexes are pre-rendered to `/static.json` at build time. The client runs fuzzy search in the browser — no `/api/search` route required.