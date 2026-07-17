import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollArea as Primitive } from '@base-ui/react/scroll-area';
import { cn } from '@/utils/cn';
export function ScrollArea({ children, ...props }) {
    return (_jsxs(Primitive.Root, { ...props, children: [children, _jsx(Primitive.Corner, {}), _jsx(ScrollBar, { orientation: "vertical" })] }));
}
export function ScrollViewport({ className, children, ...props }) {
    return (_jsx(Primitive.Viewport, { className: (s) => cn('size-full rounded-[inherit]', typeof className === 'function' ? className(s) : className), ...props, children: children }));
}
export function ScrollBar({ className, orientation = 'vertical', ...props }) {
    return (_jsx(Primitive.Scrollbar, { orientation: orientation, className: (s) => cn('flex select-none transition-opacity', !s.hovering && 'opacity-0', orientation === 'vertical' && 'h-full w-1.5', orientation === 'horizontal' && 'h-1.5 flex-col', typeof className === 'function' ? className(s) : className), ...props, children: _jsx(Primitive.Thumb, { className: "relative flex-1 rounded-full bg-fd-border" }) }));
}
