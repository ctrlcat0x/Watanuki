import { source } from '@/lib/source';
import { DocsLayout } from '@watanuki/ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { DocsAI } from '@/components/docs-ai';
import { watanukiConfig } from '@/lib/watanuki.config';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const docs = (
    <DocsLayout tree={source.getPageTree(lang)} {...baseOptions()} i18n>
      {children}
    </DocsLayout>
  );

  return watanukiConfig.ai?.enabled ? <DocsAI>{docs}</DocsAI> : docs;
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
