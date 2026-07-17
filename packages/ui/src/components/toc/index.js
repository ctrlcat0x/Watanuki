'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as Primitive from '@watanuki/core/toc';
import { createContext, use, useRef } from 'react';
import { cn } from '@/utils/cn';
import { mergeRefs } from '@/utils/merge-refs';
const TOCContext = createContext([]);
export function useTOCItems() {
    return use(TOCContext);
}
export const { useActiveAnchor, useActiveAnchors, useItems } = Primitive;
export function TOCProvider({ toc, children, ...props }) {
    return (_jsx(TOCContext, { value: toc, children: _jsx(Primitive.AnchorProvider, { toc: toc, ...props, children: children }) }));
}
export function TOCScrollArea({ ref, className, ...props }) {
    const viewRef = useRef(null);
    return (_jsx("div", { ref: mergeRefs(viewRef, ref), className: cn('relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3', className), ...props, children: _jsx(Primitive.ScrollProvider, { containerRef: viewRef, children: props.children }) }));
}
