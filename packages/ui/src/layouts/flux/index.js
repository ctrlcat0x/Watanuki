'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { baseSlots, getLayoutTabs, useLinkItems, } from '@/layouts/shared';
import { TreeContextProvider } from '@/contexts/tree';
import { createContext, use, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { TabDropdown } from './slots/tab-dropdown';
import { buttonVariants } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { LinkItem } from '@/layouts/shared';
import { motion } from 'motion/react';
import { RemoveScroll } from 'react-remove-scroll';
import { useSearchContext } from '@/contexts/search';
import { SidebarProvider, Sidebar, SidebarTrigger, useSidebar, } from './slots/sidebar';
import { Container } from './slots/container';
const LayoutContext = createContext(null);
export function useFluxLayout() {
    const context = use(LayoutContext);
    if (!context)
        throw new Error('Please use Flux layout components under <DocsLayout /> (`@watanuki/ui/layouts/flux`).');
    return context;
}
const { useProvider } = baseSlots({
    useProps() {
        return useFluxLayout().props;
    },
});
export function DocsLayout(props) {
    const { tree, nav = {}, sidebar: { enabled: sidebarEnabled = true, tabs: _tabs, defaultOpenLevel, prefetch, ...sidebarProps } = {}, tabs: defaultTabs = _tabs, children, containerProps, renderNavigationPanel = (props) => _jsx(NavigationPanel, { ...props }), slots: defaultSlots = {}, } = props;
    const linkItems = useLinkItems(props);
    const { baseSlots, baseProps } = useProvider(props);
    const tabs = useMemo(() => {
        if (Array.isArray(defaultTabs)) {
            return defaultTabs;
        }
        if (typeof defaultTabs === 'object') {
            return getLayoutTabs(tree, defaultTabs);
        }
        if (defaultTabs !== false) {
            return getLayoutTabs(tree);
        }
        return [];
    }, [tree, defaultTabs]);
    const slots = {
        ...baseSlots,
        container: defaultSlots.container ?? Container,
        tabDropdown: defaultSlots.tabDropdown ?? TabDropdown,
        sidebar: defaultSlots.sidebar ?? {
            root: Sidebar,
            provider: SidebarProvider,
            trigger: SidebarTrigger,
            useSidebar,
        },
    };
    return (_jsx(LayoutContext, { value: {
            props: baseProps,
            slots,
            ...linkItems,
        }, children: _jsxs(TreeContextProvider, { tree: tree, children: [_jsx(slots.sidebar.provider, { defaultOpenLevel: defaultOpenLevel, prefetch: prefetch, children: _jsxs(slots.container, { ...containerProps, children: [sidebarEnabled && _jsx(slots.sidebar.root, { ...sidebarProps }), children] }) }), renderNavigationPanel({
                    head: (_jsxs(_Fragment, { children: [slots.navTitle && (_jsx(slots.navTitle, { className: "inline-flex items-center gap-2.5 text-sm font-semibold" })), nav.children] })),
                    tabDropdown: slots.tabDropdown && tabs.length > 0 && (_jsx(slots.tabDropdown, { className: "flex-1", tabs: tabs })),
                    tool: (_jsxs(_Fragment, { children: [slots.languageSelect && (_jsx(slots.languageSelect.root, { children: _jsx(Languages, { className: "size-4.5" }) })), slots.searchTrigger && (_jsx(slots.searchTrigger.sm, { hideIfDisabled: true, className: "rounded-lg" })), slots.sidebar && (_jsx(slots.sidebar.trigger, { className: cn(buttonVariants({
                                    variant: 'ghost',
                                    size: 'icon-sm',
                                    className: 'overflow-hidden',
                                })) })), slots.themeSwitch && (_jsx(slots.themeSwitch, { className: "p-1 h-full ms-1 rounded-xl bg-fd-muted *:rounded-lg" }))] })),
                    link: linkItems.menuItems
                        .filter((item) => item.type === 'icon')
                        .map((item, i) => (_jsx(LinkItem, { item: item, className: cn(buttonVariants({ size: 'icon-sm', color: 'ghost' })), "aria-label": item.label, children: item.icon }, i))),
                })] }) }));
}
export function NavigationPanel({ head, tabDropdown, tool, link, children = (v) => v, ...props }) {
    const { open } = useSearchContext();
    return (_jsx(motion.div, { ...props, className: cn('fixed left-1/2 w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] translate-x-[calc(-50%-var(--removed-body-scroll-bar-size,0px)/2)] bottom-0 z-40 bg-fd-popover text-fd-popover-foreground border-t shadow-lg sm:bottom-6 sm:rounded-2xl sm:border sm:max-w-[380px]', props.className), animate: props.animate ?? {
            scale: open ? 0.9 : 1,
            translateY: open ? 20 : 0,
            opacity: open ? 0.8 : 1,
        }, children: children(_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-row items-center ps-2.5 p-1 gap-2 min-h-11", children: [head, _jsx("div", { id: "flux-layout-slot", className: "flex-1" })] }), _jsxs("div", { className: "flex flex-row gap-1.5 overflow-x-auto overflow-y-hidden p-2 sm:p-1", children: [_jsx("div", { className: "flex flex-row items-center gap-2 min-w-0 flex-1", children: tabDropdown }), _jsx("div", { className: "flex flex-row items-center text-fd-muted-foreground border-x px-0.5 empty:hidden", children: link }), _jsx("div", { className: "flex flex-row items-center text-fd-muted-foreground empty:hidden", children: tool })] })] })) }));
}
export function NavigationPanelOverlay({ enabled = false, className, ...props }) {
    return (_jsx(RemoveScroll, { enabled: enabled, children: _jsx(motion.div, { className: cn('fixed inset-0 z-30 pr-(--removed-body-scroll-bar-size,0) backdrop-blur-md bg-fd-background/60', !enabled && 'pointer-events-none', className), initial: "hide", variants: {
                show: {
                    opacity: 1,
                },
                hide: {
                    opacity: 0,
                },
            }, animate: enabled ? 'show' : 'hide', exit: "hide", ...props }) }));
}
