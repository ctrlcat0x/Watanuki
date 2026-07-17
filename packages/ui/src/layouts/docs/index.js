import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { getLayoutTabs, } from '@/layouts/shared';
import { LayoutBody } from './client';
export function DocsLayout({ tree, sidebar: { tabs: _tabs, tabMode: _tabMode, ...sidebarProps } = {}, tabs: layoutTabs = _tabs, tabMode = _tabMode, children, ...props }) {
    const tabs = useMemo(() => {
        if (Array.isArray(layoutTabs)) {
            return layoutTabs;
        }
        if (typeof layoutTabs === 'object') {
            return getLayoutTabs(tree, layoutTabs);
        }
        if (layoutTabs !== false) {
            return getLayoutTabs(tree);
        }
        return [];
    }, [tree, layoutTabs]);
    return (_jsx(LayoutBody, { tree: tree, tabs: tabs, tabMode: tabMode, sidebar: sidebarProps, ...props, children: children }));
}
export { useDocsLayout } from './client';
