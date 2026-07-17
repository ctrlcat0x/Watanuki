'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/utils/cn';
export function Container(props) {
    return (_jsx("div", { id: "nd-flux-layout", ...props, className: cn('flex flex-col items-center pb-24 overflow-x-clip', props.className) }));
}
