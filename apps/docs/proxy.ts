import { NextRequest, NextResponse, type NextFetchEvent } from 'next/server';
import { isMarkdownPreferred, rewritePath } from '@watanuki/core/negotiation';
import { createI18nMiddleware } from '@watanuki/core/i18n/middleware';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

const handleI18n = createI18nMiddleware(i18n);

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

function stripLocale(pathname: string): string {
  for (const lang of i18n.languages) {
    if (pathname === `/${lang}`) return '/';
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname;
}

function isDocsPath(pathname: string): boolean {
  const path = stripLocale(pathname);
  return path === docsRoute || path.startsWith(`${docsRoute}/`);
}

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = stripLocale(pathname);

  const suffixHit = rewriteSuffix(pathWithoutLocale);
  if (suffixHit) {
    return NextResponse.rewrite(new URL(suffixHit, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const docsHit = rewriteDocs(pathWithoutLocale);
    if (docsHit) {
      return NextResponse.rewrite(new URL(docsHit, request.nextUrl));
    }
  }

  if (isDocsPath(pathname)) {
    return handleI18n(request, event);
  }

  return NextResponse.next();
}
