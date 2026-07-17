'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { forwardRef, } from 'react';
import { cn } from '@/utils/cn';
const Command = forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive, { ref: ref, className: cn('flex h-full w-full flex-col overflow-hidden rounded-xl bg-fd-popover text-fd-popover-foreground', className), ...props })));
Command.displayName = CommandPrimitive.displayName;
function CommandDialog({ open, onOpenChange, children, }) {
    return (_jsx(DialogPrimitive.Root, { open: open, onOpenChange: onOpenChange, children: children }));
}
function CommandDialogTrigger({ render, ...props }) {
    return _jsx(DialogPrimitive.Trigger, { render: render, ...props });
}
function CommandDialogPopup({ className, children }) {
    return (_jsxs(_Fragment, { children: [_jsx(DialogPrimitive.Backdrop, { className: "fixed inset-0 z-50 bg-fd-overlay/80 backdrop-blur-xs data-open:animate-fd-fade-in data-closed:animate-fd-fade-out" }), _jsx(DialogPrimitive.Portal, { children: _jsxs(DialogPrimitive.Popup, { "aria-describedby": undefined, className: (_state) => cn('fixed left-1/2 top-[12%] z-50 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col overflow-hidden rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl focus-visible:outline-none data-open:animate-fd-dialog-in data-closed:animate-fd-dialog-out', className), children: [_jsx(DialogPrimitive.Title, { className: "sr-only", children: "Search" }), children] }) })] }));
}
const CommandInput = forwardRef(({ className, ...props }, ref) => (_jsxs("div", { className: "flex items-center gap-2 border-b px-3", "data-cmdk-input-wrapper": "", children: [_jsx(Search, { className: "size-4 shrink-0 text-fd-muted-foreground" }), _jsx(CommandPrimitive.Input, { ref: ref, className: cn('flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-fd-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', className), ...props })] })));
CommandInput.displayName = CommandPrimitive.Input.displayName;
function CommandPanel({ className, ...props }) {
    return _jsx("div", { className: cn('flex min-h-0 flex-1 flex-col', className), ...props });
}
const CommandList = forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.List, { ref: ref, className: cn('max-h-80 overflow-y-auto overflow-x-hidden p-1', className), ...props })));
CommandList.displayName = CommandPrimitive.List.displayName;
const CommandEmpty = forwardRef((props, ref) => (_jsx(CommandPrimitive.Empty, { ref: ref, className: "py-8 text-center text-sm text-fd-muted-foreground", ...props })));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
const CommandGroup = forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.Group, { ref: ref, className: cn('overflow-hidden p-1 text-fd-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fd-muted-foreground', className), ...props })));
CommandGroup.displayName = CommandPrimitive.Group.displayName;
function CommandGroupLabel({ className, ...props }) {
    return _jsx("div", { className: cn('px-2 py-1.5 text-xs font-medium text-fd-muted-foreground', className), ...props });
}
function CommandCollection({ className, ...props }) {
    return _jsx("div", { className: cn('flex flex-col gap-0.5', className), ...props });
}
const CommandItem = forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.Item, { ref: ref, className: cn('relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-fd-accent data-[selected=true]:text-fd-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0', className), ...props })));
CommandItem.displayName = CommandPrimitive.Item.displayName;
const CommandSeparator = forwardRef(({ className, ...props }, ref) => (_jsx(CommandPrimitive.Separator, { ref: ref, className: cn('-mx-1 h-px bg-fd-border', className), ...props })));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;
function CommandShortcut({ className, ...props }) {
    return (_jsx("span", { className: cn('ms-auto text-xs tracking-widest text-fd-muted-foreground', className), ...props }));
}
function CommandFooter({ className, ...props }) {
    return (_jsx("div", { className: cn('flex items-center justify-between gap-4 border-t bg-fd-muted/50 px-3 py-2 text-xs text-fd-muted-foreground', className), ...props }));
}
export { Command, CommandCollection, CommandDialog, CommandDialogPopup, CommandDialogTrigger, CommandEmpty, CommandFooter, CommandGroup, CommandGroupLabel, CommandInput, CommandItem, CommandList, CommandPanel, CommandSeparator, CommandShortcut, };
