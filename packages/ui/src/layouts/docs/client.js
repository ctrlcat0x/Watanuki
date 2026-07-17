'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, use, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { usePathname } from '@watanuki/core/framework';
import Link from '@watanuki/core/link';
import { useIsScrollTop } from '@/utils/use-is-scroll-top';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar, } from './slots/sidebar';
import { baseSlots, isLayoutTabActive, useLinkItems, } from '../shared';
import { TreeContextProvider } from '@/contexts/tree';
import { Header } from './slots/header';
import { Container } from './slots/container';
import { SidebarFab } from './slots/sidebar-fab';
import { useWatanukiStyle } from '@watanuki/theme/react';
const { useProvider } = baseSlots({
    useProps() {
        return useDocsLayout().props;
    },
});
const LayoutContext = createContext(null);
export function useIsDocsLayout() {
    return use(LayoutContext) !== null;
}
export function useDocsLayout() {
    const context = use(LayoutContext);
    if (!context)
        throw new Error('Please use <DocsPage /> (`@watanuki/ui/layouts/docs/page`) under <DocsLayout /> (`@watanuki/ui/layouts/docs`).');
    return context;
}
export function LayoutBody(props) {
    const { nav: { enabled: navEnabled = true, transparentMode: navTransparentMode = 'none' } = {}, sidebar: { enabled: sidebarEnabled = true, defaultOpenLevel, prefetch, ...sidebarProps } = {}, slots: defaultSlots, tabs, tabMode = 'auto', tree, containerProps, children, } = props;
    const isTop = useIsScrollTop({ enabled: navTransparentMode === 'top' }) ?? true;
    const isNavTransparent = navTransparentMode === 'top' ? isTop : navTransparentMode === 'always';
    const style = useWatanukiStyle();
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
            useSidebar: useSidebar,
        },
    };
    return (_jsx(TreeContextProvider, { tree: tree, children: _jsx(LayoutContext, { value: {
                props: {
                    tabMode,
                    tabs,
                    ...baseProps,
                },
                isNavTransparent,
                slots,
                ...linkItems,
            }, children: _jsx(slots.sidebar.provider, { defaultOpenLevel: defaultOpenLevel, prefetch: prefetch, children: _jsxs(slots.container, { ...containerProps, children: [navEnabled && _jsx(slots.header, {}), sidebarEnabled && _jsx(slots.sidebar.root, { ...sidebarProps }), sidebarEnabled && style === 'modern' && _jsx(SidebarFab, {}), tabMode === 'top' && tabs.length > 0 && (_jsx(LayoutTabs, { tabs: tabs, className: "z-10 bg-fd-background border-b px-6 pt-3 lg:px-8 max-lg:hidden" })), children] }) }) }) }));
}
function LayoutTabs({ tabs, ...props }) {
    const pathname = usePathname();
    const selected = useMemo(() => {
        return tabs.findLast((option) => isLayoutTabActive(option, pathname));
    }, [tabs, pathname]);
    return (_jsx("div", { ...props, className: cn('flex flex-row items-end gap-6 overflow-auto [grid-area:main]', props.className), children: tabs.map((tab, i) => (_jsx(Link, { href: tab.url, className: cn('inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground', tab.unlisted && selected !== tab && 'hidden', selected === tab && 'border-fd-primary text-fd-primary'), children: tab.title }, i))) }));
}
