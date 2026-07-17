import { source } from '@/lib/source';
import { DocsLayout } from '@watanuki/ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <DocsLayout tree={source.getPageTree(lang)} {...baseOptions()} i18n>
      {children}
    </DocsLayout>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
