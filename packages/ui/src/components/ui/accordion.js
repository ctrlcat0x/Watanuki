'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Accordion as Primitive } from '@base-ui/react/accordion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
export function Accordion({ className, ...props }) {
    return (_jsx(Primitive.Root, { className: (s) => cn('divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card', typeof className === 'function' ? className(s) : className), ...props }));
}
export function AccordionItem({ children, ...props }) {
    return _jsx(Primitive.Item, { ...props, children: children });
}
export function AccordionHeader({ className, children, ...props }) {
    return (_jsx(Primitive.Header, { className: (s) => cn('scroll-m-24 not-prose flex flex-row items-center text-fd-card-foreground font-medium has-focus-visible:bg-fd-accent', typeof className === 'function' ? className(s) : className), ...props, children: children }));
}
export function AccordionTrigger({ className, children, ...props }) {
    return (_jsxs(Primitive.Trigger, { className: (s) => cn('group flex flex-1 items-center gap-2 px-3 py-2.5 text-start focus-visible:outline-none', typeof className === 'function' ? className(s) : className), ...props, children: [_jsx(ChevronRight, { className: "size-4 shrink-0 text-fd-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-90" }), children] }));
}
export function AccordionContent({ className, children, ...props }) {
    return (_jsx(Primitive.Panel, { className: (s) => cn('h-(--accordion-panel-height) overflow-hidden transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0', typeof className === 'function' ? className(s) : className), ...props, children: children }));
}
