'use client';

import { PreviewCard } from '@base-ui/react/preview-card';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface GlimpseCardProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  image?: string;
  imageAlt?: string;
}

/** Preview body shown inside a hover / glimpse popover. */
export function GlimpseCard({
  title,
  description,
  image,
  imageAlt = '',
  className,
  children,
  ...props
}: GlimpseCardProps) {
  return (
    <div className={cn('flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-3', className)} {...props}>
      {image ? (
        <div className="overflow-hidden rounded-lg border border-fd-border/60 bg-fd-background shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote/public preview URLs */}
          <img src={image} alt={imageAlt} className="block aspect-video w-full object-cover" />
        </div>
      ) : null}
      {(title || description) && (
        <div className="min-w-0 px-0.5">
          {title ? (
            <div className="truncate text-sm font-semibold text-fd-popover-foreground">{title}</div>
          ) : null}
          {description ? (
            <div className="mt-0.5 line-clamp-2 text-sm text-fd-muted-foreground">{description}</div>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}

export interface HoverCardProps extends Omit<GlimpseCardProps, 'children'> {
  href: string;
  children: ReactNode;
  /** Delay before opening (ms). */
  delay?: number;
  /** Delay before closing (ms). */
  closeDelay?: number;
  /** Extra class on the trigger link. */
  triggerClassName?: string;
  /** Extra class on the popup. */
  popupClassName?: string;
}

/**
 * Underlined link that shows a glimpse preview card on hover.
 */
export function HoverCard({
  href,
  children,
  title,
  description,
  image,
  imageAlt,
  delay = 400,
  closeDelay = 200,
  triggerClassName,
  popupClassName,
  className,
  ...glimpseProps
}: HoverCardProps) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        href={href}
        delay={delay}
        closeDelay={closeDelay}
        className={cn(
          'underline decoration-fd-foreground/40 underline-offset-4 transition-colors hover:decoration-fd-foreground',
          triggerClassName,
          className,
        )}
      >
        {children}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner side="bottom" sideOffset={10} align="center" className="z-50">
          <PreviewCard.Popup
            className={cn(
              'origin-(--transform-origin) rounded-2xl border border-fd-border bg-fd-popover p-3 text-fd-popover-foreground shadow-xl outline-none data-[closed]:animate-fd-popover-out data-[open]:animate-fd-popover-in',
              popupClassName,
            )}
          >
            <GlimpseCard
              title={title}
              description={description}
              image={image}
              imageAlt={imageAlt}
              {...glimpseProps}
            />
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

/** Alias matching the “glimpse” naming from the design. */
export const Glimpse = HoverCard;
