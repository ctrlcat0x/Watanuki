'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useDocsLayout } from '../client';
import { cn } from '@/utils/cn';
import { Languages, SidebarIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useWatanukiStyle } from '@watanuki/theme/react';
import { SidebarCollapseTrigger } from './sidebar';
export function Header(props) {
    const { isNavTransparent, slots, props: { nav }, } = useDocsLayout();
    const style = useWatanukiStyle();
    const isModern = style === 'modern';
    const { collapsed } = slots.sidebar?.useSidebar?.() ?? {};
    if (nav?.component)
        return nav.component;
    if (isModern) {
        return (_jsxs("header", { id: "nd-subnav", "data-transparent": isNavTransparent, ...props, className: cn('[grid-area:header] sticky top-(--fd-docs-row-1) z-30 grid w-full min-w-0 grid-cols-[1fr_minmax(0,28rem)_1fr] items-center gap-2 border-b px-4 backdrop-blur-sm transition-colors h-(--fd-header-height) max-lg:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-muted/80 lg:bg-fd-muted', props.className), children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2 justify-self-start", children: [collapsed && (_jsxs(_Fragment, { children: [_jsx(SidebarCollapseTrigger, { className: cn(buttonVariants({
                                        color: 'ghost',
                                        size: 'icon-sm',
                                        className: 'hidden text-fd-muted-foreground lg:inline-flex',
                                    })), children: _jsx(SidebarIcon, {}) }), slots.navTitle && (_jsx(slots.navTitle, { className: "hidden items-center gap-2.5 font-semibold lg:inline-flex" }))] })), !collapsed && slots.navTitle && (_jsx(slots.navTitle, { className: "inline-flex items-center gap-2.5 font-semibold lg:hidden" }))] }), slots.searchTrigger && (_jsx(slots.searchTrigger.full, { hideIfDisabled: true, className: "my-auto hidden w-full min-w-0 max-w-md justify-self-center lg:flex" })), _jsx("div", { className: "flex items-center justify-end gap-1 justify-self-end", children: _jsxs("div", { className: "hidden items-center gap-1 lg:flex", children: [slots.languageSelect && (_jsx(slots.languageSelect.root, { className: cn(buttonVariants({ size: 'icon-sm', color: 'ghost' }), 'size-9 min-w-9 shrink-0 text-fd-muted-foreground'), style: { minWidth: '2.25rem' }, children: _jsx(Languages, { className: "size-4.5" }) })), slots.themeSwitch && (_jsx(slots.themeSwitch, { compact: true, className: "size-9 min-w-9 shrink-0", style: { minWidth: '2.25rem' } }))] }) })] }));
    }
    return (_jsxs("header", { id: "nd-subnav", "data-transparent": isNavTransparent, ...props, className: cn('[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) lg:hidden max-lg:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80', props.className), children: [slots.navTitle && (_jsx(slots.navTitle, { className: "inline-flex items-center gap-2.5 font-semibold" })), _jsx("div", { className: "flex-1", children: nav?.children }), slots.searchTrigger && _jsx(slots.searchTrigger.sm, { hideIfDisabled: true, className: "p-2" }), slots.sidebar && (_jsx(slots.sidebar.trigger, { className: cn(buttonVariants({
                    color: 'ghost',
                    size: 'icon-sm',
                    className: 'p-2',
                })), children: _jsx(SidebarIcon, {}) }))] }));
}
