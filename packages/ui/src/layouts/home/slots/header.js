'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useEffect, useEffectEvent, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import Link from '@watanuki/core/link';
import { cn } from '@/utils/cn';
import { LinkItem } from '@/layouts/shared';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, } from '@/components/ui/navigation-menu';
import { buttonVariants } from '@/components/ui/button';
import { ChevronDown, Languages } from 'lucide-react';
import { useIsScrollTop } from '@/utils/use-is-scroll-top';
import { useHomeLayout } from '..';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { mergeRefs } from '@/utils/merge-refs';
import { useTranslations } from '@fuma-translate/react';
export const navItemVariants = cva('[&_svg]:size-4', {
    variants: {
        variant: {
            main: 'inline-flex items-center gap-1 p-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary',
            button: buttonVariants({
                color: 'secondary',
                className: 'gap-1.5',
            }),
            icon: buttonVariants({
                color: 'ghost',
                size: 'icon',
            }),
        },
    },
    defaultVariants: {
        variant: 'main',
    },
});
export function Header(props) {
    const { navItems, menuItems, slots, props: { nav }, } = useHomeLayout();
    const headerRef = useRef(null);
    const listRef = useRef(null);
    const [open, setOpen] = useState(false);
    const t = useTranslations({ note: 'home layout header' });
    const transparentMode = nav?.transparentMode ?? 'none';
    const isTop = useIsScrollTop({ enabled: transparentMode === 'top' }) ?? true;
    const isNavTransparent = transparentMode === 'top' ? isTop : transparentMode === 'always';
    const onClick = useEffectEvent((e) => {
        const element = headerRef.current;
        if (!open || !element)
            return;
        if (element !== e.target && !element.contains(e.target)) {
            setOpen(false);
        }
    });
    useEffect(() => {
        window.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('click', onClick);
        };
    }, []);
    const list = (_jsxs(NavigationMenuList, { ref: listRef, className: "flex h-14 w-full mx-auto max-w-(--fd-layout-width) items-center px-4", children: [slots.navTitle && (_jsx(slots.navTitle, { className: "inline-flex items-center gap-2.5 font-semibold" })), nav?.children, _jsx("ul", { className: "flex flex-row items-center gap-2 px-6 max-sm:hidden", children: navItems
                    .filter((item) => !isSecondary(item))
                    .map((item, i) => (_jsx(NavigationMenuLinkItem, { item: item, className: "text-sm" }, i))) }), _jsxs("div", { className: "flex flex-row items-center justify-end gap-1.5 flex-1 max-lg:hidden", children: [slots.searchTrigger && (_jsx(slots.searchTrigger.full, { hideIfDisabled: true, className: "w-full rounded-full ps-2.5 max-w-[240px]" })), slots.themeSwitch && _jsx(slots.themeSwitch, { compact: true }), slots.languageSelect && (_jsx(slots.languageSelect.root, { children: _jsx(Languages, { className: "size-5" }) })), _jsx("ul", { className: "flex flex-row gap-2 items-center empty:hidden", children: navItems.filter(isSecondary).map((item, i) => (_jsx(NavigationMenuLinkItem, { className: cn(item.type === 'icon' && '-mx-1 first:ms-0 last:me-0'), item: item }, i))) })] }), _jsxs("div", { className: "flex flex-row items-center ms-auto -me-1.5 lg:hidden", children: [slots.searchTrigger && _jsx(slots.searchTrigger.sm, { hideIfDisabled: true, className: "p-2" }), _jsx(CollapsibleTrigger, { "aria-label": t('Toggle Menu', { note: 'aria-label' }), className: cn(buttonVariants({
                            size: 'icon',
                            color: 'ghost',
                        })), onPointerEnter: nav?.enableHoverToOpen
                            ? () => {
                                setOpen(true);
                            }
                            : undefined, children: _jsx(ChevronDown, { className: cn('transition-transform', open && 'rotate-180') }) })] })] }));
    return (_jsx(Collapsible, { open: open, onOpenChange: setOpen, render: _jsx("header", { id: "nd-nav", ...props, ref: mergeRefs(headerRef, props.ref), className: cn('sticky h-14 top-0 z-40', props.className), children: _jsxs(NavigationMenu, { className: (s) => cn('backdrop-blur-lg border-b transition-[box-shadow,background-color,border-radius]', open && 'max-lg:shadow-lg max-lg:rounded-b-2xl', (open || !isNavTransparent || s.open) && 'bg-fd-background/80'), children: [list, _jsx(CollapsibleContent, { className: "mx-auto max-w-(--fd-layout-width) lg:hidden", children: _jsxs("div", { className: "flex flex-col pt-2 p-4 sm:flex-row sm:items-center sm:justify-end", children: [menuItems
                                    .filter((item) => !isSecondary(item))
                                    .map((item, i) => (_jsx(MobileNavigationMenuLinkItem, { item: item, className: "sm:hidden" }, i))), _jsxs("div", { className: "-ms-1.5 flex flex-row items-center gap-2 max-sm:mt-2", children: [menuItems.filter(isSecondary).map((item, i) => (_jsx(MobileNavigationMenuLinkItem, { item: item, className: cn(item.type === 'icon' && '-mx-1 first:ms-0') }, i))), _jsx("div", { role: "separator", className: "flex-1" }), slots.languageSelect && (_jsxs(slots.languageSelect.root, { children: [_jsx(Languages, { className: "size-5" }), slots.languageSelect.text && _jsx(slots.languageSelect.text, {}), _jsx(ChevronDown, { className: "size-3 text-fd-muted-foreground" })] })), slots.themeSwitch && _jsx(slots.themeSwitch, { compact: true })] })] }) }), _jsx(NavigationMenuViewport, { side: "bottom", anchor: listRef })] }) }) }));
}
function isSecondary(item) {
    if ('secondary' in item && item.secondary != null)
        return item.secondary;
    return item.type === 'icon';
}
function NavigationMenuLinkItem({ item, ...props }) {
    if (item.type === 'custom')
        return item.children;
    if (item.type === 'menu') {
        const children = item.items.map((child, j) => {
            if (child.type === 'custom') {
                return _jsx(Fragment, { children: child.children }, j);
            }
            const { banner = child.icon ? (_jsx("div", { className: "w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4", children: child.icon })) : null, ...rest } = child.menu ?? {};
            return (_jsx(NavigationMenuLink, { render: _jsx(Link, { href: child.url, external: child.external, ...rest, className: cn('flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground', rest.className), children: rest.children ?? (_jsxs(_Fragment, { children: [banner, _jsx("p", { className: "text-base font-medium", children: child.text }), _jsx("p", { className: "text-sm text-fd-muted-foreground empty:hidden", children: child.description })] })) }) }, `${j}-${child.url}`));
        });
        return (_jsxs(NavigationMenuItem, { ...props, children: [_jsx(NavigationMenuTrigger, { className: cn(navItemVariants(), 'rounded-md'), children: item.url ? (_jsx(Link, { href: item.url, external: item.external, children: item.text })) : (item.text) }), _jsx(NavigationMenuContent, { className: "grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3", children: children })] }));
    }
    return (_jsx(NavigationMenuItem, { ...props, children: _jsx(NavigationMenuLink, { render: _jsx(LinkItem, { item: item, "aria-label": item.type === 'icon' ? item.label : undefined, className: cn(navItemVariants({ variant: item.type })), children: item.type === 'icon' ? item.icon : item.text }) }) }));
}
function MobileNavigationMenuLinkItem({ item, ...props }) {
    if (item.type === 'custom')
        return _jsx("div", { className: cn('grid', props.className), children: item.children });
    if (item.type === 'menu') {
        const header = (_jsxs(_Fragment, { children: [item.icon, item.text] }));
        return (_jsxs("div", { className: cn('mb-4 flex flex-col', props.className), children: [_jsx("p", { className: "mb-1 text-sm text-fd-muted-foreground", children: item.url ? (_jsx(Link, { href: item.url, external: item.external, children: header })) : (header) }), item.items.map((child, i) => (_jsx(MobileNavigationMenuLinkItem, { item: child }, i)))] }));
    }
    return (_jsxs(LinkItem, { item: item, className: cn({
            main: 'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-fd-primary [&_svg]:size-4',
            icon: buttonVariants({
                size: 'icon',
                color: 'ghost',
            }),
            button: buttonVariants({
                color: 'secondary',
                className: 'gap-1.5 [&_svg]:size-4',
            }),
        }[item.type ?? 'main'], props.className), "aria-label": item.type === 'icon' ? item.label : undefined, children: [item.icon, item.type === 'icon' ? undefined : item.text] }));
}
