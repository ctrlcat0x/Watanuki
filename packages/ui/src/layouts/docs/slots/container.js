'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { useDocsLayout } from '..';
export function Container(props) {
    const { slots } = useDocsLayout();
    const { collapsed } = slots.sidebar?.useSidebar?.() ?? {};
    const [previousCollapsed, setPreviousCollapsed] = useState(collapsed);
    const isCollapseChanged = previousCollapsed !== collapsed;
    useEffect(() => {
        if (isCollapseChanged)
            setPreviousCollapsed(collapsed);
    }, [collapsed, isCollapseChanged]);
    return (_jsx("div", { id: "nd-docs-layout", "data-sidebar-collapsed": collapsed, "data-column-changed": isCollapseChanged, ...props, style: {
            '--fd-docs-row-1': 'var(--fd-banner-height, 0px)',
            '--fd-docs-row-2': 'calc(var(--fd-docs-row-1) + var(--fd-header-height))',
            '--fd-docs-row-3': 'calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))',
            '--fd-sidebar-col': collapsed ? '0px' : 'var(--fd-sidebar-width)',
            ...props.style,
        }, className: cn('overflow-x-clip min-h-(--fd-docs-height) [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-toc-popover-height:0px] max-lg:[--fd-sidebar-width:0px] max-lg:[--fd-toc-width:0px] data-[column-changed=true]:transition-[grid-template-columns]', props.className), children: props.children }));
}
