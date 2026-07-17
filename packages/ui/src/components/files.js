'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, FileIcon, FolderIcon, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
const itemVariants = cva('group/tree-item relative flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-fd-card-foreground transition-colors duration-200 ease-out hover:bg-fd-accent/60 hover:text-fd-accent-foreground [&_svg]:shrink-0 [&_svg]:transition-colors');
export function Files({ className, ...props }) {
    return (_jsx("div", { className: cn('not-prose rounded-2xl border border-fd-border/70 bg-fd-card/70 p-3 shadow-sm backdrop-blur-xs', className), ...props, children: props.children }));
}
export function File({ name, icon = _jsx(FileIcon, { className: "size-4" }), className, ...rest }) {
    return (_jsx(motion.div, { layout: "position", transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }, children: _jsxs("div", { className: cn(itemVariants({ className }), 'text-fd-muted-foreground'), ...rest, children: [_jsx("span", { className: "flex size-4 items-center justify-center text-fd-muted-foreground/85", children: icon }), _jsx("span", { className: "truncate text-[0.9375rem] text-fd-foreground", children: name })] }) }));
}
function TreeBranch({ children }) {
    return (_jsx(motion.div, { layout: true, initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }, className: "relative ms-4 mt-1 flex flex-col gap-1 ps-5 before:absolute before:inset-y-1 before:start-0 before:w-px before:bg-fd-border", children: children }));
}
function FolderTriggerRow({ open, name, }) {
    return (_jsxs(_Fragment, { children: [_jsx(motion.span, { animate: { rotate: open ? 90 : 0, scale: open ? 1 : 0.96 }, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }, className: "flex size-4 items-center justify-center text-fd-muted-foreground", children: _jsx(ChevronRight, { className: "size-4" }) }), _jsx(motion.span, { animate: { scale: open ? 1.03 : 1, y: open ? -0.5 : 0 }, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }, className: "flex size-5 items-center justify-center text-fd-muted-foreground", children: open ? _jsx(FolderOpen, { className: "size-4.5" }) : _jsx(FolderIcon, { className: "size-4.5" }) }), _jsx("span", { className: "truncate text-[0.9375rem] text-fd-foreground", children: name })] }));
}
export function Folder({ name, defaultOpen = false, disabled = false, className, ...props }) {
    const [open, setOpen] = useState(defaultOpen);
    return (_jsxs(Collapsible, { open: open, onOpenChange: setOpen, ...props, className: "group/tree", children: [_jsx(CollapsibleTrigger, { disabled: disabled, className: cn(itemVariants(), 'data-[state=open]:bg-fd-secondary/80 data-[state=open]:text-fd-foreground disabled:pointer-events-none disabled:opacity-60', open && 'bg-fd-secondary/80 shadow-sm', className), children: _jsx(FolderTriggerRow, { open: open, name: name }) }), _jsx(CollapsibleContent, { children: _jsx(AnimatePresence, { initial: false, children: open ? _jsx(TreeBranch, { children: props.children }) : null }) })] }));
}
