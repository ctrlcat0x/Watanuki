'use client';

import { DocsAIProvider } from '@watanuki/ui/components/docs-ai';
import type { ReactNode } from 'react';

export function DocsAI({ children }: { children: ReactNode }) {
  return <DocsAIProvider>{children}</DocsAIProvider>;
}
