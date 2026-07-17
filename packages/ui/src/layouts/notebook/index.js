import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { getLayoutTabs, } from '@/layouts/shared';
import { LayoutBody } from './client';
export function DocsLayout({ tree, tabMode = 'sidebar', sidebar: { tabs: defaultTabs, ...sidebarProps } = {}, children, tabs = defaultTabs, ...props }) {
    const resolvedTabs = useMemo(() => {
        if (Array.isArray(tabs)) {
            return tabs;
        }
        if (typeof tabs === 'object') {
            return getLayoutTabs(tree, tabs);
        }
        if (tabs !== false) {
            return getLayoutTabs(tree);
        }
        return [];
    }, [tabs, tree]);
    return (_jsx(LayoutBody, { tree: tree, tabs: resolvedTabs, tabMode: tabMode, sidebar: sidebarProps, ...props, children: children }));
}
export { useNotebookLayout } from './client';
