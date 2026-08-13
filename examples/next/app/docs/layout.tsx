import { source } from '@/lib/source';
import { DocsLayout } from '@watanuki/ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { DocsAI } from '@/components/docs-ai';
import { watanukiConfig } from '@/lib/watanuki.config';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const docs = (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );

  return watanukiConfig.ai?.enabled ? <DocsAI>{docs}</DocsAI> : docs;
}
