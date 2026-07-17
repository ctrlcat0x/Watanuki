'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Base from '@/components/toc';
import { resolveTOCStyle } from '@/components/toc/styles';
import { useTranslations } from '@fuma-translate/react';
import { useTreePath } from '@/contexts/tree';
import { cn } from '@/utils/cn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { createContext, use, useEffect, useEffectEvent, useMemo, useRef, useState, } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
const TocPopoverContext = createContext(null);
export const { TOCProvider } = Base;
export function TOC({ container, trigger, content, header, footer, style = 'normal', list, }) {
    const items = Base.useTOCItems();
    const { TOCItems, TOCEmpty, TOCItem } = resolveTOCStyle(style);
    if (items.length === 0 && !header && !footer)
        return;
    return (_jsxs(PageTOCPopover, { ...container, children: [_jsxs(PageTOCPopoverContent, { ...content, children: [header, _jsx(Base.TOCScrollArea, { children: _jsxs(TOCItems, { ...list, children: [items.length === 0 && _jsx(TOCEmpty, {}), items.map((item) => (_jsx(TOCItem, { item: item }, item.url)))] }) }), footer] }), _jsx(PageTOCPopoverTrigger, { ...trigger })] }));
}
function PageTOCPopover(props) {
    const [container, setContainer] = useState(null);
    useEffect(() => {
        const element = document.getElementById('flux-layout-slot');
        if (!element)
            return;
        setContainer(element);
    }, []);
    if (!container)
        return;
    return createPortal(_jsx(PageTOCPopoverPhysical, { ...props }), container);
}
function PageTOCPopoverPhysical({ className, children, ...rest }) {
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const onClick = useEffectEvent((e) => {
        if (!open)
            return;
        if (ref.current && !ref.current.contains(e.target))
            setOpen(false);
    });
    useEffect(() => {
        window.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('click', onClick);
        };
    }, []);
    return (_jsx(TocPopoverContext, { value: useMemo(() => ({
            open,
            setOpen,
        }), [setOpen, open]), children: _jsx(Collapsible, { open: open, onOpenChange: setOpen, "data-toc-popover": "", className: cn('relative h-9 animate-fd-fade-in', className), ...rest, children: _jsx("header", { ref: ref, className: cn('absolute w-full bottom-0 border rounded-xl transition-colors bg-fd-secondary text-fd-secondary-foreground backdrop-blur-sm', open && 'shadow-lg bg-fd-popover/80 text-fd-popover-foreground'), children: children }) }) }));
}
function PageTOCPopoverTrigger({ className, ...props }) {
    const t = useTranslations({ note: 'table of contents' });
    const { open } = use(TocPopoverContext);
    const items = Base.useItems();
    const selectedIdx = items.findIndex((item) => item.active);
    const path = useTreePath().at(-1);
    const spanProps = {
        transition: {
            duration: 0.1,
        },
        initial: {
            opacity: 0,
            y: 10,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: -10,
        },
        className: cn(open && 'text-fd-popover-foreground'),
    };
    return (_jsxs(CollapsibleTrigger, { className: cn('flex w-full h-8.5 items-center text-sm text-fd-muted-foreground gap-2.5 px-2 text-start focus-visible:outline-none [&_svg]:size-4', className), "data-toc-popover-trigger": "", ...props, children: [_jsx(ProgressCircle, { value: (items.findLastIndex((item) => item.active) + 1) / Math.max(1, items.length), max: 1, className: cn('shrink-0', open && 'text-fd-primary') }), _jsx(AnimatePresence, { mode: "wait", children: items[selectedIdx] && !open ? (_jsx(motion.span, { ...spanProps, children: items[selectedIdx].original.title }, selectedIdx)) : path ? (_jsx(motion.span, { ...spanProps, children: path.name }, path.$id ?? ':pathId')) : (_jsx(motion.span, { ...spanProps, children: t('On this page') }, ":toc")) }), _jsx(ChevronDown, { className: cn('ms-auto shrink-0 transition-transform', open && 'rotate-180') })] }));
}
function clamp(input, min, max) {
    if (input < min)
        return min;
    if (input > max)
        return max;
    return input;
}
function ProgressCircle({ value, strokeWidth = 1.5, size = 18, min = 0, max = 100, style, ...restSvgProps }) {
    const normalizedValue = clamp(value, min, max);
    const radius = size / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const progress = (normalizedValue / max) * circumference;
    const circleProps = {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: 'none',
        strokeWidth,
    };
    return (_jsxs("svg", { role: "progressbar", viewBox: `0 0 ${size} ${size}`, "aria-valuenow": normalizedValue, "aria-valuemin": min, "aria-valuemax": max, style: { width: size, height: size, ...style }, ...restSvgProps, children: [_jsx("circle", { ...circleProps, className: "stroke-current/25" }), _jsx("circle", { ...circleProps, stroke: "currentColor", strokeDasharray: circumference, strokeDashoffset: circumference - progress, strokeLinecap: "round", transform: `rotate(-90 ${size / 2} ${size / 2})`, className: "transition-all" })] }));
}
function PageTOCPopoverContent(props) {
    return (_jsx(CollapsibleContent, { "data-toc-popover-content": "", ...props, children: _jsx("div", { className: "flex flex-col px-2 max-h-[50vh]", children: props.children }) }));
}
