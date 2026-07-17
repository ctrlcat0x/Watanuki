'use client';

import type { ComponentType, ReactNode } from 'react';
import { RootProvider } from '@watanuki/ui/provider/next';
import type { DefaultSearchDialogProps } from '@watanuki/ui/components/dialog/search-default';
import { WatanukiStyleProvider } from '@watanuki/theme/react';
import { watanukiConfig } from '@/lib/watanuki.config';
import { resolveSearchDialog, resolveSearchOptions } from '@/lib/search';

export function DocsRootProvider({ children }: { children: ReactNode }) {
  return (
    <WatanukiStyleProvider style={watanukiConfig.style}>
      <RootProvider
        theme={{ enabled: false }}
        search={{
          SearchDialog: resolveSearchDialog(
            watanukiConfig.search,
          ) as ComponentType<DefaultSearchDialogProps>,
          options: resolveSearchOptions(watanukiConfig.search),
        }}
      >
        {children}
      </RootProvider>
    </WatanukiStyleProvider>
  );
}
