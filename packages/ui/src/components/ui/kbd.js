import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/utils/cn';
export function Kbd({ className, ...props }) {
    return (_jsx("kbd", { className: cn('inline-flex h-5 min-w-5 items-center justify-center rounded border bg-fd-background px-1 font-mono text-[0.625rem] font-medium text-fd-muted-foreground [&_svg]:size-2.5', className), ...props }));
}
export function KbdGroup({ className, ...props }) {
    return _jsx("div", { className: cn('inline-flex items-center gap-0.5', className), ...props });
}
