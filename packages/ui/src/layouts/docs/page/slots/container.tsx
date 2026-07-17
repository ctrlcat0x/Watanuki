'use client';

import type { ComponentProps } from 'react';
import { useWatanukiStyle } from '@watanuki/theme/react';
import { useDocsPage } from '..';
import { cn } from '@/utils/cn';

export function Container(props: ComponentProps<'article'>) {
  const { full } = useDocsPage();
  const isModern = useWatanukiStyle() === 'modern';

  return (
    <article
      id="nd-page"
      data-full={full}
      {...props}
      className={cn(
        'flex flex-col w-full max-w-[900px] mx-auto [grid-area:main] px-4 py-6 gap-4 lg:px-8 lg:pt-14 max-lg:pt-14',
        isModern && 'pb-16 lg:pb-20',
        full && 'max-w-[1168px]',
        props.className,
      )}
      style={isModern ? { paddingBottom: '5rem', ...props.style } : props.style}
    >
      {props.children}
    </article>
  );
}
