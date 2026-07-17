'use client';

import { Check } from 'lucide-react';
import {
  Children,
  createContext,
  isValidElement,
  use,
  useCallback,
  useMemo,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type StepState = 'incomplete' | 'current' | 'complete';

type StepperContextValue = {
  value: number;
  count: number;
  setValue: (value: number) => void;
};

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const ctx = use(StepperContext);
  if (!ctx) throw new Error('Stepper components must be used within <Stepper>');
  return ctx;
}

export interface StepperItemProps {
  title: ReactNode;
  description?: ReactNode;
  /** Optional panel content shown when this step is current */
  children?: ReactNode;
  className?: string;
  /** Override the numbered indicator when incomplete / current */
  indicator?: ReactNode;
}

/**
 * Declares a step. Rendered by parent `<Stepper>` — do not nest interactive UI here
 * except optional panel `children`.
 */
export function StepperItem(_props: StepperItemProps) {
  return null;
}

StepperItem.displayName = 'StepperItem';

function getStepState(index: number, value: number): StepState {
  if (index < value) return 'complete';
  if (index === value) return 'current';
  return 'incomplete';
}

function isStepperItem(child: ReactNode): child is ReactElement<StepperItemProps> {
  return (
    isValidElement(child) &&
    (child.type === StepperItem ||
      (typeof child.type === 'function' &&
        'displayName' in child.type &&
        child.type.displayName === 'StepperItem'))
  );
}

export interface StepperProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /**
   * Uncontrolled initial step index (0-based).
   * @defaultValue 0
   */
  defaultValue?: number;
  /** Controlled step index (0-based). */
  value?: number;
  onValueChange?: (value: number) => void;
  /**
   * Show previous / next controls.
   * @defaultValue true
   */
  controls?: boolean;
}

export function Stepper({
  defaultValue = 0,
  value: valueProp,
  onValueChange,
  controls = true,
  className,
  children,
  ...props
}: StepperProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;

  const items = useMemo(
    () => Children.toArray(children).filter(isStepperItem),
    [children],
  );
  const count = items.length;

  const setValue = useCallback(
    (next: number) => {
      if (count === 0) return;
      const clamped = Math.max(0, Math.min(next, count - 1));
      if (valueProp === undefined) setUncontrolled(clamped);
      onValueChange?.(clamped);
    },
    [count, onValueChange, valueProp],
  );

  const current = items[value];
  const hasContent = items.some(
    (item) => item.props.children != null && item.props.children !== '',
  );

  const ctx = useMemo(
    () => ({ value, count, setValue }),
    [value, count, setValue],
  );

  return (
    <StepperContext value={ctx}>
      <div
        data-fd-stepper=""
        className={cn('not-prose my-4 flex flex-col gap-4', className)}
        {...props}
      >
        <nav aria-label="Progress">
          <ol className="flex w-full list-none p-0 m-0">
            {items.map((item, index) => {
              const state = getStepState(index, value);
              const isLast = index === count - 1;
              const titleLabel =
                typeof item.props.title === 'string'
                  ? item.props.title
                  : `Step ${index + 1}`;

              return (
                <li
                  key={index}
                  data-state={state}
                  className="relative flex flex-1 flex-col items-center gap-2"
                >
                  {!isLast && (
                    <div
                      aria-hidden
                      data-state={index < value ? 'complete' : 'incomplete'}
                      className={cn(
                        'absolute top-4 start-[calc(50%+1rem)] end-[calc(-50%+1rem)] h-px',
                        index < value ? 'bg-fd-primary' : 'bg-fd-border',
                      )}
                    />
                  )}
                  <button
                    type="button"
                    aria-current={state === 'current' ? 'step' : undefined}
                    aria-label={`Step ${index + 1}: ${titleLabel}`}
                    data-state={state}
                    onClick={() => setValue(index)}
                    className={cn(
                      'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
                      state === 'incomplete' &&
                        'border-fd-border bg-fd-background text-fd-muted-foreground hover:border-fd-primary/40',
                      (state === 'current' || state === 'complete') &&
                        'border-fd-primary bg-fd-primary text-fd-primary-foreground',
                      item.props.className,
                    )}
                  >
                    {state === 'complete' ? (
                      <Check className="size-4" aria-hidden />
                    ) : (
                      (item.props.indicator ?? index + 1)
                    )}
                  </button>
                  <div className="flex max-w-28 flex-col items-center gap-0.5 px-1 text-center sm:max-w-none">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        state === 'incomplete'
                          ? 'text-fd-muted-foreground'
                          : 'text-fd-foreground',
                      )}
                    >
                      {item.props.title}
                    </span>
                    {item.props.description != null && (
                      <span className="text-xs text-fd-muted-foreground">
                        {item.props.description}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        {hasContent && current?.props.children != null && (
          <div
            role="region"
            aria-label={
              typeof current.props.title === 'string'
                ? current.props.title
                : `Step ${value + 1}`
            }
            className="rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-card-foreground"
          >
            {current.props.children}
          </div>
        )}

        {controls && count > 0 && (
          <div className="flex items-center justify-between gap-2">
            <StepperPrev />
            <span className="text-xs text-fd-muted-foreground tabular-nums">
              {value + 1} / {count}
            </span>
            <StepperNext />
          </div>
        )}
      </div>
    </StepperContext>
  );
}

export function StepperPrev({
  className,
  children = 'Previous',
  ...props
}: ComponentProps<'button'>) {
  const { value, setValue } = useStepperContext();

  return (
    <button
      type="button"
      disabled={value <= 0}
      onClick={() => setValue(value - 1)}
      className={cn(buttonVariants({ color: 'secondary', size: 'sm' }), 'px-3', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function StepperNext({
  className,
  children = 'Next',
  ...props
}: ComponentProps<'button'>) {
  const { value, count, setValue } = useStepperContext();

  return (
    <button
      type="button"
      disabled={value >= count - 1}
      onClick={() => setValue(value + 1)}
      className={cn(buttonVariants({ color: 'primary', size: 'sm' }), 'px-3', className)}
      {...props}
    >
      {children}
    </button>
  );
}
