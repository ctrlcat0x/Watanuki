'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Popover as Primitive } from '@base-ui/react/popover';
import { cn } from '@/utils/cn';
export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export function PopoverContent({ className, align = 'center', sideOffset = 4, side = 'bottom', matchAnchor = false, ...props }) {
    return (_jsx(Primitive.Portal, { children: _jsx(Primitive.Positioner, { align: align, side: side, sideOffset: sideOffset, className: cn('z-50', matchAnchor && 'box-border w-(--anchor-width) min-w-(--anchor-width) max-w-(--anchor-width)'), children: _jsx(Primitive.Popup, { className: (s) => cn('z-50 box-border origin-(--transform-origin) overflow-y-auto max-h-(--available-height) rounded-xl border bg-fd-popover/60 backdrop-blur-lg p-2 text-sm text-fd-popover-foreground shadow-lg focus-visible:outline-none data-[closed]:animate-fd-popover-out data-[open]:animate-fd-popover-in', matchAnchor ? 'w-full min-w-0' : 'min-w-[240px] max-w-[98vw]', typeof className === 'function' ? className(s) : className), ...props }) }) }));
}
export const PopoverClose = Primitive.Close;
