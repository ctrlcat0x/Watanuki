'use client';

import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import Zoom from 'react-medium-image-zoom';
import { cn } from '@/utils/cn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import './image-zoom.css';

export type MediaKind = 'image' | 'video' | 'audio' | 'gif';

const IMAGE_EXT = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'avif',
  'svg',
  'bmp',
  'ico',
]);
const VIDEO_EXT = new Set(['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v']);
const AUDIO_EXT = new Set(['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus']);

function extensionOf(src: string): string {
  try {
    const path = src.split('?')[0]?.split('#')[0] ?? src;
    const base = path.split('/').pop() ?? path;
    const dot = base.lastIndexOf('.');
    return dot >= 0 ? base.slice(dot + 1).toLowerCase() : '';
  } catch {
    return '';
  }
}

export function detectMediaKind(src: string, type?: MediaKind): MediaKind {
  if (type) return type;
  const ext = extensionOf(src);
  if (ext === 'gif') return 'gif';
  if (VIDEO_EXT.has(ext)) return 'video';
  if (AUDIO_EXT.has(ext)) return 'audio';
  if (IMAGE_EXT.has(ext) || !ext) return 'image';
  return 'image';
}

export interface MediaProps extends Omit<ComponentProps<'div'>, 'children'> {
  src: string;
  /** Override auto-detection from file extension */
  type?: MediaKind;
  alt?: string;
  poster?: string;
  /** Show speed / volume controls on video */
  showExtraControls?: boolean;
}

export function Media({
  src,
  type,
  alt = '',
  poster,
  showExtraControls = true,
  className,
  ...props
}: MediaProps) {
  const kind = detectMediaKind(src, type);

  if (kind === 'audio') {
    return <AudioPlayer src={src} className={className} {...props} />;
  }
  if (kind === 'video') {
    return (
      <VideoPlayer
        src={src}
        poster={poster}
        showExtraControls={showExtraControls}
        className={className}
        {...props}
      />
    );
  }

  return <ImageMedia src={src} alt={alt} className={className} {...props} />;
}

// ---------------------------------------------------------------------------
// Image / GIF — react-medium-image-zoom
// ---------------------------------------------------------------------------

function ImageMedia({
  src,
  alt,
  className,
  ...props
}: { src: string; alt?: string } & ComponentProps<'div'>) {
  return (
    <div
      className={cn('my-4 overflow-hidden rounded-xl', className)}
      data-slot="media-image"
      {...props}
    >
      <Zoom zoomMargin={20} wrapElement="span" classDialog="rmiz-dialog">
        <img
          src={src}
          alt={alt}
          className="block h-auto w-full rounded-xl"
          draggable={false}
        />
      </Zoom>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

function ControlMenu({
  label,
  value,
  children,
  className,
}: {
  label: string;
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
          className,
        )}
        aria-label={label}
      >
        {value}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="min-w-[7rem] p-1">
        {children}
      </PopoverContent>
    </Popover>
  );
}

function MenuItem({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors',
        active
          ? 'bg-fd-accent text-fd-accent-foreground'
          : 'text-fd-popover-foreground hover:bg-fd-accent/60',
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------

const FAKE_BARS = 48;

function buildFakeBars(count: number): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const wave =
      0.35 +
      0.35 * Math.sin(t * Math.PI * 4) +
      0.2 * Math.sin(t * Math.PI * 11 + 1.2) +
      0.15 * Math.abs(Math.sin(t * Math.PI * 7));
    bars.push(Math.min(1, Math.max(0.12, wave)));
  }
  return bars;
}

function AudioPlayer({
  src,
  className,
  ...props
}: { src: string } & ComponentProps<'div'>) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [bars, setBars] = useState<number[]>(() => buildFakeBars(FAKE_BARS));
  const scrubbing = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();

    async function analyse() {
      try {
        const res = await fetch(src, { signal: ctrl.signal, mode: 'cors' });
        if (!res.ok) throw new Error('fetch failed');
        const buf = await res.arrayBuffer();
        const ctx = new AudioContext();
        const decoded = await ctx.decodeAudioData(buf.slice(0));
        const channel = decoded.getChannelData(0);
        const block = Math.floor(channel.length / FAKE_BARS) || 1;
        const next: number[] = [];
        for (let i = 0; i < FAKE_BARS; i++) {
          let sum = 0;
          const start = i * block;
          const end = Math.min(start + block, channel.length);
          for (let j = start; j < end; j++) sum += Math.abs(channel[j]!);
          next.push(sum / (end - start || 1));
        }
        const max = Math.max(...next, 0.0001);
        if (!cancelled) setBars(next.map((v) => Math.max(0.08, v / max)));
        void ctx.close();
      } catch {
        /* CORS / decode — keep fake bars */
      }
    }

    void analyse();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const seekFromClientX = (clientX: number, target: HTMLElement) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = target.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    el.currentTime = pct * duration;
    setProgress(el.currentTime);
  };

  return (
    <div
      className={cn(
        'my-4 flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-3 py-2.5 text-fd-card-foreground',
        className,
      )}
      data-slot="media-audio"
      {...props}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (!scrubbing.current) setProgress(e.currentTarget.currentTime);
        }}
      />

      <button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        onClick={toggle}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-fd-primary text-fd-primary-foreground transition-opacity hover:opacity-90"
      >
        {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
      </button>

      <div
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration)}
        aria-valuenow={Math.floor(progress)}
        tabIndex={0}
        className="relative flex h-10 min-w-0 flex-1 cursor-pointer items-end gap-px px-0.5"
        onPointerDown={(e) => {
          scrubbing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          seekFromClientX(e.clientX, e.currentTarget);
        }}
        onPointerMove={(e) => {
          if (!scrubbing.current) return;
          seekFromClientX(e.clientX, e.currentTarget);
        }}
        onPointerUp={(e) => {
          scrubbing.current = false;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            /* */
          }
        }}
        onKeyDown={(e) => {
          const el = audioRef.current;
          if (!el) return;
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            el.currentTime = Math.max(0, el.currentTime - 5);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            el.currentTime = Math.min(duration, el.currentTime + 5);
          }
        }}
      >
        {bars.map((h, i) => {
          const filled = duration > 0 && i / bars.length <= progress / duration;
          return (
            <span
              key={i}
              className={cn(
                'min-w-[2px] flex-1 rounded-full transition-colors',
                filled ? 'bg-fd-primary' : 'bg-fd-muted-foreground/30',
              )}
              style={{ height: `${Math.round(h * 100)}%` }}
            />
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <ControlMenu label="Playback speed" value={`${speed}×`}>
          {SPEEDS.map((s) => (
            <MenuItem key={s} active={speed === s} onClick={() => setSpeed(s)}>
              {s}×
            </MenuItem>
          ))}
        </ControlMenu>

        <Popover>
          <PopoverTrigger
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            aria-label="Volume"
          >
            {muted || volume === 0 ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={6} className="min-w-[9rem] p-3">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="text-left text-xs text-fd-muted-foreground hover:text-fd-foreground"
                onClick={() => setMuted((m) => !m)}
              >
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                aria-label="Volume level"
                className="w-full accent-fd-primary"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  setMuted(v === 0);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

function VideoPlayer({
  src,
  poster,
  showExtraControls = true,
  className,
  ...props
}: {
  src: string;
  poster?: string;
  showExtraControls?: boolean;
} & ComponentProps<'div'>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrubbing = useRef(false);
  const progressId = useId();

  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!scrubbing.current && videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 2500);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
    bumpControls();
  };

  const seekFromClientX = (clientX: number, target: HTMLElement) => {
    const el = videoRef.current;
    if (!el || !duration) return;
    const rect = target.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    el.currentTime = pct * duration;
    setProgress(el.currentTime);
  };

  const toggleFullscreen = async () => {
    const root = rootRef.current;
    if (!root) return;
    if (!document.fullscreenElement) await root.requestFullscreen();
    else await document.exitFullscreen();
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        'group relative my-4 overflow-hidden rounded-xl border border-fd-border bg-fd-card',
        className,
      )}
      data-slot="media-video"
      onMouseMove={bumpControls}
      onMouseLeave={() => {
        if (playing) setShowControls(false);
      }}
      {...props}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="block aspect-video w-full cursor-pointer bg-black object-contain"
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          bumpControls();
        }}
        onPause={() => {
          setPlaying(false);
          setShowControls(true);
        }}
        onEnded={() => {
          setPlaying(false);
          setShowControls(true);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (!scrubbing.current) setProgress(e.currentTarget.currentTime);
        }}
      />

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent pt-16 pb-3 transition-opacity duration-200',
          showControls || !playing ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="pointer-events-auto flex flex-col gap-2 px-3">
          <div
            id={progressId}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(progress)}
            tabIndex={0}
            className="group/scrub relative h-1.5 cursor-pointer rounded-full bg-white/25"
            onPointerDown={(e) => {
              scrubbing.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              seekFromClientX(e.clientX, e.currentTarget);
              bumpControls();
            }}
            onPointerMove={(e) => {
              if (!scrubbing.current) return;
              seekFromClientX(e.clientX, e.currentTarget);
            }}
            onPointerUp={(e) => {
              scrubbing.current = false;
              try {
                e.currentTarget.releasePointerCapture(e.pointerId);
              } catch {
                /* */
              }
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
            />
            <div
              className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow opacity-0 transition-opacity group-hover/scrub:opacity-100 group-focus-within/scrub:opacity-100"
              style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center gap-1 text-white">
            <button
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={toggle}
              className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-white/15"
            >
              {playing ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
            </button>

            <span className="ms-1 font-mono text-xs tabular-nums text-white/90">
              {formatTime(progress)} / {formatTime(duration)}
            </span>

            <div className="ms-auto flex items-center gap-0.5">
              {showExtraControls ? (
                <>
                  <ControlMenu
                    label="Playback speed"
                    value={`${speed}×`}
                    className="text-white/90 hover:bg-white/15 hover:text-white"
                  >
                    {SPEEDS.map((s) => (
                      <MenuItem key={s} active={speed === s} onClick={() => setSpeed(s)}>
                        {s}×
                      </MenuItem>
                    ))}
                  </ControlMenu>

                  <Popover>
                    <PopoverTrigger
                      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-white/90 hover:bg-white/15"
                      aria-label="Volume"
                    >
                      {muted || volume === 0 ? (
                        <VolumeX className="size-4" />
                      ) : (
                        <Volume2 className="size-4" />
                      )}
                    </PopoverTrigger>
                    <PopoverContent align="end" sideOffset={6} className="min-w-[9rem] p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className="text-left text-xs text-fd-muted-foreground hover:text-fd-foreground"
                          onClick={() => setMuted((m) => !m)}
                        >
                          {muted ? 'Unmute' : 'Mute'}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={muted ? 0 : volume}
                          aria-label="Volume level"
                          className="w-full accent-fd-primary"
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setVolume(v);
                            setMuted(v === 0);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              ) : null}

              <button
                type="button"
                aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                onClick={() => void toggleFullscreen()}
                className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-white/15"
              >
                {fullscreen ? (
                  <Minimize className="size-4" />
                ) : (
                  <Maximize className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
