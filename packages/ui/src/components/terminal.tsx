'use client';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/utils/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TerminalLine {
  text: string;
  /** Tailwind / utility class for line color */
  color?: string;
  delay?: number;
}

export interface TerminalTabContent {
  label: string;
  command: string;
  lines: TerminalLine[];
}

export interface TerminalProps extends ComponentProps<'div'> {
  /** Tab content; defaults to `defaultTerminalTabs` */
  tabs?: TerminalTabContent[];
  /** Uncontrolled initial tab index */
  defaultActiveTab?: number;
  /** Controlled tab index */
  activeTab?: number;
  onActiveTabChange?: (index: number) => void;
  /** Optional background image URL */
  backgroundImage?: string;
  /** Force dark tokens on the terminal chrome */
  alwaysDark?: boolean;
  /** Hide cursor after output finishes */
  hideCursorOnComplete?: boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface TerminalContextValue {
  activeTab: number;
  setActiveTab: (index: number) => void;
  commandTyped: string;
  isTypingCommand: boolean;
  showCursor: boolean;
  visibleLines: number;
  currentTab: TerminalTabContent;
  tabs: TerminalTabContent[];
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

function useTerminalContext() {
  const ctx = use(TerminalContext);
  if (!ctx) throw new Error('Terminal components must be used within <Terminal>');
  return ctx;
}

export function useTerminal() {
  return useTerminalContext();
}

// ---------------------------------------------------------------------------
// Default / demo tabs
// ---------------------------------------------------------------------------

export const defaultTerminalTabs: TerminalTabContent[] = [
  {
    label: 'install',
    command: 'pnpm add @watanuki/ui',
    lines: [
      { text: '', delay: 80 },
      { text: 'Packages: +12', color: 'text-[var(--terminal-success)]', delay: 350 },
      { text: 'Progress: resolved 12, reused 12, downloaded 0', color: 'text-fd-muted-foreground', delay: 150 },
      { text: '', delay: 60 },
      { text: 'Done in 1.2s', color: 'text-fd-muted-foreground', delay: 200 },
    ],
  },
  {
    label: 'build',
    command: 'npm run build',
    lines: [
      { text: '', delay: 80 },
      { text: '  ▲ Next.js 16.1.6', color: 'text-fd-foreground/80', delay: 300 },
      { text: '', delay: 60 },
      {
        text: '  Creating an optimized production build...',
        color: 'text-fd-muted-foreground',
        delay: 250,
      },
      { text: '  ✓ Compiled successfully', color: 'text-[var(--terminal-success)]', delay: 200 },
      {
        text: '  ✓ Linting and checking validity of types',
        color: 'text-[var(--terminal-success)]',
        delay: 150,
      },
      {
        text: '  ✓ Generating static pages (12/12)',
        color: 'text-[var(--terminal-success)]',
        delay: 150,
      },
      {
        text: '  Route (app)  /  142 kB  |  First Load JS 198 kB',
        color: 'text-fd-muted-foreground',
        delay: 120,
      },
      {
        text: '  Route (app)  /blog 61 kB | First Load JS 57 kB',
        color: 'text-fd-muted-foreground',
        delay: 120,
      },
      {
        text: '  Route (app)  /about 75 kB | First Load JS 92 kB',
        color: 'text-fd-muted-foreground',
        delay: 120,
      },
      { text: '', delay: 60 },
      {
        text: '  ✓ Build completed in 4.2s',
        color: 'text-[var(--terminal-success)]',
        delay: 280,
      },
    ],
  },
  {
    label: 'deploy',
    command: 'vercel deploy --prod',
    lines: [
      { text: '', delay: 80 },
      { text: '  Vercel CLI 39.2.0', color: 'text-fd-muted-foreground', delay: 200 },
      { text: '', delay: 60 },
      { text: '  > Deploying to production...', color: 'text-fd-foreground/70', delay: 280 },
      { text: '', delay: 60 },
      { text: '  ✓ Building', color: 'text-[var(--terminal-success)]', delay: 220 },
      { text: '  ✓ Uploading', color: 'text-[var(--terminal-success)]', delay: 180 },
      { text: '  ✓ Finalizing', color: 'text-[var(--terminal-success)]', delay: 180 },
      { text: '', delay: 60 },
      {
        text: '  Production: https://docs.watanuki.dev',
        color: 'text-fd-foreground/80',
        delay: 350,
      },
      { text: '', delay: 60 },
      { text: '  ✓ Deployment complete', color: 'text-[var(--terminal-success)]', delay: 250 },
    ],
  },
  {
    label: 'test',
    command: 'pnpm test',
    lines: [
      { text: '', delay: 80 },
      { text: '  PASS  packages/ui/terminal.test.tsx', color: 'text-fd-muted-foreground', delay: 200 },
      {
        text: '    ✓ types commands with cursor',
        color: 'text-[var(--terminal-success)]',
        delay: 100,
      },
      {
        text: '    ✓ switches tabs and replays animation',
        color: 'text-[var(--terminal-success)]',
        delay: 100,
      },
      { text: '', delay: 60 },
      {
        text: '  Test Suites: 1 passed, 1 total',
        color: 'text-[var(--terminal-success)]',
        delay: 180,
      },
      {
        text: '  Tests:       2 passed, 2 total',
        color: 'text-[var(--terminal-success)]',
        delay: 140,
      },
      { text: '  Time:        0.42 s', color: 'text-fd-muted-foreground', delay: 100 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export function Terminal({
  tabs = defaultTerminalTabs,
  defaultActiveTab = 0,
  activeTab: activeTabProp,
  onActiveTabChange,
  backgroundImage,
  alwaysDark = false,
  hideCursorOnComplete = false,
  className,
  children,
  style,
  ...props
}: TerminalProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultActiveTab);
  const activeTab = activeTabProp ?? uncontrolled;

  const setActiveTab = useCallback(
    (index: number) => {
      if (activeTabProp === undefined) setUncontrolled(index);
      onActiveTabChange?.(index);
    },
    [activeTabProp, onActiveTabChange],
  );

  const [visibleLines, setVisibleLines] = useState(0);
  const [commandTyped, setCommandTyped] = useState('');
  const [isTypingCommand, setIsTypingCommand] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    for (const t of timeoutRef.current) clearTimeout(t);
    timeoutRef.current = [];
  }, []);

  const animateTab = useCallback(
    (tabIndex: number) => {
      clearTimeouts();
      setVisibleLines(0);
      setCommandTyped('');
      setIsTypingCommand(true);
      setShowCursor(true);

      const tab = tabs[tabIndex];
      if (!tab) return;

      const command = tab.command;
      let charIndex = 0;

      const showLines = (lineIndex: number) => {
        if (lineIndex > tab.lines.length) return;
        setVisibleLines(lineIndex);
        if (lineIndex < tab.lines.length) {
          const delay = tab.lines[lineIndex]?.delay ?? 100;
          timeoutRef.current.push(setTimeout(() => showLines(lineIndex + 1), delay));
        } else if (hideCursorOnComplete) {
          timeoutRef.current.push(setTimeout(() => setShowCursor(false), 600));
        }
      };

      const typeCommand = () => {
        if (charIndex <= command.length) {
          setCommandTyped(command.slice(0, charIndex));
          charIndex++;
          timeoutRef.current.push(setTimeout(typeCommand, 25 + Math.random() * 35));
        } else {
          timeoutRef.current.push(
            setTimeout(() => {
              setIsTypingCommand(false);
              showLines(0);
            }, 250),
          );
        }
      };

      timeoutRef.current.push(setTimeout(typeCommand, 280));
    },
    [clearTimeouts, hideCursorOnComplete, tabs],
  );

  useEffect(() => {
    animateTab(activeTab);
    return clearTimeouts;
  }, [activeTab, animateTab, clearTimeouts]);

  const safeActiveTab = Math.min(Math.max(activeTab, 0), Math.max(tabs.length - 1, 0));
  const currentTab = tabs[safeActiveTab] ?? tabs[0]!;

  const value = useMemo(
    () => ({
      activeTab: safeActiveTab,
      setActiveTab,
      commandTyped,
      isTypingCommand,
      showCursor,
      visibleLines,
      currentTab,
      tabs,
    }),
    [
      safeActiveTab,
      setActiveTab,
      commandTyped,
      isTypingCommand,
      showCursor,
      visibleLines,
      currentTab,
      tabs,
    ],
  );

  return (
    <TerminalContext value={value}>
      <div
        className={cn(
          'relative w-full',
          alwaysDark && 'dark',
          className,
        )}
        data-slot="terminal"
        style={
          {
            '--terminal-success': 'oklch(78% 0.12 175)',
            ...style,
          } as object
        }
        {...props}
      >
        {backgroundImage ? (
          <div
            aria-hidden
            className="absolute inset-0 rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : null}
        {children ?? (
          <TerminalWindow>
            <TerminalContent />
            <TerminalTabs />
          </TerminalWindow>
        )}
      </div>
    </TerminalContext>
  );
}

// ---------------------------------------------------------------------------
// Background (optional — no decorative glow by default)
// ---------------------------------------------------------------------------

export function TerminalBackground({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 rounded-xl bg-fd-muted', className)}
      data-slot="terminal-background"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Window
// ---------------------------------------------------------------------------

export function TerminalWindow({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative z-1 flex min-h-[22rem] flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card text-fd-card-foreground shadow-sm sm:min-h-[26rem]',
        className,
      )}
      data-slot="terminal-window"
      {...props}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cursor
// ---------------------------------------------------------------------------

export function TerminalCursor({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn(
        'ml-0.5 inline-block h-[1.05em] w-[0.45em] translate-y-[0.12em] bg-fd-muted-foreground animate-[terminal-caret_1s_steps(1)_infinite]',
        className,
      )}
      data-slot="terminal-cursor"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Content (command + output)
// ---------------------------------------------------------------------------

export function TerminalContent({ className, ...props }: ComponentProps<'div'>) {
  const { activeTab, commandTyped, isTypingCommand, showCursor, visibleLines, currentTab } =
    useTerminalContext();

  const showTrailing =
    !isTypingCommand && showCursor && visibleLines >= currentTab.lines.length;

  return (
    <div
      className={cn('relative flex-1 overflow-hidden px-5 py-5 sm:px-8 sm:py-7', className)}
      data-slot="terminal-content"
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(4px)', y: -6 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="font-mono text-[11px] leading-relaxed sm:text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="select-none text-fd-muted-foreground">$</span>
            <span className="text-fd-foreground">
              {commandTyped}
              {isTypingCommand && showCursor && <TerminalCursor />}
            </span>
          </div>

          {!isTypingCommand && (
            <div aria-live="polite" className="mt-1" role="log">
              {currentTab.lines.map((line, i) => {
                if (i >= visibleLines) return null;
                return (
                  <div key={`${activeTab}-${i}`} className="leading-relaxed">
                    <span className={cn(line.color ?? 'text-fd-muted-foreground')}>
                      {line.text || '\u00A0'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {showTrailing && (
            <div className="mt-1 flex items-center gap-2">
              <span className="select-none text-fd-muted-foreground">$</span>
              <TerminalCursor />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs (bottom pill + sliding capsule)
// ---------------------------------------------------------------------------

export function TerminalTabs({ className, ...props }: ComponentProps<'div'>) {
  const { tabs, activeTab, setActiveTab } = useTerminalContext();
  const capsuleId = useId();

  return (
    <div className={cn('flex justify-center pb-5 sm:pb-6', className)} {...props}>
      <div
        aria-label="Terminal commands"
        className="relative inline-flex items-center gap-0 rounded-lg border border-fd-border bg-fd-muted p-1"
        role="tablist"
      >
        {tabs.map((tab, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-state={isActive ? 'active' : 'inactive'}
              onClick={() => setActiveTab(i)}
              className={cn(
                'relative z-1 cursor-pointer rounded-md px-3.5 py-1 font-mono text-sm transition-colors duration-150',
                isActive
                  ? 'text-fd-primary-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={capsuleId}
                  className="absolute inset-0 -z-1 rounded-md bg-fd-primary shadow-sm"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Alias for a single tab trigger when composing custom tab bars */
export function TerminalTab({
  index,
  className,
  children,
  ...props
}: ComponentProps<'button'> & { index: number }) {
  const { activeTab, setActiveTab, tabs } = useTerminalContext();
  const isActive = activeTab === index;
  const label = children ?? tabs[index]?.label;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => setActiveTab(index)}
      className={className}
      {...props}
    >
      {label}
    </button>
  );
}
