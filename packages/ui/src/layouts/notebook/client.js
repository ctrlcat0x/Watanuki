'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, use } from 'react';
import { useIsScrollTop } from '@/utils/use-is-scroll-top';
import { baseSlots, useLinkItems, } from '../shared';
import { TreeContextProvider } from '@/contexts/tree';
import { Container } from './slots/container';
import { Sidebar, SidebarCollapseTrigger, SidebarProvider, SidebarTrigger, useSidebar, } from './slots/sidebar';
import { Header } from './slots/header';
const { useProvider } = baseSlots({
    useProps() {
        return useNotebookLayout().props;
    },
});
const LayoutContext = createContext(null);
export function useNotebookLayout() {
    const context = use(LayoutContext);
    if (!context)
        throw new Error('Please use <DocsPage /> (`@watanuki/ui/layouts/notebook/page`) under <DocsLayout /> (`@watanuki/ui/layouts/notebook`).');
    return context;
}
export function LayoutBody(props) {
    const { nav: { enabled: navEnabled = true, transparentMode: navTransparentMode = 'none' } = {}, sidebar: { defaultOpenLevel, prefetch, ...sidebarProps } = {}, slots: defaultSlots, tabMode = 'sidebar', tabs, tree, containerProps, children, } = props;
    const isTop = useIsScrollTop({ enabled: navTransparentMode === 'top' }) ?? true;
    const isNavTransparent = navTransparentMode === 'top' ? isTop : navTransparentMode === 'always';
    const { baseSlots, baseProps } = useProvider(props);
    const linkItems = useLinkItems(props);
    const slots = {
        ...baseSlots,
        header: defaultSlots?.header ?? Header,
        container: defaultSlots?.container ?? Container,
        sidebar: defaultSlots?.sidebar ?? {
            provider: SidebarProvider,
            root: Sidebar,
            trigger: SidebarTrigger,
            collapseTrigger: SidebarCollapseTrigger,
            useSidebar,
        },
    };
    return (_jsx(TreeContextProvider, { tree: tree, children: _jsx(LayoutContext, { value: {
                props: {
                    tabs,
                    tabMode,
                    sidebar: sidebarProps,
                    ...baseProps,
                },
                isNavTransparent,
                slots,
                ...linkItems,
            }, children: _jsx(slots.sidebar.provider, { defaultOpenLevel: defaultOpenLevel, prefetch: prefetch, children: _jsxs(slots.container, { ...containerProps, children: [navEnabled && _jsx(slots.header, {}), _jsx(slots.sidebar.root, { ...sidebarProps }), children] }) }) }) }));
}
