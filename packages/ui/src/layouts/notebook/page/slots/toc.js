'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Base from '@/components/toc';
import { resolveTOCStyle } from '@/components/toc/styles';
import { useTranslations } from '@fuma-translate/react';
import { cn } from '@/utils/cn';
import { ChevronDown, Text } from 'lucide-react';
import { createContext, use, useEffect, useEffectEvent, useMemo, useRef, useState, } from 'react';
import { useTreePath } from '@/contexts/tree';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useNotebookLayout } from '@/layouts/notebook/client';
export function TOCProvider(props) {
    return _jsx(Base.TOCProvider, { ...props });
}
export function TOC({ container, header, footer, style = 'normal', list }) {
    const t = useTranslations({ note: 'table of contents' });
    const items = Base.useTOCItems();
    const { TOCItems, TOCEmpty, TOCItem } = resolveTOCStyle(style);
    if (items.length === 0 && !footer && !header) {
        return _jsx("div", { id: "nd-toc-placeholder", className: "hidden xl:layout:[--fd-toc-width:268px]" });
    }
    return (_jsxs("div", { id: "nd-toc", ...container, className: cn('sticky top-(--fd-docs-row-3) [grid-area:toc] h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))] flex flex-col w-(--fd-toc-width) pt-6 px-4 pb-2 xl:layout:[--fd-toc-width:268px] max-xl:hidden', container?.className), children: [header, _jsxs("h3", { id: "toc-title", className: "inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground", children: [_jsx(Text, { className: "size-4" }), t('On this page')] }), _jsx(Base.TOCScrollArea, { children: _jsxs(TOCItems, { ...list, children: [items.length === 0 && _jsx(TOCEmpty, {}), items.map((item) => (_jsx(TOCItem, { item: item }, item.url)))] }) }), footer] }));
}
const TocPopoverContext = createContext(null);
export function TOCPopover({ container, trigger, content, header, footer, style = 'normal', list, }) {
    const items = Base.useTOCItems();
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const { isNavTransparent } = useNotebookLayout();
    const { TOCItems, TOCItem, TOCEmpty } = resolveTOCStyle(style);
    const onClickOutside = useEffectEvent((e) => {
        if (!open || !(e.target instanceof HTMLElement))
            return;
        if (ref.current && !ref.current.contains(e.target))
            setOpen(false);
    });
    const onClickItem = () => {
        setOpen(false);
    };
    useEffect(() => {
        window.addEventListener('click', onClickOutside);
        return () => {
            window.removeEventListener('click', onClickOutside);
        };
    }, []);
    return (_jsx(TocPopoverContext, { value: useMemo(() => ({
            open,
            setOpen,
        }), [setOpen, open]), children: _jsx(Collapsible, { open: open, onOpenChange: setOpen, "data-toc-popover": "", ...container, className: cn('sticky top-(--fd-docs-row-2) z-10 [grid-area:toc-popover] h-(--fd-toc-popover-height) xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(10)]', container?.className), children: _jsxs("header", { ref: ref, className: cn('border-b backdrop-blur-sm transition-colors', (!isNavTransparent || open) && 'bg-fd-background/80', open && 'shadow-lg'), children: [_jsx(PageTOCPopoverTrigger, { ...trigger }), _jsxs(PageTOCPopoverContent, { ...content, children: [header, _jsx(Base.TOCScrollArea, { children: _jsxs(TOCItems, { ...list, children: [items.length === 0 && _jsx(TOCEmpty, {}), items.map((item) => (_jsx(TOCItem, { item: item, onClick: onClickItem }, item.url)))] }) }), footer] })] }) }) }));
}
function PageTOCPopoverTrigger({ className, ...props }) {
    const t = useTranslations({ note: 'table of contents' });
    const { open } = use(TocPopoverContext);
    const items = Base.useItems();
    const selectedIdx = items.findIndex((item) => item.active);
    const path = useTreePath().at(-1);
    const showItem = selectedIdx !== -1 && !open;
    return (_jsxs(CollapsibleTrigger, { className: cn('flex w-full h-10 items-center text-sm text-fd-muted-foreground gap-2.5 px-4 py-2.5 text-start focus-visible:outline-none [&_svg]:size-4 md:px-6', className), "data-toc-popover-trigger": "", ...props, children: [_jsx(ProgressCircle, { value: (items.findLastIndex((item) => item.active) + 1) / Math.max(1, items.length), max: 1, className: cn('shrink-0', open && 'text-fd-primary') }), _jsxs("span", { className: "grid flex-1 *:my-auto *:row-start-1 *:col-start-1", children: [_jsx("span", { className: cn('truncate transition-[opacity,translate,color]', open && 'text-fd-foreground', showItem && 'opacity-0 -translate-y-full pointer-events-none'), children: path?.name ?? t('On this page') }), _jsx("span", { className: cn('truncate transition-[opacity,translate]', !showItem && 'opacity-0 translate-y-full pointer-events-none'), children: items[selectedIdx]?.original.title })] }), _jsx(ChevronDown, { className: cn('shrink-0 transition-transform mx-0.5', open && 'rotate-180') })] }));
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
    return (_jsx(CollapsibleContent, { "data-toc-popover-content": "", ...props, children: _jsx("div", { className: "flex flex-col px-4 max-h-[50vh] md:px-6", children: props.children }) }));
}
