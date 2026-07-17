'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Collapsible as Primitive } from '@base-ui/react/collapsible';
import { cn } from '@/utils/cn';
export const Collapsible = Primitive.Root;
export const CollapsibleTrigger = Primitive.Trigger;
export function CollapsibleContent({ children, className, ...props }) {
    return (_jsx(Primitive.Panel, { ...props, className: (s) => cn("overflow-hidden [&[hidden]:not([hidden='until-found'])]:hidden h-(--collapsible-panel-height) transition-[height,opacity] data-starting-style:opacity-0 data-starting-style:h-0 data-ending-style:h-0 data-ending-style:opacity-0", typeof className === 'function' ? className(s) : className), children: children }));
}
