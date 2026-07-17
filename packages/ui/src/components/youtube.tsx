import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface YouTubeProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** YouTube video ID */
  id?: string;
  /** Full YouTube URL — ID extracted automatically */
  src?: string;
  title?: string;
}

const ID_RE = /^[\w-]{11}$/;

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (ID_RE.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && ID_RE.test(id) ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = url.searchParams.get('v');
      if (v && ID_RE.test(v)) return v;

      const parts = url.pathname.split('/').filter(Boolean);
      if (
        (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') &&
        parts[1] &&
        ID_RE.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    /* not a URL */
  }

  return null;
}

export function YouTube({
  id,
  src,
  title = 'YouTube video',
  className,
  ...props
}: YouTubeProps) {
  const resolved = id ?? (src ? extractYouTubeId(src) : null);

  if (!resolved) {
    return null;
  }

  return (
    <div
      className={cn(
        'my-4 aspect-video w-full overflow-hidden rounded-xl border border-fd-border bg-fd-card',
        className,
      )}
      data-slot="youtube"
      {...props}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${resolved}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="block size-full border-0"
      />
    </div>
  );
}
