'use client';

import { SidebarIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { SidebarTrigger } from './sidebar';

export function SidebarFab() {
  return (
    <SidebarTrigger
      aria-label="Open sidebar"
      className={cn(
        buttonVariants({ color: 'secondary', size: 'icon-sm' }),
        'fixed top-4 inset-s-4 z-50 size-9 rounded-full shadow-md lg:hidden',
      )}
    >
      <SidebarIcon className="size-4" />
    </SidebarTrigger>
  );
}
