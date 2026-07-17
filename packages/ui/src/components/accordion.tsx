'use client';

import { ChevronDown } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import {
  Children,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const ROW_TRANSITION: Transition = {
  type: 'spring',
  duration: 0.55,
  bounce: 0.38,
};

const CONTENT_OPEN_TRANSITION: Transition = {
  type: 'spring',
  duration: 0.58,
  bounce: 0.32,
};

const CONTENT_CLOSE_TRANSITION: Transition = {
  type: 'spring',
  duration: 0.46,
  bounce: 0.26,
};

const DESCRIPTION_TRANSITION: Transition = {
  duration: 0.18,
  ease: EASE_OUT,
};

const CHEVRON_TRANSITION: Transition = {
  type: 'spring',
  duration: 0.42,
  bounce: 0.28,
};

export type BouncyAccordionItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type BouncyAccordionClassNames = {
  root?: string;
  item?: string;
  trigger?: string;
  icon?: string;
  title?: string;
  chevron?: string;
  content?: string;
  description?: string;
};

export interface BouncyAccordionProps {
  items: BouncyAccordionItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
  className?: string;
  classNames?: BouncyAccordionClassNames;
}

function useControllableAccordionValue({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const isControlled = value !== undefined;
  const currentValue = value ?? internalValue;

  const setValue = useCallback(
    (next: string | null) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return [currentValue, setValue] as const;
}

function BouncyAccordionRow({
  item,
  open,
  startsGroup,
  endsGroup,
  separatedFromPrevious,
  contentId,
  triggerId,
  reduce,
  classNames,
  onToggle,
}: {
  item: BouncyAccordionItem;
  open: boolean;
  startsGroup: boolean;
  endsGroup: boolean;
  separatedFromPrevious: boolean;
  contentId: string;
  triggerId: string;
  reduce: boolean | null;
  classNames?: BouncyAccordionClassNames;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => {
      setContentHeight(node.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [item.description]);

  return (
    <motion.div
      layout="position"
      initial={false}
      style={{ marginTop: separatedFromPrevious ? 12 : 0 }}
      transition={reduce ? { duration: 0 } : ROW_TRANSITION}
    >
      <motion.div
        data-state={open ? 'open' : 'closed'}
        initial={false}
        animate={{
          borderTopLeftRadius: startsGroup ? 28 : 0,
          borderTopRightRadius: startsGroup ? 28 : 0,
          borderBottomLeftRadius: endsGroup ? 28 : 0,
          borderBottomRightRadius: endsGroup ? 28 : 0,
        }}
        transition={reduce ? { duration: 0 } : ROW_TRANSITION}
        className={cn(
          'overflow-hidden bg-fd-card text-fd-card-foreground',
          item.disabled && 'opacity-50',
          classNames?.item,
        )}
      >
        <button
          id={triggerId}
          type="button"
          disabled={item.disabled}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={onToggle}
          className={cn(
            'flex min-h-[54px] w-full items-center gap-4 px-5 text-left outline-none transition-colors',
            'focus-visible:bg-fd-muted/25',
            'disabled:pointer-events-none',
            classNames?.trigger,
          )}
        >
          {item.icon ? (
            <span
              className={cn(
                'grid h-7 w-7 shrink-0 place-items-center text-fd-muted-foreground [&_svg]:size-5',
                classNames?.icon,
              )}
            >
              {item.icon}
            </span>
          ) : null}
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-[15px] font-medium text-fd-foreground',
              classNames?.title,
            )}
          >
            {item.title}
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : CHEVRON_TRANSITION}
            className={cn(
              'grid h-6 w-6 shrink-0 place-items-center text-fd-muted-foreground',
              classNames?.chevron,
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        <motion.div
          layout="size"
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          aria-hidden={!open}
          initial={false}
          style={{ height: open && item.description ? contentHeight : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : open
                ? CONTENT_OPEN_TRANSITION
                : CONTENT_CLOSE_TRANSITION
          }
          className={cn('overflow-hidden', classNames?.content)}
        >
          <motion.div
            ref={contentRef}
            animate={{
              opacity: open ? 1 : 0,
            }}
            transition={reduce ? { duration: 0 } : DESCRIPTION_TRANSITION}
            className="px-5 pb-5"
          >
            <div
              className={cn(
                'text-[15px] leading-6 text-fd-muted-foreground',
                classNames?.description,
              )}
            >
              {item.description}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function BouncyAccordion({
  items,
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  className,
  classNames,
}: BouncyAccordionProps) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [activeValue, setActiveValue] = useControllableAccordionValue({
    value,
    defaultValue,
    onValueChange,
  });
  const activeIndex = items.findIndex((item) => item.id === activeValue);

  const toggleItem = useCallback(
    (id: string) => {
      if (activeValue === id) {
        if (collapsible) {
          setActiveValue(null);
        }
        return;
      }
      setActiveValue(id);
    },
    [activeValue, collapsible, setActiveValue],
  );

  return (
    <div className={cn('not-prose w-full', className, classNames?.root)}>
      {items.map((item, index) => {
        const open = activeValue === item.id;
        const previousIsOpen = activeIndex === index - 1;
        const nextIsOpen = activeIndex === index + 1;
        const startsGroup = open || index === 0 || previousIsOpen;
        const endsGroup = open || index === items.length - 1 || nextIsOpen;
        const separatedFromPrevious = index > 0 && (open || previousIsOpen);

        return (
          <BouncyAccordionRow
            key={item.id}
            item={item}
            open={open}
            startsGroup={startsGroup}
            endsGroup={endsGroup}
            separatedFromPrevious={separatedFromPrevious}
            contentId={`${baseId}-${item.id}-content`}
            triggerId={`${baseId}-${item.id}-trigger`}
            reduce={reduce}
            classNames={classNames}
            onToggle={() => toggleItem(item.id)}
          />
        );
      })}
    </div>
  );
}

type AccordionChildProps = {
  title: ReactNode;
  id?: string;
  value?: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
};

export type AccordionItemsProps = BouncyAccordionProps;

export type AccordionItemProps = AccordionChildProps;

/**
 * Items API: `<Accordion items={[...]} defaultValue="a" />`
 * Child API (inside Accordions): `<Accordion title="...">content</Accordion>`
 */
export function Accordion(
  props: AccordionItemsProps | AccordionItemProps,
): ReactElement | null {
  if ('items' in props && props.items) {
    return <BouncyAccordion {...props} />;
  }
  // Props consumed by parent `<Accordions>`
  return null;
}

export type AccordionsProps = Omit<BouncyAccordionProps, 'items'> & {
  children?: ReactNode;
};

/**
 * Children-based MDX API — maps `<Accordion title>` children into BouncyAccordion.
 */
export function Accordions({
  children,
  defaultValue,
  value,
  onValueChange,
  collapsible = true,
  className,
  classNames,
}: AccordionsProps) {
  const items: BouncyAccordionItem[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement<AccordionChildProps>(child)) return;

    const {
      title,
      id,
      value: itemValue,
      icon,
      disabled,
      children: description,
    } = child.props;

    items.push({
      id: itemValue ?? id ?? String(title),
      title,
      description,
      icon,
      disabled,
    });
  });

  return (
    <BouncyAccordion
      items={items}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      collapsible={collapsible}
      className={className}
      classNames={classNames}
    />
  );
}
