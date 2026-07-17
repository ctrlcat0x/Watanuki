'use client';

import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from '@watanuki/core/link';
import { cva } from '@/utils/cva';
import { cn } from '@/utils/cn';
import { type ComponentProps, type ReactNode, useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslations } from '@/contexts/translations';

export interface ParameterNode {
  name: string;
  description: ReactNode;
}

export interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode;

  /**
   * type signature (short)
   */
  type: ReactNode;

  /**
   * type signature (full)
   */
  typeDescription?: ReactNode;

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;

  default?: ReactNode;

  required?: boolean;
  deprecated?: boolean;

  /**
   * a list of parameters info if the type is a function.
   */
  parameters?: ParameterNode[];

  returns?: ReactNode;
}

const fieldVariants = cva('text-fd-muted-foreground not-prose pe-2');
const MotionChevron = motion.create(ChevronDown);

export function TypeTable({
  id,
  type,
  className,
  ...props
}: { type: Record<string, TypeNode> } & ComponentProps<'div'>) {
  const t = useTranslations({ note: 'type table' });

  return (
    <div
      id={id}
      className={cn(
        '@container my-6 flex flex-col overflow-hidden rounded-xl border border-fd-border/70 bg-fd-card/75 p-2 text-sm text-fd-card-foreground shadow-sm backdrop-blur-xs',
        className,
      )}
      {...props}
    >
      <div className="flex items-center px-4 py-3 not-prose font-medium text-fd-muted-foreground">
        <p className="w-[24%] min-w-28">{t('Prop')}</p>
        <p className="@max-xl:hidden">{t('Type')}</p>
      </div>
      {Object.entries(type).map(([key, value]) => (
        <Item key={key} parentId={id} name={key} item={value} />
      ))}
    </div>
  );
}

function Item({
  parentId,
  name,
  item: {
    parameters = [],
    description,
    required = false,
    deprecated,
    typeDescription,
    default: defaultValue,
    type,
    typeDescriptionLink,
    returns,
  },
}: {
  parentId?: string;
  name: string;
  item: TypeNode;
}) {
  const t = useTranslations({ note: 'type table' });
  const [open, setOpen] = useState(false);
  const id = parentId ? `${parentId}-${name}` : undefined;

  useEffect(() => {
    const hash = window.location.hash;
    if (!id || !hash) return;
    if (`#${id}` === hash) setOpen(true);
  }, [id]);

  return (
    <Collapsible
      id={id}
      open={open}
      onOpenChange={(v) => {
        if (v && id) {
          window.history.replaceState(null, '', `#${id}`);
        }
        setOpen(v);
      }}
        className={cn(
        'scroll-m-20 overflow-hidden rounded-lg border border-transparent transition-[background-color,border-color,box-shadow] duration-200 ease-out',
        open
          ? 'border-fd-border/80 bg-fd-background/80 shadow-sm not-last:mb-2'
          : 'hover:border-fd-border/50 hover:bg-fd-secondary/30',
      )}
    >
      <CollapsibleTrigger className="relative flex w-full flex-row items-center px-4 py-4 text-start not-prose transition-colors duration-200 ease-out hover:bg-fd-accent/35">
        <code
          className={cn(
            'min-w-fit w-[24%] min-w-28 pe-2 font-mono font-medium text-fd-primary',
            deprecated && 'line-through text-fd-primary/50',
          )}
        >
          {name}
          {!required && '?'}
        </code>
        {typeDescriptionLink ? (
          <Link href={typeDescriptionLink} className="underline @max-xl:hidden">
            {type}
          </Link>
        ) : (
          <span className="@max-xl:hidden text-fd-foreground/90">{type}</span>
        )}
        <MotionChevron
          animate={{ rotate: open ? 180 : 0, scale: open ? 1.04 : 1 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-e-4 size-4 text-fd-muted-foreground"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="border-t border-fd-border/70"
            >
              <div className="grid grid-cols-[minmax(96px,0.9fr)_minmax(0,3fr)] gap-y-5 overflow-auto p-5 text-sm fd-scroll-container">
                <div className="col-span-full prose prose-no-margin text-sm empty:hidden">{description}</div>
                {typeDescription && (
                  <>
                    <p className={cn(fieldVariants(), 'pt-1')}>{t('Type')}</p>
                    <p className="my-auto not-prose">{typeDescription}</p>
                  </>
                )}
                {defaultValue && (
                  <>
                    <p className={cn(fieldVariants(), 'pt-1')}>{t('Default')}</p>
                    <p className="my-auto not-prose">{defaultValue}</p>
                  </>
                )}
                {parameters.length > 0 && (
                  <>
                    <p className={cn(fieldVariants(), 'pt-1')}>{t('Parameters')}</p>
                    <div className="flex flex-col gap-3">
                      {parameters.map((param) => (
                        <div key={param.name} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-2">
                          <p className="font-medium not-prose whitespace-nowrap">{param.name} -</p>
                          <div className="prose prose-no-margin text-sm">{param.description}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {returns && (
                  <>
                    <p className={cn(fieldVariants(), 'pt-1')}>{t('Returns')}</p>
                    <div className="my-auto prose prose-no-margin text-sm">{returns}</div>
                  </>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}
