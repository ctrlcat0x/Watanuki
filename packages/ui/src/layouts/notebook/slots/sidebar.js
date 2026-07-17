'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as Base from '@/components/sidebar/base';
import { cn } from '@/utils/cn';
import { createElement, useMemo, useRef, useState, } from 'react';
import { cva } from 'class-variance-authority';
import { createPageTreeRenderer, } from '@/components/sidebar/page-tree';
import { createLinkItemRenderer } from '@/components/sidebar/link-item';
import { buttonVariants } from '@/components/ui/button';
import { mergeRefs } from '@/utils/merge-refs';
import { LinkItem } from '@/layouts/shared';
import { Check, ChevronsUpDown, Languages, SidebarIcon, X } from 'lucide-react';
import { useNotebookLayout } from '../client';
import { isLayoutTabActive } from '@/layouts/shared';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { usePathname } from '@watanuki/core/framework';
import Link from '@watanuki/core/link';
const itemVariants = cva('relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            link: 'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors',
            button: 'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
        },
        highlight: {
            true: "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:start-2.5",
        },
    },
});
function getItemOffset(depth) {
    return `calc(${2 + 3 * depth} * var(--spacing))`;
}
export const { useSidebar } = Base;
export function SidebarProvider(props) {
    return _jsx(Base.SidebarProvider, { ...props });
}
export function SidebarTrigger(props) {
    return _jsx(Base.SidebarTrigger, { ...props });
}
export function SidebarCollapseTrigger(props) {
    return _jsx(Base.SidebarCollapseTrigger, { ...props });
}
function SidebarContent({ ref: refProp, className, children, ...props }) {
    const { props: { nav }, } = useNotebookLayout();
    const navMode = nav?.mode ?? 'auto';
    const ref = useRef(null);
    return (_jsx(Base.SidebarContent, { children: ({ collapsed, hovered, ref: asideRef, ...rest }) => (_jsxs("div", { "data-sidebar-placeholder": "", className: cn('sticky z-20 [grid-area:sidebar] pointer-events-none *:pointer-events-auto md:layout:[--fd-sidebar-width:268px] max-md:hidden', navMode === 'auto'
                ? 'top-(--fd-docs-row-1) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))]'
                : 'top-(--fd-docs-row-2) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-2))]'), children: [collapsed && _jsx("div", { className: "absolute start-0 inset-y-0 w-4", ...rest }), _jsx("aside", { id: "nd-sidebar", ref: mergeRefs(ref, refProp, asideRef), "data-collapsed": collapsed, "data-hovered": collapsed && hovered, className: cn('absolute flex flex-col w-full start-0 inset-y-0 items-end text-sm duration-250 *:w-(--fd-sidebar-width)', navMode === 'auto' && 'bg-fd-card border-e', collapsed && [
                        'inset-y-2 rounded-xl bg-fd-card transition-transform border w-(--fd-sidebar-width)',
                        hovered
                            ? 'shadow-lg translate-x-2 rtl:-translate-x-2'
                            : '-translate-x-(--fd-sidebar-width) rtl:translate-x-full',
                    ], ref.current &&
                        (ref.current.getAttribute('data-collapsed') === 'true') !== collapsed &&
                        'transition-[width,inset-block,translate,background-color]', className), ...props, ...rest, children: children })] })) }));
}
function SidebarDrawer({ children, className, ...props }) {
    return (_jsxs(_Fragment, { children: [_jsx(Base.SidebarDrawerOverlay, { className: "fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" }), _jsx(Base.SidebarDrawerContent, { className: cn('fixed text-[0.9375rem] flex flex-col shadow-lg border-s end-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out', className), ...props, children: children })] }));
}
function SidebarFolder(props) {
    return _jsx(Base.SidebarFolder, { ...props });
}
function SidebarSeparator({ className, style, children, ...props }) {
    const depth = Base.useFolderDepth();
    return (_jsx(Base.SidebarSeparator, { className: cn('inline-flex items-center gap-2 mb-1.5 px-2 mt-6 empty:mb-0 text-xs font-medium text-fd-muted-foreground/70 [&_svg]:size-3.5 [&_svg]:shrink-0', depth === 0 && 'first:mt-0', className), style: {
            paddingInlineStart: getItemOffset(depth),
            ...style,
        }, ...props, children: children }));
}
function SidebarItem({ className, style, children, ...props }) {
    const depth = Base.useFolderDepth();
    return (_jsx(Base.SidebarItem, { className: cn(itemVariants({ variant: 'link', highlight: depth >= 1 }), className), style: {
            paddingInlineStart: getItemOffset(depth),
            ...style,
        }, ...props, children: children }));
}
function SidebarFolderTrigger({ className, style, ...props }) {
    const { depth, collapsible, active } = Base.useFolder();
    return (_jsx(Base.SidebarFolderTrigger, { "data-active": active, className: (state) => cn(itemVariants({ variant: collapsible ? 'button' : null }), 'w-full', active && 'bg-fd-primary/10 text-fd-primary', typeof className === 'function' ? className(state) : className), style: {
            paddingInlineStart: getItemOffset(depth - 1),
            ...style,
        }, ...props, children: props.children }));
}
function SidebarFolderLink({ className, style, ...props }) {
    const depth = Base.useFolderDepth();
    return (_jsx(Base.SidebarFolderLink, { className: cn(itemVariants({ variant: 'link', highlight: depth > 1 }), 'w-full', className), style: {
            paddingInlineStart: getItemOffset(depth - 1),
            ...style,
        }, ...props, children: props.children }));
}
function SidebarFolderContent({ className, children, ...props }) {
    const depth = Base.useFolderDepth();
    return (_jsx(Base.SidebarFolderContent, { className: (state) => cn('relative flex flex-col gap-0.5 pt-0.5', depth === 1 &&
            "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:start-2.5", typeof className === 'function' ? className(state) : className), ...props, children: children }));
}
const SidebarPageTree = createPageTreeRenderer({
    SidebarFolder,
    SidebarFolderContent,
    SidebarFolderLink,
    SidebarFolderTrigger,
    SidebarItem,
    SidebarSeparator,
});
const SidebarLinkItem = createLinkItemRenderer({
    SidebarFolder,
    SidebarFolderContent,
    SidebarFolderLink,
    SidebarFolderTrigger,
    SidebarItem,
});
export function Sidebar({ banner, footer, components, collapsible = true, ...rest }) {
    const { menuItems, slots, props: { nav, tabs, tabMode }, } = useNotebookLayout();
    const navMode = nav?.mode ?? 'auto';
    const iconLinks = menuItems.filter((item) => item.type === 'icon');
    function renderHeader(props) {
        if (typeof banner === 'function')
            return createElement(banner, props);
        return (_jsxs("div", { ...props, className: cn('flex flex-col gap-3 p-4 pb-2 empty:hidden', props.className), children: [props.children, banner] }));
    }
    function renderFooter(props) {
        if (typeof footer === 'function')
            return createElement(footer, props);
        return (_jsxs("div", { ...props, children: [props.children, footer] }));
    }
    const viewport = (_jsx(Base.SidebarViewport, { children: _jsxs("div", { className: "flex flex-col gap-0.5", children: [menuItems
                    .filter((item) => item.type !== 'icon')
                    .map((item, i, arr) => (_jsx(SidebarLinkItem, { item: item, className: cn('lg:hidden', i === arr.length - 1 && 'mb-4') }, i))), _jsx(SidebarPageTree, { ...components })] }) }));
    return (_jsxs(_Fragment, { children: [_jsxs(SidebarContent, { ...rest, children: [renderHeader({
                        children: (_jsxs(_Fragment, { children: [navMode === 'auto' && (_jsxs("div", { className: "flex justify-between", children: [slots.navTitle && (_jsx(slots.navTitle, { className: "inline-flex items-center gap-2.5 font-medium" })), nav?.children, collapsible && (_jsx(SidebarCollapseTrigger, { className: cn(buttonVariants({
                                                color: 'ghost',
                                                size: 'icon-sm',
                                                className: 'mt-px mb-auto text-fd-muted-foreground',
                                            })), children: _jsx(SidebarIcon, {}) }))] })), tabs.length > 0 && (_jsx(SidebarTabsDropdown, { options: tabs, className: cn(tabMode === 'navbar' && 'lg:hidden') }))] })),
                    }), viewport, renderFooter({
                        className: cn('hidden flex-row text-fd-muted-foreground items-center border-t px-4 py-2.5', iconLinks.length > 0 && 'max-lg:flex'),
                        children: iconLinks.map((item, i) => (_jsx(LinkItem, { item: item, className: cn(buttonVariants({
                                size: 'icon-sm',
                                color: 'ghost',
                                className: 'lg:hidden',
                            })), "aria-label": item.label, children: item.icon }, i))),
                    })] }), _jsxs(SidebarDrawer, { ...rest, children: [renderHeader({
                        children: (_jsxs(_Fragment, { children: [_jsx(SidebarTrigger, { className: cn(buttonVariants({
                                        size: 'icon-sm',
                                        color: 'ghost',
                                        className: 'ms-auto text-fd-muted-foreground',
                                    })), children: _jsx(X, {}) }), tabs.length > 0 && _jsx(SidebarTabsDropdown, { options: tabs })] })),
                    }), viewport, renderFooter({
                        className: cn('hidden flex-row text-fd-muted-foreground items-center border-t p-4 pt-2 justify-end', (slots.languageSelect || slots.themeSwitch) && 'flex', iconLinks.length > 0 && 'max-lg:flex'),
                        children: (_jsxs(_Fragment, { children: [iconLinks.map((item, i) => (_jsx(LinkItem, { item: item, className: cn(buttonVariants({
                                        size: 'icon-sm',
                                        color: 'ghost',
                                    }), 'text-fd-muted-foreground lg:hidden', i === iconLinks.length - 1 && 'me-auto'), "aria-label": item.label, children: item.icon }, i))), slots.languageSelect && (_jsx(slots.languageSelect.root, { children: _jsx(Languages, { className: "size-4.5 text-fd-muted-foreground" }) })), slots.themeSwitch && _jsx(slots.themeSwitch, {})] })),
                    })] })] }));
}
export function SidebarTabsDropdown({ options, placeholder, ...props }) {
    const [open, setOpen] = useState(false);
    const { closeOnRedirect } = useSidebar();
    const pathname = usePathname();
    const selected = useMemo(() => {
        return options.findLast((item) => isLayoutTabActive(item, pathname));
    }, [options, pathname]);
    const onClick = () => {
        closeOnRedirect.current = false;
        setOpen(false);
    };
    const item = selected ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "size-9 shrink-0 empty:hidden md:size-5", children: selected.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: selected.title }), _jsx("p", { className: "text-sm text-fd-muted-foreground empty:hidden md:hidden", children: selected.description })] })] })) : (placeholder);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [item && (_jsxs(PopoverTrigger, { ...props, className: cn('flex items-center gap-2 rounded-lg p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-open:bg-fd-accent data-open:text-fd-accent-foreground', props.className), children: [item, _jsx(ChevronsUpDown, { className: "shrink-0 ms-auto size-4 text-fd-muted-foreground" })] })), _jsx(PopoverContent, { className: "flex flex-col gap-1 w-(--anchor-width) p-1 fd-scroll-container", children: options.map((item) => {
                    const isActive = selected && item.url === selected.url;
                    if (!isActive && item.unlisted)
                        return;
                    return (_jsxs(Link, { href: item.url, onClick: onClick, ...item.props, className: cn('flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground', item.props?.className), children: [_jsx("div", { className: "shrink-0 size-9 md:mb-auto md:size-5 empty:hidden", children: item.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium leading-none", children: item.title }), _jsx("p", { className: "text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden", children: item.description })] }), _jsx(Check, { className: cn('shrink-0 ms-auto size-3.5 text-fd-primary', !isActive && 'invisible') })] }, item.url));
                }) })] }));
}
