'use client';

import { useEffect, useId, useState, type ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface MermaidProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Mermaid diagram source */
  chart: string;
}

function useDarkMode(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      setDark(root.classList.contains('dark'));
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-watanuki-theme'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return dark;
}

/**
 * Client-side Mermaid renderer. Use via ```mermaid fences (remarkMdxMermaid)
 * or `<Mermaid chart="..." />`.
 */
export function Mermaid({ chart, className, ...props }: MermaidProps) {
  const id = useId().replace(/:/g, '');
  const dark = useDarkMode();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? 'dark' : 'default',
          // ponytail: strict blocks script/click XSS from diagram source; upgrade to 'antiscript' if click callbacks needed
          securityLevel: 'strict',
          fontFamily: 'inherit',
        });

        const { svg: next } = await mermaid.render(`mermaid-${id}`, chart.trim());
        if (!cancelled) {
          setSvg(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setSvg(null);
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
        }
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, dark, id]);

  if (error) {
    return (
      <div
        role="alert"
        className={cn(
          'my-4 rounded-xl border border-fd-error/40 bg-fd-card p-4 text-sm text-fd-error',
          className,
        )}
        {...props}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'my-4 flex justify-center overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-4',
        className,
      )}
      data-slot="mermaid"
      {...props}
    >
      {svg ? (
        <div className="[&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-24 w-full animate-pulse rounded-lg bg-fd-muted/40" aria-hidden />
      )}
    </div>
  );
}

/** Alias */
export const MermaidDiagram = Mermaid;
