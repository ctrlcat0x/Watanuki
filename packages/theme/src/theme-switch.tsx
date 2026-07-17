'use client';

import { Popover as Primitive } from '@base-ui/react/popover';
import { Check, ChevronDown, Palette } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { cn } from 'cnfast';
import {
  THEME_ACCENTS,
  THEME_LABELS,
  WATANUKI_THEMES,
  isDarkTheme,
  type WatanukiTheme,
} from './config';

const STORAGE_KEY = 'watanuki-theme';

const triggerClassName =
  'inline-flex w-full items-center gap-1.5 rounded-md border bg-fd-secondary/50 p-1.5 text-start text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring';

const positionerClassName =
  'z-50 box-border w-(--anchor-width) min-w-(--anchor-width) max-w-(--anchor-width)';

const compactPositionerClassName = 'z-50 box-border w-56 min-w-56';

const popoverClassName =
  'z-50 box-border w-full min-w-0 origin-(--transform-origin) overflow-hidden rounded-xl border bg-fd-popover/60 backdrop-blur-lg p-0 text-sm text-fd-popover-foreground shadow-lg focus-visible:outline-none data-[closed]:animate-fd-popover-out data-[open]:animate-fd-popover-in';

export function applyWatanukiTheme(theme: WatanukiTheme) {
  const root = document.documentElement;
  root.setAttribute('data-watanuki-theme', theme);
  root.classList.toggle('dark', isDarkTheme(theme));
  localStorage.setItem(STORAGE_KEY, theme);
}

function ThemeAccentSwatch({
  theme,
  className,
}: {
  theme: WatanukiTheme;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-3.5 shrink-0 rounded-[3px] border border-black/15 dark:border-white/20',
        className,
      )}
      style={{ backgroundColor: THEME_ACCENTS[theme] }}
      title={THEME_ACCENTS[theme]}
    />
  );
}

function ThemePopoverContent({
  theme,
  onSelect,
  side = 'top',
  compact = false,
}: {
  theme: WatanukiTheme;
  onSelect: (theme: WatanukiTheme) => void;
  side?: 'top' | 'bottom';
  compact?: boolean;
}) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner
        align={compact ? 'end' : 'start'}
        side={side}
        sideOffset={4}
        className={compact ? compactPositionerClassName : positionerClassName}
        style={compact ? { width: '14rem', minWidth: '14rem' } : undefined}
      >
        <Primitive.Popup className={(s) => cn(popoverClassName, s.open && 'origin-bottom')}>
          <div className="flex flex-col">
            <div className="border-b bg-fd-popover/90 px-3 py-2 backdrop-blur-lg">
              <p className="text-xs font-medium text-fd-muted-foreground">Choose a theme</p>
            </div>
            {/* Inline maxHeight — theme package classes are not scanned by app Tailwind */}
            <div
              className="overscroll-contain p-2"
              style={{
                maxHeight: '13.5rem',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarGutter: 'stable',
              }}
            >
              <div className="flex flex-col gap-0.5">
                {WATANUKI_THEMES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 text-start text-sm rounded-lg transition-colors',
                      item === theme
                        ? 'bg-fd-primary/10 text-fd-primary'
                        : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
                    )}
                    onClick={() => onSelect(item)}
                  >
                    <ThemeAccentSwatch theme={item} />
                    <span className="flex-1">{THEME_LABELS[item]}</span>
                    {item === theme && <Check className="size-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Primitive.Popup>
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}

const compactTriggerClassName =
  'inline-flex size-9 min-w-9 shrink-0 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring';

export function WatanukiThemeSwitch({
  className,
  compact = false,
  style,
}: {
  className?: string;
  compact?: boolean;
  style?: CSSProperties;
}) {
  const [theme, setTheme] = useState<WatanukiTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as WatanukiTheme | null;
    const initial =
      saved && WATANUKI_THEMES.includes(saved as WatanukiTheme)
        ? (saved as WatanukiTheme)
        : 'dark';
    setTheme(initial);
    applyWatanukiTheme(initial);
    setMounted(true);
  }, []);

  const handleSelect = (next: WatanukiTheme) => {
    setTheme(next);
    applyWatanukiTheme(next);
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          compact ? 'size-9 min-w-9 shrink-0 rounded-md border bg-fd-secondary/50' : 'h-9 w-full rounded-md border bg-fd-secondary/50',
          className,
        )}
        style={compact ? { minWidth: '2.25rem', ...style } : style}
        data-theme-select=""
        aria-hidden
      />
    );
  }

  return (
    <Primitive.Root>
      <Primitive.Trigger
        data-theme-select=""
        aria-label="Choose a theme"
        style={compact ? { minWidth: '2.25rem', ...style } : style}
        className={(s) =>
          cn(
            compact ? compactTriggerClassName : triggerClassName,
            s.open && 'bg-fd-accent text-fd-accent-foreground',
            className,
          )
        }
      >
        <Palette className={compact ? 'size-4.5' : 'size-4.5 shrink-0'} />
        {!compact && (
          <>
            <span className="flex-1 truncate">{THEME_LABELS[theme]}</span>
            <ChevronDown className="ms-auto size-3.5 shrink-0" />
          </>
        )}
      </Primitive.Trigger>
      <ThemePopoverContent
        theme={theme}
        onSelect={handleSelect}
        side={compact ? 'bottom' : 'top'}
        compact={compact}
      />
    </Primitive.Root>
  );
}
