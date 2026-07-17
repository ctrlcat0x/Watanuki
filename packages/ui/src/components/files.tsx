'use client';

import { cva } from '@/utils/cva';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, FileIcon, FolderIcon, FolderOpen } from 'lucide-react';
import { type HTMLAttributes, type ReactNode, useState } from 'react';
import { cn } from '@/utils/cn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const itemVariants = cva(
  'group/tree-item relative flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-fd-card-foreground transition-colors duration-200 ease-out hover:bg-fd-accent/60 hover:text-fd-accent-foreground [&_svg]:shrink-0 [&_svg]:transition-colors',
);

export function Files({ className, ...props }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        'not-prose rounded-2xl border border-fd-border/70 bg-fd-card/70 p-3 shadow-sm backdrop-blur-xs',
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: ReactNode;
}

export interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;

  disabled?: boolean;

  /**
   * Open folder by default
   *
   * @defaultValue false
   */
  defaultOpen?: boolean;
}

export function File({
  name,
  icon = <FileIcon className="size-4" />,
  className,
  ...rest
}: FileProps): React.ReactElement {
  return (
    <motion.div layout="position" transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
      <div className={cn(itemVariants({ className }), 'text-fd-muted-foreground')} {...rest}>
        <span className="flex size-4 items-center justify-center text-fd-muted-foreground/85">
          {icon}
        </span>
        <span className="truncate text-[0.9375rem] text-fd-foreground">{name}</span>
      </div>
    </motion.div>
  );
}

function TreeBranch({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      className="relative ms-4 mt-1 flex flex-col gap-1 ps-5 before:absolute before:inset-y-1 before:start-0 before:w-px before:bg-fd-border"
    >
      {children}
    </motion.div>
  );
}

function FolderTriggerRow({
  open,
  name,
}: {
  open: boolean;
  name: string;
}) {
  return (
    <>
      <motion.span
        animate={{ rotate: open ? 90 : 0, scale: open ? 1 : 0.96 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="flex size-4 items-center justify-center text-fd-muted-foreground"
      >
        <ChevronRight className="size-4" />
      </motion.span>
      <motion.span
        animate={{ scale: open ? 1.03 : 1, y: open ? -0.5 : 0 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="flex size-5 items-center justify-center text-fd-muted-foreground"
      >
        {open ? <FolderOpen className="size-4.5" /> : <FolderIcon className="size-4.5" />}
      </motion.span>
      <span className="truncate text-[0.9375rem] text-fd-foreground">{name}</span>
    </>
  );
}

export function Folder({
  name,
  defaultOpen = false,
  disabled = false,
  className,
  ...props
}: FolderProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props} className="group/tree">
      <CollapsibleTrigger
        disabled={disabled}
        className={cn(
          itemVariants(),
          'data-[state=open]:bg-fd-secondary/80 data-[state=open]:text-fd-foreground disabled:pointer-events-none disabled:opacity-60',
          open && 'bg-fd-secondary/80 shadow-sm',
          className,
        )}
      >
        <FolderTriggerRow open={open} name={name} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence initial={false}>
          {open ? <TreeBranch>{props.children}</TreeBranch> : null}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}
