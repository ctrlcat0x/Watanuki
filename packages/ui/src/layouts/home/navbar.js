'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import Link from '@watanuki/core/link';
import { cn } from '@/utils/cn';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, } from '@/components/ui/navigation-menu';
import { navItemVariants } from './slots/header';
export const NavbarMenu = NavigationMenuItem;
export function NavbarMenuContent(props) {
    const { className, ...rest } = props;
    return (_jsx(NavigationMenuContent, { ...rest, className: (state) => cn('grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3', typeof className === 'function' ? className(state) : className), children: props.children }));
}
export function NavbarMenuTrigger(props) {
    const { className, ...rest } = props;
    return (_jsx(NavigationMenuTrigger, { ...rest, className: (state) => cn(navItemVariants(), 'text-sm rounded-md', typeof className === 'function' ? className(state) : className), children: props.children }));
}
export function NavbarMenuLink(props) {
    return (_jsx(NavigationMenuLink, { render: _jsx(Link, { ...props, className: cn('flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground', props.className), children: props.children }) }));
}
