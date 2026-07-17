'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { cn } from '@/utils/cn';
import { useTranslations } from '@fuma-translate/react';
export function InlineTOC({ items, className, ...props }) {
    const t = useTranslations({ note: 'inline table of contents' });
    return (_jsxs(Collapsible, { ...props, className: (s) => cn('not-prose rounded-lg border bg-fd-card text-fd-card-foreground', typeof className === 'function' ? className(s) : className), children: [_jsxs(CollapsibleTrigger, { className: "group inline-flex w-full items-center justify-between px-4 py-2.5 font-medium", children: [props.children ?? t('Table of Contents'), _jsx(ChevronDown, { className: "size-4 transition-transform duration-200 group-data-open:rotate-180" })] }), _jsx(CollapsibleContent, { children: _jsx("div", { className: "flex flex-col p-4 pt-0 text-sm text-fd-muted-foreground", children: items.map((item) => (_jsx("a", { href: item.url, className: "border-s py-1.5 hover:text-fd-accent-foreground", style: {
                            paddingInlineStart: 12 * Math.max(item.depth - 1, 0),
                        }, children: item.title }, item.url))) }) })] }));
}
