'use client';

import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from '@shadcn/react/message-scroller';
import { ArrowDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export function MessageScroller({
  className,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Provider autoScroll defaultScrollPosition="end">
      <MessageScrollerPrimitive.Root className={cn('relative min-h-0', className)} {...props} />
    </MessageScrollerPrimitive.Provider>
  );
}

export function MessageScrollerViewport({
  className,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      className={cn('size-full overflow-y-auto overscroll-contain', className)}
      {...props}
    />
  );
}

export function MessageScrollerContent({
  className,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return <MessageScrollerPrimitive.Content className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function MessageScrollerItem({
  className,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return <MessageScrollerPrimitive.Item className={cn('min-w-0', className)} {...props} />;
}

export function MessageScrollerButton({
  className,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Button>) {
  return (
    <MessageScrollerPrimitive.Button
      aria-label="Scroll to latest message"
      className={cn(
        buttonVariants({ color: 'secondary', size: 'icon-sm' }),
        'absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full shadow-sm data-[active=false]:hidden',
        className,
      )}
      {...props}
    >
      <ArrowDown aria-hidden="true" />
    </MessageScrollerPrimitive.Button>
  );
}

export { useMessageScroller, useMessageScrollerScrollable, useMessageScrollerVisibility };
