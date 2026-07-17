'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from '@watanuki/core/link';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslations } from '@fuma-translate/react';
const fieldVariants = cva('text-fd-muted-foreground not-prose pe-2');
const MotionChevron = motion.create(ChevronDown);
export function TypeTable({ id, type, className, ...props }) {
    const t = useTranslations({ note: 'type table' });
    return (_jsxs("div", { id: id, className: cn('@container my-6 flex flex-col overflow-hidden rounded-xl border border-fd-border/70 bg-fd-card/75 p-2 text-sm text-fd-card-foreground shadow-sm backdrop-blur-xs', className), ...props, children: [_jsxs("div", { className: "flex items-center px-4 py-3 not-prose font-medium text-fd-muted-foreground", children: [_jsx("p", { className: "w-[24%] min-w-28", children: t('Prop') }), _jsx("p", { className: "@max-xl:hidden", children: t('Type') })] }), Object.entries(type).map(([key, value]) => (_jsx(Item, { parentId: id, name: key, item: value }, key)))] }));
}
function Item({ parentId, name, item: { parameters = [], description, required = false, deprecated, typeDescription, default: defaultValue, type, typeDescriptionLink, returns, }, }) {
    const t = useTranslations({ note: 'type table' });
    const [open, setOpen] = useState(false);
    const id = parentId ? `${parentId}-${name}` : undefined;
    useEffect(() => {
        const hash = window.location.hash;
        if (!id || !hash)
            return;
        if (`#${id}` === hash)
            setOpen(true);
    }, [id]);
    return (_jsxs(Collapsible, { id: id, open: open, onOpenChange: (v) => {
            if (v && id) {
                window.history.replaceState(null, '', `#${id}`);
            }
            setOpen(v);
        }, className: cn('scroll-m-20 overflow-hidden rounded-lg border border-transparent transition-[background-color,border-color,box-shadow] duration-200 ease-out', open
            ? 'border-fd-border/80 bg-fd-background/80 shadow-sm not-last:mb-2'
            : 'hover:border-fd-border/50 hover:bg-fd-secondary/30'), children: [_jsxs(CollapsibleTrigger, { className: "relative flex w-full flex-row items-center px-4 py-4 text-start not-prose transition-colors duration-200 ease-out hover:bg-fd-accent/35", children: [_jsxs("code", { className: cn('min-w-fit w-[24%] min-w-28 pe-2 font-mono font-medium text-fd-primary', deprecated && 'line-through text-fd-primary/50'), children: [name, !required && '?'] }), typeDescriptionLink ? (_jsx(Link, { href: typeDescriptionLink, className: "underline @max-xl:hidden", children: type })) : (_jsx("span", { className: "@max-xl:hidden text-fd-foreground/90", children: type })), _jsx(MotionChevron, { animate: { rotate: open ? 180 : 0, scale: open ? 1.04 : 1 }, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }, className: "absolute inset-e-4 size-4 text-fd-muted-foreground" })] }), _jsx(CollapsibleContent, { children: _jsx(AnimatePresence, { initial: false, children: open ? (_jsx(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }, className: "border-t border-fd-border/70", children: _jsxs("div", { className: "grid grid-cols-[minmax(96px,0.9fr)_minmax(0,3fr)] gap-y-5 overflow-auto p-5 text-sm fd-scroll-container", children: [_jsx("div", { className: "col-span-full prose prose-no-margin text-sm empty:hidden", children: description }), typeDescription && (_jsxs(_Fragment, { children: [_jsx("p", { className: cn(fieldVariants(), 'pt-1'), children: t('Type') }), _jsx("p", { className: "my-auto not-prose", children: typeDescription })] })), defaultValue && (_jsxs(_Fragment, { children: [_jsx("p", { className: cn(fieldVariants(), 'pt-1'), children: t('Default') }), _jsx("p", { className: "my-auto not-prose", children: defaultValue })] })), parameters.length > 0 && (_jsxs(_Fragment, { children: [_jsx("p", { className: cn(fieldVariants(), 'pt-1'), children: t('Parameters') }), _jsx("div", { className: "flex flex-col gap-3", children: parameters.map((param) => (_jsxs("div", { className: "flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-2", children: [_jsxs("p", { className: "font-medium not-prose whitespace-nowrap", children: [param.name, " -"] }), _jsx("div", { className: "prose prose-no-margin text-sm", children: param.description })] }, param.name))) })] })), returns && (_jsxs(_Fragment, { children: [_jsx("p", { className: cn(fieldVariants(), 'pt-1'), children: t('Returns') }), _jsx("div", { className: "my-auto prose prose-no-margin text-sm", children: returns })] }))] }) })) : null }) })] }));
}
