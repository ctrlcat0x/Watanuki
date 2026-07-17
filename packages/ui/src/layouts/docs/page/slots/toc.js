'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as Base from '@/components/toc';
import { resolveTOCStyle } from '@/components/toc/styles';
import { useTranslations } from '@fuma-translate/react';
import { cn } from '@/utils/cn';
import { ChevronDown, Text } from 'lucide-react';
import { createContext, use, useEffect, useEffectEvent, useMemo, useRef, useState, } from 'react';
import { useTreePath } from '@/contexts/tree';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
export function TOCProvider(props) {
    return _jsx(Base.TOCProvider, { ...props });
}
export function TOC({ container, header, footer, style = 'normal', list }) {
    const t = useTranslations({ note: 'table of contents' });
    const items = Base.useTOCItems();
    const { TOCItems, TOCEmpty, TOCItem } = resolveTOCStyle(style);
    if (items.length === 0 && !header && !footer) {
        return _jsx("div", { id: "nd-toc-placeholder", className: "hidden lg:layout:[--fd-toc-width:268px]" });
    }
    return (_jsxs("div", { id: "nd-toc", ...container, className: cn('sticky top-(--fd-docs-row-1) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] flex flex-col [grid-area:toc] w-(--fd-toc-width) pt-6 px-4 pb-2 lg:layout:[--fd-toc-width:268px] max-lg:hidden', container?.className), children: [header, _jsxs("h3", { id: "toc-title", className: "inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground", children: [_jsx(Text, { className: "size-4" }), t('On this page')] }), _jsx(Base.TOCScrollArea, { children: _jsxs(TOCItems, { ...list, children: [items.length === 0 && _jsx(TOCEmpty, {}), items.map((item) => (_jsx(TOCItem, { item: item }, item.url)))] }) }), footer] }));
}
const TocPopoverContext = createContext(null);
export function TOCPopover({ container, trigger, content, header, footer, style = 'normal', list, }) {
    const items = Base.useTOCItems();
    if (items.length === 0 && !header && !footer)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(TOCPopoverBar, { container: container, trigger: trigger, content: content, header: header, footer: footer, style: style, list: list }), _jsx(TOCFloatingIsland, { header: header, footer: footer, style: style, list: list })] }));
}
function TOCPopoverBar({ container, trigger, content, header, footer, style = 'normal', list, }) {
    const items = Base.useTOCItems();
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const { TOCItems, TOCItem, TOCEmpty } = resolveTOCStyle(style);
    const onClickOutside = useEffectEvent((e) => {
        if (!open || !(e.target instanceof HTMLElement))
            return;
        if (ref.current && !ref.current.contains(e.target))
            setOpen(false);
    });
    const onClickItem = () => setOpen(false);
    useEffect(() => {
        window.addEventListener('click', onClickOutside);
        return () => window.removeEventListener('click', onClickOutside);
    }, []);
    return (_jsx(TocPopoverContext, { value: useMemo(() => ({ open, setOpen }), [setOpen, open]), children: _jsx(Collapsible, { open: open, onOpenChange: setOpen, "data-toc-popover": "", ...container, className: cn('hidden', container?.className), children: _jsxs("header", { ref: ref, className: cn('border-b backdrop-blur-sm transition-colors'), children: [_jsx(PageTOCPopoverTrigger, { ...trigger }), _jsxs(PageTOCPopoverContent, { ...content, children: [header, _jsx(Base.TOCScrollArea, { children: _jsxs(TOCItems, { ...list, children: [items.length === 0 && _jsx(TOCEmpty, {}), items.map((item) => (_jsx(TOCItem, { item: item, onClick: onClickItem }, item.url)))] }) }), footer] })] }) }) }));
}
function TOCFloatingIsland({ header, footer, style = 'normal', list, }) {
    const items = Base.useTOCItems();
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const scrollProgress = useScrollProgress();
    const { TOCItems, TOCItem, TOCEmpty } = resolveTOCStyle(style);
    const onClickOutside = useEffectEvent((e) => {
        if (!open || !(e.target instanceof HTMLElement))
            return;
        if (ref.current && !ref.current.contains(e.target))
            setOpen(false);
    });
    const onClickItem = () => setOpen(false);
    useEffect(() => {
        window.addEventListener('click', onClickOutside);
        return () => window.removeEventListener('click', onClickOutside);
    }, []);
    if (items.length === 0 && !header && !footer)
        return null;
    return (_jsx("div", { ref: ref, "data-toc-island": "", className: "fixed top-4 inset-e-4 z-20 max-lg:block lg:hidden", children: _jsxs(Collapsible, { open: open, onOpenChange: setOpen, children: [_jsxs(CollapsibleTrigger, { "aria-label": "Table of contents", className: cn('flex max-w-[min(240px,calc(100vw-5rem))] items-center gap-2 rounded-xl border bg-fd-background/95 px-3 py-2 text-sm text-fd-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-fd-accent/50 focus-visible:outline-none', open && 'rounded-b-none border-b-transparent bg-fd-background shadow-lg'), children: [_jsx(ProgressCircle, { value: scrollProgress, max: 1, className: cn('shrink-0', open && 'text-fd-primary') }), _jsx(TOCFloatingIslandLabel, { open: open }), _jsx(ChevronDown, { className: cn('size-3.5 shrink-0 transition-transform', open && 'rotate-180') })] }), _jsx(CollapsibleContent, { className: cn('absolute inset-x-0 top-full rounded-b-lg border border-t-0 bg-fd-background shadow-lg'), children: _jsxs("div", { className: "flex max-h-[50vh] flex-col overflow-auto px-3 py-2", children: [header, _jsx(Base.TOCScrollArea, { children: _jsxs(TOCItems, { ...list, children: [items.length === 0 && _jsx(TOCEmpty, {}), items.map((item) => (_jsx(TOCItem, { item: item, onClick: onClickItem }, item.url)))] }) }), footer] }) })] }) }));
}
function TOCFloatingIslandLabel({ open }) {
    const t = useTranslations({ note: 'table of contents' });
    const items = Base.useItems();
    const selectedIdx = items.findIndex((item) => item.active);
    const showItem = selectedIdx !== -1 && !open;
    return (_jsxs("span", { className: "grid min-w-0 flex-1 *:col-start-1 *:row-start-1 *:my-auto", children: [_jsx("span", { className: cn('truncate transition-[opacity,translate,color]', open && 'text-fd-foreground', showItem && 'pointer-events-none -translate-y-full opacity-0'), children: t('On this page') }), _jsx("span", { className: cn('truncate transition-[opacity,translate]', !showItem && 'pointer-events-none translate-y-full opacity-0'), children: items[selectedIdx]?.original.title })] }));
}
function PageTOCPopoverTrigger({ className, ...props }) {
    const t = useTranslations({ note: 'table of contents' });
    const { open } = use(TocPopoverContext);
    const items = Base.useItems();
    const selectedIdx = items.findIndex((item) => item.active);
    const path = useTreePath().at(-1);
    const showItem = selectedIdx !== -1 && !open;
    return (_jsxs(CollapsibleTrigger, { className: cn('flex h-10 w-full items-center gap-2.5 px-4 py-2.5 text-start text-sm text-fd-muted-foreground focus-visible:outline-none [&_svg]:size-4 lg:px-6', className), "data-toc-popover-trigger": "", ...props, children: [_jsx(ProgressCircle, { value: (items.findLastIndex((item) => item.active) + 1) / Math.max(1, items.length), max: 1, className: cn('shrink-0', open && 'text-fd-primary') }), _jsxs("span", { className: "grid flex-1 *:col-start-1 *:row-start-1 *:my-auto", children: [_jsx("span", { className: cn('truncate transition-[opacity,translate,color]', open && 'text-fd-foreground', showItem && 'pointer-events-none -translate-y-full opacity-0'), children: path?.name ?? t('On this page') }), _jsx("span", { className: cn('truncate transition-[opacity,translate]', !showItem && 'pointer-events-none translate-y-full opacity-0'), children: items[selectedIdx]?.original.title })] }), _jsx(ChevronDown, { className: cn('mx-0.5 shrink-0 transition-transform', open && 'rotate-180') })] }));
}
function useScrollProgress(containerRef) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const el = containerRef?.current ?? document.getElementById('nd-page');
        if (!el)
            return;
        const onScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const max = scrollHeight - clientHeight;
            setProgress(max > 0 ? scrollTop / max : 0);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => el.removeEventListener('scroll', onScroll);
    }, [containerRef]);
    return progress;
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
    return (_jsx(CollapsibleContent, { "data-toc-popover-content": "", ...props, children: _jsx("div", { className: "flex max-h-[50vh] flex-col px-4 lg:px-6", children: props.children }) }));
}
