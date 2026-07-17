'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, Languages, Sidebar as SidebarIcon } from 'lucide-react';
import { Fragment, useMemo, useRef, useState, } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { LinkItem } from '@/layouts/shared';
import { useNotebookLayout } from '../client';
import { isLayoutTabActive } from '@/layouts/shared';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { usePathname } from '@watanuki/core/framework';
import Link from '@watanuki/core/link';
export function Header(props) {
    const { slots, navItems, isNavTransparent, props: { tabMode, nav, tabs, sidebar }, } = useNotebookLayout();
    const { open } = slots.sidebar?.useSidebar?.() ?? {};
    const navMode = nav?.mode ?? 'auto';
    const sidebarCollapsible = sidebar.collapsible ?? true;
    const showLayoutTabs = tabMode === 'navbar' && tabs.length > 0;
    if (nav?.component)
        return nav.component;
    return (_jsxs("header", { id: "nd-subnav", "data-transparent": isNavTransparent && !open, ...props, className: cn('sticky [grid-area:header] flex flex-col top-(--fd-docs-row-1) z-10 backdrop-blur-sm transition-colors data-[transparent=false]:bg-fd-background/80 layout:[--fd-header-height:--spacing(14)]', showLayoutTabs && 'lg:layout:[--fd-header-height:--spacing(24)]', props.className), children: [_jsxs("div", { "data-header-body": "", className: "flex border-b px-4 gap-2 h-14 md:px-6", children: [_jsxs("div", { className: cn('items-center', navMode === 'top' && 'flex flex-1', navMode === 'auto' && 'hidden has-data-[collapsed=true]:md:flex max-md:flex'), children: [sidebarCollapsible && slots.sidebar && navMode === 'auto' && (_jsx(slots.sidebar.collapseTrigger, { className: cn(buttonVariants({
                                    color: 'ghost',
                                    size: 'icon-sm',
                                }), '-ms-1.5 text-fd-muted-foreground data-[collapsed=false]:hidden max-md:hidden'), children: _jsx(SidebarIcon, {}) })), slots.navTitle && (_jsx(slots.navTitle, { className: cn('inline-flex items-center gap-2.5 font-semibold', navMode === 'auto' && 'md:hidden') })), nav?.children] }), slots.searchTrigger && (_jsx(slots.searchTrigger.full, { hideIfDisabled: true, className: cn('w-full my-auto max-md:hidden', navMode === 'top' ? 'ps-2.5 rounded-xl max-w-sm' : 'max-w-[240px]') })), _jsxs("div", { className: "flex flex-1 items-center justify-end md:gap-2", children: [_jsx("div", { className: "flex items-center gap-6 empty:hidden max-lg:hidden", children: navItems
                                    .filter((item) => item.type !== 'icon')
                                    .map((item, i) => (_jsx(NavbarLinkItem, { item: item }, i))) }), navItems
                                .filter((item) => item.type === 'icon')
                                .map((item, i) => (_jsx(LinkItem, { item: item, className: cn(buttonVariants({ size: 'icon-sm', color: 'ghost' }), 'text-fd-muted-foreground max-lg:hidden'), "aria-label": item.label, children: item.icon }, i))), _jsxs("div", { className: "flex items-center md:hidden", children: [slots.searchTrigger && _jsx(slots.searchTrigger.sm, { hideIfDisabled: true, className: "p-2" }), slots.sidebar && (_jsx(slots.sidebar.trigger, { className: cn(buttonVariants({
                                            color: 'ghost',
                                            size: 'icon-sm',
                                            className: 'p-2 -me-1.5',
                                        })), children: _jsx(SidebarIcon, {}) }))] }), _jsxs("div", { className: "flex items-center gap-2 max-md:hidden", children: [slots.languageSelect && (_jsx(slots.languageSelect.root, { children: _jsx(Languages, { className: "size-4.5 text-fd-muted-foreground" }) })), slots.themeSwitch && _jsx(slots.themeSwitch, {}), sidebarCollapsible && slots.sidebar && navMode === 'top' && (_jsx(slots.sidebar.collapseTrigger, { className: cn(buttonVariants({
                                            color: 'secondary',
                                            size: 'icon-sm',
                                        }), 'text-fd-muted-foreground rounded-full -me-1.5'), children: _jsx(SidebarIcon, {}) }))] })] })] }), showLayoutTabs && (_jsx(LayoutHeaderTabs, { "data-header-tabs": "", className: "overflow-x-auto border-b px-6 h-10 max-lg:hidden", tabs: tabs }))] }));
}
function LayoutHeaderTabs({ tabs, className, ...props }) {
    const pathname = usePathname();
    const selectedIdx = useMemo(() => {
        return tabs.findLastIndex((option) => isLayoutTabActive(option, pathname));
    }, [tabs, pathname]);
    return (_jsx("div", { className: cn('flex flex-row items-end gap-6', className), ...props, children: tabs.map((option, i) => {
            const { title, url, unlisted, props: { className, ...rest } = {} } = option;
            const isSelected = selectedIdx === i;
            return (_jsx(Link, { href: url, className: cn('inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground', unlisted && !isSelected && 'hidden', isSelected && 'border-fd-primary text-fd-primary', className), ...rest, children: title }, i));
        }) }));
}
function NavbarLinkItem({ item, className, ...props }) {
    if (item.type === 'custom')
        return item.children;
    if (item.type === 'menu') {
        return _jsx(NavbarLinkItemMenu, { item: item, className: className, ...props });
    }
    return (_jsx(LinkItem, { item: item, className: cn('text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary', className), ...props, children: item.text }));
}
function NavbarLinkItemMenu({ item, hoverDelay = 50, className, ...props }) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);
    const freezeUntil = useRef(null);
    const delaySetOpen = (value) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        timeoutRef.current = window.setTimeout(() => {
            setOpen(value);
            freezeUntil.current = Date.now() + 300;
        }, hoverDelay);
    };
    const onPointerEnter = (e) => {
        if (e.pointerType === 'touch')
            return;
        delaySetOpen(true);
    };
    const onPointerLeave = (e) => {
        if (e.pointerType === 'touch')
            return;
        delaySetOpen(false);
    };
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    return (_jsxs(Popover, { open: open, onOpenChange: (value) => {
            if (freezeUntil.current === null || Date.now() >= freezeUntil.current)
                setOpen(value);
        }, children: [_jsxs(PopoverTrigger, { className: cn('inline-flex items-center gap-1.5 p-1 text-sm text-fd-muted-foreground transition-colors has-data-[active=true]:text-fd-primary data-[state=open]:text-fd-accent-foreground focus-visible:outline-none', className), onPointerEnter: onPointerEnter, onPointerLeave: onPointerLeave, ...props, children: [item.url ? _jsx(LinkItem, { item: item, children: item.text }) : item.text, _jsx(ChevronDown, { className: "size-3" })] }), _jsx(PopoverContent, { className: "flex flex-col p-1 text-fd-muted-foreground text-start", onPointerEnter: onPointerEnter, onPointerLeave: onPointerLeave, children: item.items.map((child, i) => {
                    if (child.type === 'custom')
                        return _jsx(Fragment, { children: child.children }, i);
                    return (_jsxs(LinkItem, { item: child, className: "inline-flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4", onClick: () => {
                            if (isTouchDevice())
                                setOpen(false);
                        }, children: [child.icon, child.text] }, i));
                }) })] }));
}
