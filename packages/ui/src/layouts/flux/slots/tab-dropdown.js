'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import Link from '@watanuki/core/link';
import { usePathname } from '@watanuki/core/framework';
import { cn } from '@/utils/cn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AnimatePresence, motion } from 'motion/react';
import { isLayoutTabActive } from '../../shared';
export function TabDropdown({ tabs, placeholder, className, ...props }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const selectedIdx = useMemo(() => {
        return tabs.findLastIndex((item) => isLayoutTabActive(item, pathname));
    }, [tabs, pathname]);
    const selected = selectedIdx !== -1 ? tabs[selectedIdx] : undefined;
    const onClick = () => {
        setOpen(false);
    };
    const item = selected ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "size-4.5 shrink-0 empty:hidden", children: selected.icon }), _jsx("p", { className: "font-medium", children: selected.title })] })) : (placeholder);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [item && (_jsxs(PopoverTrigger, { className: cn('flex items-center gap-2 rounded-xl overflow-hidden p-1.5 border shadow-sm text-sm text-start transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground', className), ...props, children: [_jsx(AnimatePresence, { mode: "popLayout", children: _jsx(motion.span, { className: "flex w-full min-w-0 overflow-hidden items-center text-nowrap gap-1.5", initial: {
                                opacity: 0,
                                y: '100%',
                            }, animate: {
                                opacity: 1,
                                y: 0,
                            }, exit: {
                                opacity: 0,
                                y: '-100%',
                            }, children: item }, selectedIdx) }), _jsx(ChevronsUpDown, { className: "shrink-0 ms-auto size-4 text-fd-muted-foreground" })] })), _jsx(PopoverContent, { align: "start", className: "flex flex-col gap-1 max-w-svw p-1 fd-scroll-container", children: tabs.map((item, i) => {
                    const isActive = i === selectedIdx;
                    if (!isActive && item.unlisted)
                        return;
                    return (_jsxs(Link, { href: item.url, onClick: onClick, ...item.props, className: cn('flex items-center gap-1.5 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground', item.props?.className), children: [_jsx("div", { className: "shrink-0 mb-auto size-4.5 empty:hidden", children: item.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium leading-none", children: item.title }), _jsx("p", { className: "text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden", children: item.description })] }), _jsx(Check, { className: cn('shrink-0 ms-auto size-3.5 text-fd-primary', !isActive && 'invisible') })] }, item.url));
                }) })] }));
}
