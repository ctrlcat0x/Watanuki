'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, ExternalLink } from 'lucide-react';
import { createContext, use, useEffect, useMemo, useRef, useState, } from 'react';
import Link from '@watanuki/core/link';
import { useOnChange } from '@watanuki/core/utils/use-on-change';
import { cn } from '@/utils/cn';
import { ScrollArea, ScrollViewport } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '@/components/ui/collapsible';
import { useMediaQuery } from '@watanuki/core/utils/use-media-query';
import scrollIntoView from 'scroll-into-view-if-needed';
import { usePathname } from '@watanuki/core/framework';
import ReactDOM from 'react-dom';
import { useTranslations } from '@fuma-translate/react';
const SidebarContext = createContext(null);
const FolderContext = createContext(null);
export function SidebarProvider({ defaultOpenLevel = 0, prefetch, children, }) {
    const closeOnRedirect = useRef(true);
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const mode = useMediaQuery('(width < 1024px)') ? 'drawer' : 'full';
    useOnChange(pathname, () => {
        if (closeOnRedirect.current) {
            setOpen(false);
        }
        closeOnRedirect.current = true;
    });
    return (_jsx(SidebarContext, { value: useMemo(() => ({
            open,
            setOpen,
            collapsed,
            setCollapsed,
            closeOnRedirect,
            defaultOpenLevel,
            prefetch,
            mode,
        }), [open, collapsed, defaultOpenLevel, prefetch, mode]), children: children }));
}
export function useSidebar() {
    const ctx = use(SidebarContext);
    if (!ctx)
        throw new Error('Missing SidebarContext, make sure you have wrapped the component in <DocsLayout /> and the context is available.');
    return ctx;
}
export function useFolder() {
    return use(FolderContext);
}
export function useFolderDepth() {
    return use(FolderContext)?.depth ?? 0;
}
export function SidebarContent({ children, }) {
    const { collapsed, mode } = useSidebar();
    const [hover, setHover] = useState(false);
    const ref = useRef(null);
    const timerRef = useRef(0);
    useOnChange(collapsed, () => {
        if (collapsed)
            setHover(false);
    });
    if (mode !== 'full')
        return;
    function shouldIgnoreHover(e) {
        const element = ref.current;
        if (!element)
            return true;
        return !collapsed || e.pointerType === 'touch' || element.getAnimations().length > 0;
    }
    return children({
        ref,
        collapsed,
        hovered: hover,
        onPointerEnter(e) {
            if (shouldIgnoreHover(e))
                return;
            window.clearTimeout(timerRef.current);
            setHover(true);
        },
        onPointerLeave(e) {
            if (shouldIgnoreHover(e))
                return;
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => setHover(false), 
            // if mouse is leaving the viewport, add a close delay
            Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100 ? 0 : 500);
        },
    });
}
export function SidebarDrawerOverlay(props) {
    const { open, setOpen, mode } = useSidebar();
    const [hidden, setHidden] = useState(!open);
    if (open && hidden)
        setHidden(false);
    if (mode !== 'drawer' || hidden)
        return;
    return (_jsx("div", { "data-state": open ? 'open' : 'closed', onClick: () => setOpen(false), onAnimationEnd: () => {
            if (!open)
                ReactDOM.flushSync(() => setHidden(true));
        }, ...props }));
}
export function SidebarDrawerContent({ className, children, ...props }) {
    const { open, mode } = useSidebar();
    const [hidden, setHidden] = useState(!open);
    if (open && hidden)
        setHidden(false);
    if (mode !== 'drawer')
        return;
    return (_jsx("aside", { id: "nd-sidebar-mobile", "data-state": open ? 'open' : 'closed', className: cn(hidden && 'invisible', className), onAnimationEnd: () => {
            if (!open)
                ReactDOM.flushSync(() => setHidden(true));
        }, ...props, children: children }));
}
export function SidebarViewport({ className, ...props }) {
    return (_jsx(ScrollArea, { className: (s) => cn('min-h-0 flex-1', typeof className === 'function' ? className(s) : className), ...props, children: _jsx(ScrollViewport, { className: "p-4 overscroll-contain mask-[linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)]", children: props.children }) }));
}
export function SidebarSeparator(props) {
    const depth = useFolderDepth();
    return (_jsx("p", { ...props, className: cn('inline-flex items-center gap-2 mb-1.5 px-2 mt-6 empty:mb-0 text-xs font-medium text-fd-muted-foreground/70', depth === 0 && 'first:mt-0', props.className), children: props.children }));
}
export function SidebarItem({ icon, active = false, children, ...props }) {
    const ref = useRef(null);
    const { prefetch } = useSidebar();
    useAutoScroll(active, ref);
    return (_jsxs(Link, { ref: ref, "data-active": active, prefetch: prefetch, ...props, children: [icon ?? (props.external ? _jsx(ExternalLink, {}) : null), children] }));
}
export function SidebarFolder({ defaultOpen: defaultOpenProp, collapsible = true, active = false, children, ...props }) {
    const { defaultOpenLevel } = useSidebar();
    const depth = useFolderDepth() + 1;
    const defaultOpen = collapsible === false || active || (defaultOpenProp ?? defaultOpenLevel >= depth);
    const [open, setOpen] = useState(defaultOpen);
    useOnChange(defaultOpen, (v) => {
        if (v)
            setOpen(v);
    });
    return (_jsx(Collapsible, { open: open, onOpenChange: setOpen, disabled: !collapsible, ...props, children: _jsx(FolderContext, { value: useMemo(() => ({ open, setOpen, depth, collapsible, active }), [active, collapsible, depth, open]), children: children }) }));
}
export function SidebarFolderTrigger({ children, ...props }) {
    const { open, collapsible } = use(FolderContext);
    if (collapsible) {
        return (_jsxs(CollapsibleTrigger, { ...props, children: [children, _jsx(ChevronDown, { "data-icon": true, className: cn('ms-auto transition-transform', !open && '-rotate-90 rtl:rotate-90') })] }));
    }
    return _jsx("div", { ...props, children: children });
}
export function SidebarFolderLink({ children, active = false, ...props }) {
    const ref = useRef(null);
    const { open, setOpen, collapsible } = use(FolderContext);
    const { prefetch } = useSidebar();
    useAutoScroll(active, ref);
    return (_jsxs(Link, { ref: ref, "data-active": active, onClick: (e) => {
            if (!collapsible)
                return;
            if (e.target instanceof Element && e.target.matches('[data-icon], [data-icon] *')) {
                setOpen(!open);
                e.preventDefault();
            }
            else {
                setOpen(active ? !open : true);
            }
        }, prefetch: prefetch, ...props, children: [children, collapsible && (_jsx(ChevronDown, { "data-icon": true, className: cn('ms-auto transition-transform', !open && '-rotate-90 rtl:rotate-90') }))] }));
}
export function SidebarFolderContent(props) {
    return _jsx(CollapsibleContent, { ...props, children: props.children });
}
export function SidebarTrigger({ children, ...props }) {
    const { setOpen } = useSidebar();
    const t = useTranslations({ note: 'sidebar' });
    return (_jsx("button", { "aria-label": t('Open Sidebar', { note: 'aria-label' }), onClick: () => setOpen((prev) => !prev), ...props, children: children }));
}
export function SidebarCollapseTrigger(props) {
    const { collapsed, setCollapsed } = useSidebar();
    const t = useTranslations({ note: 'sidebar' });
    return (_jsx("button", { type: "button", "aria-label": t('Collapse Sidebar', { note: 'aria-label' }), "data-collapsed": collapsed, onClick: () => {
            setCollapsed((prev) => !prev);
        }, ...props, children: props.children }));
}
/**
 * scroll to the element if `active` is true
 */
export function useAutoScroll(active, ref) {
    const { mode } = useSidebar();
    useEffect(() => {
        if (active && ref.current) {
            scrollIntoView(ref.current, {
                boundary: document.getElementById(mode === 'drawer' ? 'nd-sidebar-mobile' : 'nd-sidebar'),
                scrollMode: 'if-needed',
            });
        }
    }, [active, mode, ref]);
}
