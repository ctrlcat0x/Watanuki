'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Base from '@/components/sidebar/base';
import { cn } from '@/utils/cn';
import { useEffect, useEffectEvent, useRef, useState, } from 'react';
import { cva } from 'class-variance-authority';
import { createPageTreeRenderer, } from '@/components/sidebar/page-tree';
import { createLinkItemRenderer } from '@/components/sidebar/link-item';
import { mergeRefs } from '@/utils/merge-refs';
import { AnimatePresence, motion } from 'motion/react';
import { RemoveScroll } from 'react-remove-scroll';
import { useFluxLayout } from '..';
import { XIcon, SidebarIcon } from 'lucide-react';
const MotionSidebarItem = motion.create(Base.SidebarItem);
const MotionSidebarFolderTrigger = motion.create(Base.SidebarFolderTrigger);
const MotionSidebarFolderLink = motion.create(Base.SidebarFolderLink);
const MotionSidebarFolderContent = motion.create(Base.SidebarFolderContent);
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
export function Sidebar({ footer, banner, components, ...rest }) {
    const { menuItems } = useFluxLayout();
    return (_jsxs(SidebarContent, { ...rest, children: [_jsx("div", { className: "flex flex-col gap-3 p-4 pb-2 empty:hidden", children: banner }), _jsx(Base.SidebarViewport, { children: _jsxs("div", { className: "flex flex-col", children: [menuItems
                            .filter((v) => v.type !== 'icon')
                            .map((item, i, list) => (_jsx(SidebarLinkItem, { item: item, className: cn(i === list.length - 1 && 'mb-4') }, i))), _jsx(SidebarPageTree, { ...components })] }) }), footer] }));
}
export function SidebarTrigger(props) {
    const { open, setOpen } = useSidebar();
    return (_jsx("button", { "aria-label": open ? 'Close Sidebar' : 'Open Sidebar', onClick: () => setOpen((prev) => !prev), ...props, children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.span, { transition: { duration: 0.2 }, initial: {
                    y: '100%',
                    opacity: 0,
                }, animate: {
                    y: 0,
                    opacity: 1,
                }, exit: {
                    y: '100%',
                    opacity: 0,
                }, children: open ? _jsx(XIcon, {}) : _jsx(SidebarIcon, {}) }, open ? 'open' : 'closed') }) }));
}
function SidebarContent({ ref: refProp, className, children, ...props }) {
    const ref = useRef(null);
    const [blockScroll, setBlockScroll] = useState(false);
    const { open, setOpen } = useSidebar();
    const listener = useEffectEvent((e) => {
        if (open && e.key === 'Escape') {
            setOpen(false);
            e.preventDefault();
        }
    });
    useEffect(() => {
        window.addEventListener('keydown', listener);
        return () => {
            window.removeEventListener('keydown', listener);
        };
    }, []);
    if (open && !blockScroll)
        setBlockScroll(true);
    return (_jsx(RemoveScroll, { enabled: blockScroll, children: _jsx(motion.div, { className: cn('fixed inset-0 py-10 z-30 backdrop-blur-md bg-fd-background/60', !open && 'pointer-events-none'), initial: "hide", variants: {
                show: {
                    opacity: 1,
                },
                hide: {
                    opacity: 0,
                },
            }, animate: open ? 'show' : 'hide', exit: "hide", onClick: () => {
                setOpen(false);
            }, onAnimationComplete: (definition) => {
                if (definition === 'hide')
                    setBlockScroll(false);
            }, children: _jsx(motion.div, { className: "absolute top-0 min-h-0 inset-x-0 bottom-26 overflow-y-auto fd-scroll-container pr-(--removed-body-scroll-bar-size,0) py-16 mask-[linear-gradient(to_bottom,transparent,white_--spacing(14),white_calc(100%---spacing(14)),transparent)] lg:text-sm", variants: {
                    show: {
                        y: 0,
                        opacity: 1,
                    },
                    hide: {
                        y: '80%',
                        opacity: 0,
                    },
                }, transition: {
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                }, children: _jsx(motion.aside, { id: "nd-sidebar", ref: mergeRefs(ref, refProp), className: cn('mx-auto sm:max-w-[400px]', className), onClick: (e) => e.stopPropagation(), ...props, children: children }) }) }) }));
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
    return (_jsx(MotionSidebarItem, { className: cn(itemVariants({ variant: 'link', highlight: depth >= 1 }), className), style: {
            paddingInlineStart: getItemOffset(depth),
            ...style,
        }, ...props, children: children }));
}
function SidebarFolderTrigger({ className, style, ...props }) {
    const { depth, collapsible, active } = Base.useFolder();
    return (_jsx(MotionSidebarFolderTrigger, { "data-active": active, className: (state) => cn(itemVariants({ variant: collapsible ? 'button' : null }), 'w-full', active && 'bg-fd-primary/10 text-fd-primary', typeof className === 'function' ? className(state) : className), style: {
            paddingInlineStart: getItemOffset(depth - 1),
            ...style,
        }, ...props, children: props.children }));
}
function SidebarFolderLink({ className, style, ...props }) {
    const depth = Base.useFolderDepth();
    return (_jsx(MotionSidebarFolderLink, { className: cn(itemVariants({ variant: 'link', highlight: depth > 1 }), 'w-full', className), style: {
            paddingInlineStart: getItemOffset(depth - 1),
            ...style,
        }, ...props, children: props.children }));
}
function SidebarFolderContent({ className, children, ...props }) {
    const depth = Base.useFolderDepth();
    const { open } = Base.useFolder();
    return (_jsx(MotionSidebarFolderContent, { className: (state) => cn('relative', depth === 1 &&
            "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:start-2.5", typeof className === 'function' ? className(state) : className), ...props, children: _jsx(motion.div, { initial: "hide", animate: open ? 'show' : 'hide', exit: "hide", variants: {
                show: {
                    opacity: 1,
                },
                hide: {
                    opacity: 0,
                },
            }, children: children }) }));
}
const SidebarPageTree = createPageTreeRenderer({
    SidebarFolder,
    SidebarFolderContent,
    SidebarSeparator,
    SidebarFolderLink,
    SidebarFolderTrigger,
    SidebarItem,
});
const SidebarLinkItem = createLinkItemRenderer({
    SidebarFolder,
    SidebarFolderContent,
    SidebarFolderLink,
    SidebarFolderTrigger,
    SidebarItem,
});
