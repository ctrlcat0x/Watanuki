import { VerifiedIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export type TweetReplyProps = {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string;
  isVerified?: boolean;
  timestamp: string;
};

export type TweetCardProps = {
  authorName?: string;
  authorHandle?: string;
  authorImage?: string;
  content?: string[];
  isVerified?: boolean;
  timestamp?: string;
  href?: string;
  reply?: TweetReplyProps;
  className?: string;
} & Omit<ComponentProps<'a'>, 'href' | 'children' | 'content'>;

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="1227"
      viewBox="0 0 1200 1227"
      width="1200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Glass-style tweet / X post card. Framework-agnostic (`<a>`).
 */
export function TweetCard({
  authorName = 'Watanuki',
  authorHandle = 'watanuki_dev',
  authorImage = 'https://api.dicebear.com/9.x/shapes/svg?seed=watanuki&backgroundColor=0a0a0a',
  content = [
    'Ship docs that feel native — MDX, search, OG, and UI primitives in one stack.',
    '1. Drop content under content/docs',
    '2. Theme with watanuki.config.ts',
    '3. Deploy your docs app',
  ],
  isVerified = true,
  timestamp = 'Jul 17, 2026',
  href = 'https://x.com',
  reply = {
    authorName: 'docs-fan',
    authorHandle: 'docs_fan',
    authorImage: 'https://api.dicebear.com/9.x/thumbs/svg?seed=docsfan&backgroundColor=1e293b',
    content: 'The bouncy accordion alone sold me. Mermaid + TweetCard in MDX is chef’s kiss.',
    isVerified: false,
    timestamp: 'Jul 17',
  },
  className,
  ...props
}: TweetCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn('not-prose block w-full max-w-xl no-underline', className)}
      {...props}
    >
      <div
        className={cn(
          'relative isolate w-full overflow-hidden rounded-2xl p-1.5',
          'bg-fd-card/80 dark:bg-fd-card/90',
          'bg-linear-to-br from-fd-foreground/5 to-fd-foreground/[0.02]',
          'backdrop-blur-xl backdrop-saturate-[180%]',
          'border border-fd-border',
          'shadow-[0_8px_16px_rgb(0_0_0_/_0.12)]',
        )}
      >
        <div
          className={cn(
            'relative w-full rounded-xl p-5',
            'bg-linear-to-br from-fd-foreground/[0.04] to-transparent',
            'backdrop-blur-md backdrop-saturate-150',
            'border border-fd-border/60',
            'text-fd-foreground',
            'shadow-xs',
            'before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-br before:from-fd-foreground/[0.02] before:to-fd-foreground/[0.01] before:opacity-0 before:transition-opacity',
            'hover:before:opacity-100',
          )}
        >
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <img
                  alt={authorName}
                  className="h-full w-full object-cover"
                  src={authorImage}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-fd-foreground hover:underline">
                      {authorName}
                    </span>
                    {isVerified ? (
                      <VerifiedIcon className="h-4 w-4 text-blue-400" aria-label="Verified" />
                    ) : null}
                  </div>
                  <span className="text-sm text-fd-muted-foreground">@{authorHandle}</span>
                </div>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg p-1 text-fd-muted-foreground"
                  aria-hidden
                >
                  <XIcon className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2">
            {content.map((item, index) => (
              <p className="text-base text-fd-foreground" key={index}>
                {item}
              </p>
            ))}
            <span className="mt-2 block text-sm text-fd-muted-foreground">{timestamp}</span>
          </div>

          {reply ? (
            <div className="mt-4 border-t border-fd-border pt-4">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      alt={reply.authorName}
                      className="h-full w-full object-cover"
                      src={reply.authorImage}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-semibold text-fd-foreground hover:underline">
                      {reply.authorName}
                    </span>
                    {reply.isVerified ? (
                      <VerifiedIcon className="h-4 w-4 text-blue-400" aria-label="Verified" />
                    ) : null}
                    <span className="text-sm text-fd-muted-foreground">
                      @{reply.authorHandle}
                    </span>
                    <span className="text-sm text-fd-muted-foreground">·</span>
                    <span className="text-sm text-fd-muted-foreground">{reply.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-fd-foreground/90">{reply.content}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}
