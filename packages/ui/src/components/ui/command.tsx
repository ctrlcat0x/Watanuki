'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search, X } from 'lucide-react';
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
  useRef,
} from 'react';
import { cn } from '@/utils/cn';
import { mergeRefs } from '@/utils/merge-refs';

const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-xl bg-fd-popover text-fd-popover-foreground',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

function CommandDialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

function CommandDialogTrigger({
  render,
  ...props
}: ComponentProps<typeof DialogPrimitive.Trigger> & {
  render?: React.ReactElement;
}) {
  return <DialogPrimitive.Trigger render={render} {...props} />;
}

function CommandDialogPopup({ className, children }: ComponentProps<'div'>) {
  return (
    <>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-fd-overlay/80 backdrop-blur-xs data-open:animate-fd-fade-in data-closed:animate-fd-fade-out" />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Popup
          aria-describedby={undefined}
          className={( _state) =>
            cn(
              'fixed left-1/2 top-[12%] z-50 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl focus-visible:outline-none data-open:animate-fd-dialog-in data-closed:animate-fd-dialog-out',
              className,
            )
          }
        >
          <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </>
  );
}

const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, value, onValueChange, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = typeof value === 'string' && value.length > 0;

  return (
    <div className="flex items-center gap-2 border-b px-3" data-cmdk-input-wrapper="">
      <Search className="size-4 shrink-0 text-fd-muted-foreground" />
      <CommandPrimitive.Input
        ref={mergeRefs(ref, inputRef)}
        value={value}
        onValueChange={onValueChange}
        className={cn(
          'flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-fd-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      {hasQuery && (
        <button
          type="button"
          aria-label="Clear search"
          className="shrink-0 rounded-md p-1 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
          onClick={() => {
            onValueChange?.('');
            inputRef.current?.focus();
          }}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
});
CommandInput.displayName = CommandPrimitive.Input.displayName;

function CommandPanel({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex min-h-0 flex-1 flex-col', className)} {...props} />;
}

const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[min(28rem,70vh)] overflow-y-auto overflow-x-hidden p-1', className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-8 text-center text-sm text-fd-muted-foreground" {...props} />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-fd-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fd-muted-foreground',
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

function CommandGroupLabel({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-2 py-1.5 text-xs font-medium text-fd-muted-foreground', className)} {...props} />;
}

function CommandCollection({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-0.5', className)} {...props} />;
}

const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-fd-accent data-[selected=true]:text-fd-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn('-mx-1 h-px bg-fd-border', className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('ms-auto text-xs tracking-widest text-fd-muted-foreground', className)} {...props} />
  );
}

function CommandFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-t bg-fd-muted/50 px-3 py-2 text-xs text-fd-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
};
