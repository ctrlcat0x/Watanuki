import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type CalloutType =
  | 'note'
  | 'tip'
  | 'info'
  | 'warn'
  | 'warning'
  | 'danger'
  | 'error'
  | 'success'
  | 'question'
  | 'idea';

const typeConfig = {
  note: {
    color: 'var(--color-fd-note, var(--color-fd-muted-foreground))',
  },
  tip: {
    color: 'var(--color-fd-tip, var(--color-fd-idea))',
  },
  info: {
    color: 'var(--color-fd-info)',
  },
  warning: {
    color: 'var(--color-fd-warning)',
  },
  error: {
    color: 'var(--color-fd-error)',
  },
  success: {
    color: 'var(--color-fd-success)',
  },
  question: {
    color: 'var(--color-fd-question, var(--color-fd-info))',
  },
  idea: {
    color: 'var(--color-fd-idea)',
  },
} as const;

export function Callout({
  children,
  title,
  ...props
}: { title?: ReactNode } & Omit<CalloutContainerProps, 'title'>) {
  return (
    <CalloutContainer {...props}>
      {title && <CalloutTitle>{title}</CalloutTitle>}
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

export interface CalloutContainerProps extends ComponentProps<'div'> {
  /**
   * @defaultValue info
   */
  type?: CalloutType;

  /**
   * Optional leading content (icons removed by default).
   */
  icon?: ReactNode;
}

function resolveAlias(type: CalloutType): keyof typeof typeConfig {
  if (type === 'warn') return 'warning';
  if (type === 'danger') return 'error';
  return type;
}

export function CalloutContainer({
  type: inputType = 'info',
  icon,
  children,
  className,
  style,
  ...props
}: CalloutContainerProps) {
  const type = resolveAlias(inputType);
  const config = typeConfig[type];

  return (
    <div
      className={cn(
        'my-4 flex gap-3 rounded-xl p-3 ps-1 text-sm text-fd-foreground',
        className,
      )}
      style={
        {
          '--callout-color': config.color,
          backgroundColor: 'color-mix(in oklab, var(--callout-color) 10%, transparent)',
          ...style,
        } as object
      }
      {...props}
    >
      <div role="none" className="w-0.5 shrink-0 rounded-sm bg-(--callout-color)" />
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">{children}</div>
    </div>
  );
}

export function CalloutTitle({ children, className, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('my-0! font-semibold', className)} {...props}>
      {children}
    </p>
  );
}

export function CalloutDescription({ children, className, ...props }: ComponentProps<'p'>) {
  return (
    <div
      className={cn('prose-no-margin text-fd-muted-foreground empty:hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}
