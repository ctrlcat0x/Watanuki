import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TimelineProps extends ComponentProps<'div'> {
  children?: ReactNode;
}

export function Timeline({ className, children, ...props }: TimelineProps) {
  return (
    <div
      role="list"
      className={cn('not-prose my-6 flex flex-col', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TimelineItemProps extends ComponentProps<'div'> {
  /** Display date on the left (e.g. `Dec 15, 2025`) */
  date: ReactNode;
  /** Optional version pill (e.g. `1.0.27`) */
  version?: ReactNode;
  children?: ReactNode;
}

export function TimelineItem({
  date,
  version,
  className,
  children,
  ...props
}: TimelineItemProps) {
  return (
    <div
      role="listitem"
      className={cn(
        'relative grid grid-cols-[minmax(5.5rem,7rem)_1.25rem_minmax(0,1fr)] gap-x-3 pb-10 last:pb-0',
        className,
      )}
      {...props}
    >
      <time className="pt-0.5 text-end text-sm text-fd-muted-foreground tabular-nums">
        {date}
      </time>

      <div className="relative flex justify-center" aria-hidden="true">
        <div className="absolute inset-y-0 w-px bg-fd-border" />
        <div className="relative z-1 mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-fd-primary bg-fd-background" />
      </div>

      <div className="min-w-0">
        {version != null && version !== false && (
          <span className="mb-2 inline-flex items-center rounded-full border border-fd-border bg-fd-secondary px-2.5 py-0.5 font-mono text-xs font-medium text-fd-secondary-foreground">
            {version}
          </span>
        )}
        <div
          className={cn(
            'prose prose-no-margin max-w-none text-fd-foreground',
            '[&_h3]:mt-0 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold',
            '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:ps-5',
            '[&_li]:my-1 [&_li]:text-sm [&_li]:text-fd-muted-foreground',
            '[&_code]:rounded-md [&_code]:border [&_code]:border-fd-border [&_code]:bg-fd-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:text-fd-foreground',
            version != null && version !== false && 'mt-2',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
