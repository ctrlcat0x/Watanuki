'use client';

import type { ComponentProps } from 'react';
import { useDocsLayout } from '../client';
import { cn } from '@/utils/cn';
import { Languages, SidebarIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useWatanukiStyle } from '@watanuki/theme/react';
import { SidebarCollapseTrigger } from './sidebar';

export function Header(props: ComponentProps<'header'>) {
  const {
    isNavTransparent,
    slots,
    props: { nav },
  } = useDocsLayout();
  const style = useWatanukiStyle();
  const isModern = style === 'modern';
  const { collapsed } = slots.sidebar?.useSidebar?.() ?? {};

  if (nav?.component) return nav.component;

  if (isModern) {
    return (
      <header
        id="nd-subnav"
        data-transparent={isNavTransparent}
        {...props}
        className={cn(
          '[grid-area:header] sticky top-(--fd-docs-row-1) z-30 grid w-full min-w-0 grid-cols-[1fr_minmax(0,28rem)_1fr] items-center gap-2 border-b px-4 backdrop-blur-sm transition-colors h-(--fd-header-height) max-lg:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-muted/80 lg:bg-fd-muted',
          props.className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          {collapsed && (
            <>
              <SidebarCollapseTrigger
                className={cn(
                  buttonVariants({
                    color: 'ghost',
                    size: 'icon-sm',
                    className: 'hidden text-fd-muted-foreground lg:inline-flex',
                  }),
                )}
              >
                <SidebarIcon />
              </SidebarCollapseTrigger>
              {slots.navTitle && (
                <slots.navTitle className="hidden items-center gap-2.5 font-semibold lg:inline-flex" />
              )}
            </>
          )}
          {!collapsed && slots.navTitle && (
            <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold lg:hidden" />
          )}
        </div>
        {slots.searchTrigger && (
          <slots.searchTrigger.full
            hideIfDisabled
            className="my-auto hidden w-full min-w-0 max-w-md justify-self-center lg:flex"
          />
        )}
        <div className="flex items-center justify-end gap-1 justify-self-end">
          <div className="hidden items-center gap-1 lg:flex">
            {slots.languageSelect && (
              <slots.languageSelect.root
                className={cn(
                  buttonVariants({ size: 'icon-sm', color: 'ghost' }),
                  'size-9 min-w-9 shrink-0 text-fd-muted-foreground',
                )}
                style={{ minWidth: '2.25rem' }}
              >
                <Languages className="size-4.5" />
              </slots.languageSelect.root>
            )}
            {slots.themeSwitch && (
              <slots.themeSwitch
                compact
                className="size-9 min-w-9 shrink-0"
                style={{ minWidth: '2.25rem' }}
              />
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent}
      {...props}
      className={cn(
        '[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) lg:hidden max-lg:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80',
        props.className,
      )}
    >
      {slots.navTitle && (
        <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold" />
      )}
      <div className="flex-1">{nav?.children}</div>
      {slots.searchTrigger && <slots.searchTrigger.sm hideIfDisabled className="p-2" />}
      {slots.sidebar && (
        <slots.sidebar.trigger
          className={cn(
            buttonVariants({
              color: 'ghost',
              size: 'icon-sm',
              className: 'p-2',
            }),
          )}
        >
          <SidebarIcon />
        </slots.sidebar.trigger>
      )}
    </header>
  );
}
