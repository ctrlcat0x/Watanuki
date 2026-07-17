'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as Base from '@/components/sidebar/base';
import { cn } from '@/utils/cn';
import { useMemo, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { createPageTreeRenderer, } from '@/components/sidebar/page-tree';
import { createLinkItemRenderer } from '@/components/sidebar/link-item';
import { buttonVariants } from '@/components/ui/button';
import { SearchTrigger } from '@/layouts/shared/slots/search-trigger';
import { Check, ChevronDown, ChevronsUpDown, Languages, SidebarIcon } from 'lucide-react';
import { mergeRefs } from '@/utils/merge-refs';
import { useDocsLayout } from '../client';
import { LinkItem } from '@/layouts/shared';
import { isLayoutTabActive } from '@/layouts/shared';
import { usePathname } from '@watanuki/core/framework';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWatanukiStyle } from '@watanuki/theme/react';
import Link from '@watanuki/core/link';
const itemVariants = cva('relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            link: 'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors',
            button: 'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
        },
        highlight: {
            true: "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5",
        },
    },
});
export const { useSidebar } = Base;
export function SidebarProvider(props) {
    return _jsx(Base.SidebarProvider, { ...props });
}
export function Sidebar({ footer, banner, collapsible = true, components, ...rest }) {
    const { menuItems, slots, props: { tabs, nav, tabMode }, } = useDocsLayout();
    const style = useWatanukiStyle();
    const isModern = style === 'modern';
    const isMinimal = style === 'minimal';
    const effectiveCollapsible = collapsible && !isMinimal;
    const iconLinks = menuItems.filter((item) => item.type === 'icon');
    const viewport = (_jsx(Base.SidebarViewport, { children: _jsxs("div", { className: "flex flex-col gap-0.5", children: [menuItems
                    .filter((v) => v.type !== 'icon')
                    .map((item, i, list) => (_jsx(SidebarLinkItem, { item: item, className: cn(i === list.length - 1 && 'mb-4') }, i))), _jsx(SidebarPageTree, { ...components })] }) }));
    return (_jsxs(_Fragment, { children: [_jsxs(SidebarContent, { ...rest, children: [_jsxs("div", { className: cn('flex flex-col gap-3 p-4 pb-2', isModern && 'gap-0 p-0'), children: [_jsxs("div", { className: cn('flex', isModern && 'w-full items-center'), children: [slots.navTitle && (_jsx(slots.navTitle, { className: "inline-flex text-[0.9375rem] items-center gap-2.5 font-medium me-auto" })), !isModern && nav?.children, effectiveCollapsible && (_jsx(SidebarCollapseTrigger, { className: cn(buttonVariants({
                                            color: 'ghost',
                                            size: 'icon-sm',
                                            className: cn('text-fd-muted-foreground', !isModern && 'mb-auto'),
                                        })), children: _jsx(SidebarIcon, {}) }))] }), !isModern && slots.searchTrigger && _jsx(slots.searchTrigger.full, { hideIfDisabled: true }), tabs.length > 0 && tabMode === 'auto' && _jsx(SidebarTabsDropdown, { tabs: tabs }), banner] }), viewport, ((!isModern && (slots.languageSelect || slots.themeSwitch)) ||
                        iconLinks.length > 0 ||
                        footer) && (_jsxs("div", { className: "relative z-10 flex flex-col gap-2 p-4 pt-2", children: [!isModern && slots.languageSelect && (_jsxs(slots.languageSelect.root, { variant: "secondary", popoverSide: "top", matchAnchor: true, className: "w-full text-fd-muted-foreground text-start justify-start bg-fd-secondary/50", children: [_jsx(Languages, { className: "size-4.5 shrink-0" }), _jsx(slots.languageSelect.text, {}), _jsx(ChevronDown, { className: "ms-auto size-3.5 shrink-0" })] })), !isModern && slots.themeSwitch && _jsx(slots.themeSwitch, { className: "w-full" }), iconLinks.length > 0 && (_jsx("div", { className: 'flex items-center gap-1 text-fd-muted-foreground', children: iconLinks.map((item, i) => (_jsx(LinkItem, { item: item, className: cn(buttonVariants({ size: 'icon-sm', color: 'ghost' })), "aria-label": item.label, children: item.icon }, i))) })), footer] }))] }), _jsxs(SidebarDrawer, { children: [_jsxs("div", { className: "flex flex-col gap-3 p-4 pb-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [slots.navTitle && (_jsx(slots.navTitle, { className: "inline-flex flex-1 text-[0.9375rem] items-center gap-2.5 font-medium" })), _jsx(SidebarTrigger, { className: cn(buttonVariants({
                                            color: 'ghost',
                                            size: 'icon-sm',
                                            className: 'p-2',
                                        })), children: _jsx(SidebarIcon, {}) })] }), tabs.length > 0 && _jsx(SidebarTabsDropdown, { tabs: tabs }), banner] }), viewport, _jsxs("div", { className: "flex flex-col gap-2 border-t p-4 pt-2 empty:hidden", children: [slots.languageSelect && (_jsxs(slots.languageSelect.root, { variant: "secondary", popoverSide: "top", matchAnchor: true, className: "w-full text-fd-muted-foreground text-start justify-start bg-fd-secondary/50", children: [_jsx(Languages, { className: "size-4.5 shrink-0" }), _jsx(slots.languageSelect.text, {}), _jsx(ChevronDown, { className: "ms-auto size-3.5 shrink-0" })] })), slots.themeSwitch && _jsx(slots.themeSwitch, { className: "w-full" }), iconLinks.length > 0 && (_jsx("div", { className: "flex items-center gap-1 text-fd-muted-foreground", children: iconLinks.map((item, i) => (_jsx(LinkItem, { item: item, className: cn(buttonVariants({ size: 'icon-sm', color: 'ghost' })), "aria-label": item.label, children: item.icon }, i))) })), footer] })] })] }));
}
function SidebarFolder(props) {
    return _jsx(Base.SidebarFolder, { ...props });
}
function SidebarCollapseTrigger(props) {
    return _jsx(Base.SidebarCollapseTrigger, { ...props });
}
export { SidebarCollapseTrigger };
export function SidebarTrigger(props) {
    return _jsx(Base.SidebarTrigger, { ...props });
}
function SidebarContent({ ref: refProp, className, children, ...props }) {
    const ref = useRef(null);
    const style = useWatanukiStyle();
    const isClassic = style === 'classic';
    const isMinimal = style === 'minimal';
    const isModern = style === 'modern';
    const showCollapsedPanel = isClassic;
    const showHoverPeek = !isMinimal;
    const stretchSidebar = isModern || isMinimal;
    return (_jsx(Base.SidebarContent, { children: ({ collapsed, hovered, ref: asideRef, ...rest }) => (_jsxs(_Fragment, { children: [_jsxs("div", { "data-sidebar-placeholder": "", className: "sticky top-(--fd-docs-row-1) z-20 [grid-area:sidebar] pointer-events-none *:pointer-events-auto h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] lg:layout:[--fd-sidebar-width:var(--wt-sidebar-width)] max-lg:hidden", children: [collapsed && showHoverPeek && (_jsx("div", { className: "absolute inset-s-0 inset-y-0 w-4", ...rest })), _jsx("aside", { id: "nd-sidebar", ref: mergeRefs(ref, refProp, asideRef), "data-collapsed": collapsed, "data-hovered": collapsed && hovered, className: cn('absolute flex flex-col w-full inset-s-0 inset-y-0 bg-fd-card text-sm duration-250', isClassic
                                ? 'border-e border-fd-border'
                                : 'border-e', stretchSidebar ? 'items-stretch' : 'items-end *:w-(--fd-sidebar-width)', collapsed &&
                                showHoverPeek && [
                                'inset-y-2 rounded-xl transition-transform border w-(--fd-sidebar-width)',
                                hovered
                                    ? 'shadow-lg translate-x-2 rtl:-translate-x-2 z-50'
                                    : '-translate-x-(--fd-sidebar-width) rtl:translate-x-full',
                            ], ref.current &&
                                (ref.current.getAttribute('data-collapsed') === 'true') !== collapsed &&
                                'transition-[width,inset-block,translate,background-color]', className), ...props, ...rest, children: children })] }), showCollapsedPanel && (_jsxs("div", { "data-sidebar-panel": "", className: cn('flex transition-opacity max-lg:hidden', (!collapsed || hovered) && 'pointer-events-none opacity-0'), children: [_jsx(Base.SidebarCollapseTrigger, { className: cn(buttonVariants({
                                color: 'ghost',
                                size: 'icon-sm',
                                className: 'rounded-lg',
                            })), children: _jsx(SidebarIcon, {}) }), _jsx(SearchTrigger, { className: "rounded-lg w-full", hideIfDisabled: true })] }))] })) }));
}
function SidebarDrawer({ children, className, ...props }) {
    return (_jsxs(_Fragment, { children: [_jsx(Base.SidebarDrawerOverlay, { className: "fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" }), _jsx(Base.SidebarDrawerContent, { className: cn('fixed text-[0.9375rem] flex flex-col shadow-lg border-s inset-e-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out', className), ...props, children: children })] }));
}
function SidebarSeparator({ className, style, children, ...props }) {
    const depth = Base.useFolderDepth();
    return (_jsx(Base.SidebarSeparator, { className: cn('inline-flex items-center gap-2 mb-1 px-2 mt-6 empty:mb-0 text-xs font-medium text-fd-muted-foreground/70 [&_svg]:size-3.5 [&_svg]:shrink-0', depth === 0 && 'first:mt-0', className), style: {
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
            "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:inset-s-2.5", typeof className === 'function' ? className(state) : className), ...props, children: children }));
}
function SidebarTabsDropdown({ tabs, placeholder, ...props }) {
    const [open, setOpen] = useState(false);
    const { closeOnRedirect } = useSidebar();
    const pathname = usePathname();
    const selected = useMemo(() => {
        return tabs.findLast((item) => isLayoutTabActive(item, pathname));
    }, [tabs, pathname]);
    const onClick = () => {
        closeOnRedirect.current = false;
        setOpen(false);
    };
    const item = selected ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "size-9 shrink-0 empty:hidden md:size-5", children: selected.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: selected.title }), _jsx("p", { className: "text-sm text-fd-muted-foreground empty:hidden md:hidden", children: selected.description })] })] })) : (placeholder);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [item && (_jsxs(PopoverTrigger, { ...props, className: cn('flex items-center gap-2 rounded-lg p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-open:bg-fd-accent data-open:text-fd-accent-foreground', props.className), children: [item, _jsx(ChevronsUpDown, { className: "shrink-0 ms-auto size-4 text-fd-muted-foreground" })] })), _jsx(PopoverContent, { className: "flex flex-col gap-1 w-(--anchor-width) p-1 fd-scroll-container", children: tabs.map((item) => {
                    const isActive = selected && item.url === selected.url;
                    if (!isActive && item.unlisted)
                        return;
                    return (_jsxs(Link, { href: item.url, onClick: onClick, ...item.props, className: cn('flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground', item.props?.className), children: [_jsx("div", { className: "shrink-0 size-9 md:mb-auto md:size-5 empty:hidden", children: item.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium leading-none", children: item.title }), _jsx("p", { className: "text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden", children: item.description })] }), _jsx(Check, { className: cn('shrink-0 ms-auto size-3.5 text-fd-primary', !isActive && 'invisible') })] }, item.url));
                }) })] }));
}
function getItemOffset(depth) {
    return `calc(${2 + 3 * depth} * var(--spacing))`;
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
