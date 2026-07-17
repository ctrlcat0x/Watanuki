'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTreePath, useTreeContext } from '@/contexts/tree';
import { cn } from '@/utils/cn';
import { getBreadcrumbItemsFromPath } from '@watanuki/core/breadcrumb';
import Link from '@watanuki/core/link';
import { ChevronRight } from 'lucide-react';
import { useMemo, Fragment } from 'react';
export function Breadcrumb({ includeRoot, includeSeparator, includePage, ...props }) {
    const path = useTreePath();
    const { root } = useTreeContext();
    const items = useMemo(() => {
        return getBreadcrumbItemsFromPath(root, path, {
            includePage,
            includeSeparator,
            includeRoot,
        });
    }, [includePage, includeRoot, includeSeparator, path, root]);
    if (items.length === 0)
        return null;
    return (_jsx("div", { ...props, className: cn('flex items-center gap-1.5 text-sm text-fd-muted-foreground', props.className), children: items.map((item, i) => {
            const className = cn('truncate', i === items.length - 1 && 'text-fd-primary font-medium');
            return (_jsxs(Fragment, { children: [i !== 0 && _jsx(ChevronRight, { className: "size-3.5 shrink-0" }), item.url ? (_jsx(Link, { href: item.url, className: cn(className, 'transition-opacity hover:opacity-80'), children: item.name })) : (_jsx("span", { className: className, children: item.name }))] }, i));
        }) }));
}
