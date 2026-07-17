'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as Primitive from '@watanuki/core/toc';
import { cn } from '@/utils/cn';
export function TOCItems({ className, ...props }) {
    return _jsx("div", { className: cn('flex flex-col', className), ...props });
}
export function TOCEmpty() {
    return null;
}
const BASE = 12;
function getItemOffset(depth) {
    if (depth <= 2)
        return BASE;
    if (depth === 3)
        return BASE + 16;
    return BASE + 32;
}
export function TOCItem({ item, ...props }) {
    return (_jsx(Primitive.TOCItem, { href: item.url, ...props, className: cn('prose py-1.5 text-sm scroll-m-4 text-fd-muted-foreground/85 transition-colors wrap-anywhere hover:text-fd-foreground data-[active=true]:font-medium data-[active=true]:text-fd-primary', props.className), style: {
            paddingInlineStart: getItemOffset(item.depth),
            ...props.style,
        }, children: item.title }));
}
