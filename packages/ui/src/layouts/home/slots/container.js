'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/utils/cn';
export function Container(props) {
    return (_jsx("main", { id: "nd-home-layout", ...props, className: cn('flex flex-1 flex-col [--fd-layout-width:1400px]', props.className) }));
}
