import { Check, Minus, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type ComparisonStatus = boolean | 'partial' | null;

export interface ComparisonRow {
  feature: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  values: ComparisonStatus[];
}

export interface ComparisonTableProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Column labels after the Feature column. */
  columns: ReactNode[];
  rows: ComparisonRow[];
  /** Header label for the feature column. */
  featureLabel?: ReactNode;
}

function StatusIcon({ value }: { value: ComparisonStatus }) {
  if (value === true) {
    return (
      <Check
        className="size-5 text-emerald-500"
        strokeWidth={2.25}
        aria-label="Supported"
      />
    );
  }
  if (value === false) {
    return <X className="size-5 text-red-500" strokeWidth={2.25} aria-label="Not supported" />;
  }
  if (value === 'partial') {
    return (
      <Check
        className="size-5 text-amber-400"
        strokeWidth={2.25}
        aria-label="Partially supported"
      />
    );
  }
  return <Minus className="size-5 text-fd-muted-foreground/70" strokeWidth={2} aria-label="N/A" />;
}

export function ComparisonTable({
  columns,
  rows,
  featureLabel = 'Feature',
  className,
  ...props
}: ComparisonTableProps) {
  const colCount = columns.length;

  return (
    <div
      className={cn(
        'my-6 overflow-hidden rounded-xl border border-fd-border/70 bg-fd-card text-fd-card-foreground shadow-sm',
        className,
      )}
      {...props}
    >
      <div
        className="grid items-center gap-4 border-b border-fd-border/70 bg-fd-muted/50 px-5 py-3.5 text-sm font-semibold not-prose"
        style={{
          gridTemplateColumns: `minmax(0, 1.6fr) repeat(${colCount}, minmax(5rem, 1fr))`,
        }}
      >
        <div>{featureLabel}</div>
        {columns.map((col, i) => (
          <div key={i} className="text-center">
            {col}
          </div>
        ))}
      </div>

      <div className="divide-y divide-fd-border/60">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid items-center gap-4 px-5 py-4 not-prose"
            style={{
              gridTemplateColumns: `minmax(0, 1.6fr) repeat(${colCount}, minmax(5rem, 1fr))`,
            }}
          >
            <div className="flex min-w-0 items-start gap-3">
              {row.icon ? (
                <div className="mt-0.5 shrink-0 text-fd-muted-foreground [&_svg]:size-4">
                  {row.icon}
                </div>
              ) : null}
              <div className="min-w-0">
                <div className="text-sm font-semibold text-fd-foreground">{row.feature}</div>
                {row.description ? (
                  <div className="mt-0.5 text-sm text-fd-muted-foreground">{row.description}</div>
                ) : null}
              </div>
            </div>
            {Array.from({ length: colCount }, (_, j) => (
              <div key={j} className="flex justify-center">
                <StatusIcon value={row.values[j] ?? null} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
