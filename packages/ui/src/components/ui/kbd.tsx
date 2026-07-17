import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border bg-fd-background px-1 font-mono text-[0.625rem] font-medium text-fd-muted-foreground [&_svg]:size-2.5',
        className,
      )}
      {...props}
    />
  );
}

export function KbdGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('inline-flex items-center gap-0.5', className)} {...props} />;
}
