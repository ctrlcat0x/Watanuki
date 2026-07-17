'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Primitive from '@watanuki/core/toc';
import { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import { cn } from '@/utils/cn';
import { useTOCItems } from '.';
import { mergeRefs } from '@/utils/merge-refs';
import { useTranslations } from '@fuma-translate/react';
export function TOCItems({ ref, className, children, ...props }) {
    const containerRef = useRef(null);
    const items = useTOCItems();
    const [svg, setSvg] = useState(null);
    const onPrint = useCallback(() => {
        const container = containerRef.current;
        if (!container || container.clientHeight === 0)
            return;
        if (items.length === 0) {
            setSvg(null);
            return;
        }
        let w = 0;
        let h = 0;
        let d = '';
        const positions = [];
        const output = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const element = container.querySelector(`a[href="${item.url}"]`);
            if (!element)
                continue;
            const styles = getComputedStyle(element);
            const x = getLineOffset(item.depth) + 0.5;
            const top = element.offsetTop + parseFloat(styles.paddingTop);
            const bottom = element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom);
            w = Math.max(x + 8, w);
            h = Math.max(h, bottom);
            if (i === 0) {
                d += ` M${x} ${top} L${x} ${bottom}`;
            }
            else {
                const [, upperBottom, upperX] = i > 0 ? positions[i - 1] : [0, 0, 0];
                d += ` L ${upperX} ${upperBottom} ${x} ${top} L${x} ${bottom}`;
            }
            if (item._step !== undefined) {
                output.push(_jsxs("g", { transform: `translate(${x}, ${(top + bottom) / 2})`, children: [_jsx("circle", { cx: "0", cy: "0", r: "8", className: "fill-fd-primary" }), _jsx("text", { cx: "0", cy: "0", textAnchor: "middle", alignmentBaseline: "central", dominantBaseline: "middle", className: "fill-fd-primary-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100", children: item._step })] }, i));
            }
            positions.push([top, bottom, x]);
        }
        output.unshift(_jsx("path", { d: d, className: "stroke-fd-primary", strokeWidth: "2", fill: "none" }, "path"));
        const itemLineLengths = [];
        setSvg({
            content: output,
            width: w,
            height: h,
            d,
            itemLineLengths,
            positions,
        });
    }, [items]);
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const observer = new ResizeObserver(onPrint);
        observer.observe(container);
        onPrint();
        return () => {
            observer.unobserve(container);
        };
    }, [onPrint]);
    return (_jsxs("div", { ref: mergeRefs(containerRef, ref), className: cn('relative flex flex-col', className), ...props, children: [svg && _jsx(ThumbTrack, { computed: svg }), children] }));
}
export function TOCEmpty() {
    const t = useTranslations({ note: 'table of contents' });
    return (_jsx("div", { className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground", children: t('No Headings') }));
}
function ThumbTrack({ computed }) {
    const ref = useRef(null);
    const tocInfo = Primitive.useTOC();
    function calculate(items) {
        const out = {};
        const startIdx = items.findIndex((item) => item.active);
        if (startIdx === -1)
            return out;
        const endIdx = items.findLastIndex((item) => item.active);
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        out['--track-top'] = `${computed.positions[middleIdx][0]}px`;
        out['--track-bottom'] = `${computed.positions[middleIdx][1]}px`;
        return out;
    }
    Primitive.useTOCListener((items) => {
        const element = ref.current;
        if (!element)
            return;
        for (const [k, v] of Object.entries(calculate(items))) {
            element.style.setProperty(k, v);
        }
    });
    return (_jsx("div", { ref: ref, className: "absolute top-0 inset-s-0 origin-center rtl:-scale-x-100", style: {
            width: computed.width,
            height: computed.height,
            ...calculate(tocInfo.get()),
        }, children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${computed.width} ${computed.height}`, className: "absolute transition-[clip-path]", style: {
                width: computed.width,
                height: computed.height,
                clipPath: `polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))`,
            }, children: computed.content }) }));
}
const BASE = 8;
function getItemOffset(depth) {
    if (depth <= 2)
        return 12 + BASE;
    if (depth === 3)
        return 24 + BASE;
    return 36 + BASE;
}
function getLineOffset(depth) {
    if (depth <= 2)
        return BASE;
    if (depth === 3)
        return 12 + BASE;
    return 24 + BASE;
}
export function TOCItem({ item, ...props }) {
    const items = useTOCItems();
    const itemStates = Primitive.useItems();
    const selectedUrl = useMemo(() => {
        const startIdx = itemStates.findIndex((entry) => entry.active);
        if (startIdx === -1)
            return null;
        const endIdx = itemStates.findLastIndex((entry) => entry.active);
        return itemStates[Math.floor((startIdx + endIdx) / 2)]?.original.url ?? null;
    }, [itemStates]);
    const { isFirst, isLast, svg } = useMemo(() => {
        const index = items.indexOf(item);
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        const l1 = getLineOffset(item.depth);
        const l0 = isFirst ? l1 : getLineOffset(items[index - 1].depth);
        const l2 = isLast ? l1 : getLineOffset(items[index + 1].depth);
        return {
            isFirst,
            isLast,
            svg: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: cn('absolute -top-1.5 inset-s-0 bottom-0 h-[calc(100%+--spacing(1.5))] -z-1 rtl:-scale-x-100', l1 !== l2 && 'h-full bottom-1.5'), style: {
                    width: Math.max(l0, l1) + 9,
                }, children: [l0 !== l1 && (_jsx("path", { d: `M ${l0 + 0.5} 0 L ${l0 + 0.5} 0 ${l1 + 0.5} 12`, stroke: "black", strokeWidth: "1", fill: "none", className: "stroke-fd-foreground/10" })), _jsx("line", { x1: l1 + 0.5, y1: l0 === l1 ? '6' : '12', x2: l1 + 0.5, y2: "100%", strokeWidth: "1", className: "stroke-fd-foreground/10" }), item._step !== undefined && (_jsxs("g", { transform: `translate(${l1 + 0.5}, ${l1 === l2 ? '3' : '6'})`, children: [_jsx("circle", { cx: "0", cy: "50%", r: "8", className: "fill-fd-muted" }), _jsx("text", { x: "0", y: "50%", textAnchor: "middle", alignmentBaseline: "central", dominantBaseline: "middle", className: "fill-fd-muted-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100", children: item._step })] }))] })),
        };
    }, [items, item]);
    return (_jsxs(Primitive.TOCItem, { href: item.url, ...props, "data-selected": selectedUrl === item.url, className: cn('prose relative py-1.5 text-sm scroll-m-4 text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere data-[selected=true]:text-fd-primary', isFirst && 'pt-0', isLast && 'pb-0', props.className), style: {
            paddingInlineStart: getItemOffset(item.depth),
            ...props.style,
        }, children: [svg, item.title] }));
}
