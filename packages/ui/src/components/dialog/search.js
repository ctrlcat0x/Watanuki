'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronRight, Hash, SearchIcon } from 'lucide-react';
import { createContext, Fragment, use, useCallback, useEffect, useEffectEvent, useMemo, useRef, useState, } from 'react';
import { useTranslations, T } from '@fuma-translate/react';
import { cn } from '@/utils/cn';
import { Dialog } from '@base-ui/react/dialog';
import { cva } from 'class-variance-authority';
import { useRouter } from '@watanuki/core/framework';
import { useOnChange } from '@watanuki/core/utils/use-on-change';
import scrollIntoView from 'scroll-into-view-if-needed';
import { buttonVariants } from '@/components/ui/button';
import { createMarkdownRenderer } from '@watanuki/core/content/md';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
const RootContext = createContext(null);
const ListContext = createContext(null);
const TagsListContext = createContext(null);
const PreContext = createContext(false);
const mdRenderer = createMarkdownRenderer({
    remarkRehypeOptions: {
        allowDangerousHtml: true,
    },
    rehypePlugins: [rehypeRaw, rehypeCustomElements],
});
const mdComponents = {
    mark(props) {
        return _jsx("span", { ...props, className: "text-fd-primary underline" });
    },
    a: 'span',
    p(props) {
        return _jsx("p", { ...props, className: "min-w-0" });
    },
    strong(props) {
        return _jsx("strong", { ...props, className: "text-fd-accent-foreground font-medium" });
    },
    code(props) {
        // eslint-disable-next-line react-hooks/rules-of-hooks -- this is a component
        const inPre = use(PreContext);
        if (inPre)
            return (_jsx("code", { ...props, className: "mask-[linear-gradient(to_bottom,white,white_30px,transparent_80px)]" }));
        return (_jsx("code", { ...props, className: "border rounded-md px-px bg-fd-secondary text-fd-secondary-foreground" }));
    },
    custom({ _tagName = 'fragment', children, ...rest }) {
        return (_jsxs("span", { className: "inline-flex max-w-full items-center border p-0.5 rounded-md bg-fd-card text-fd-card-foreground divide-x divide-fd-border", children: [_jsx("code", { className: "rounded-sm px-0.5 me-1 bg-fd-primary font-medium text-xs text-fd-primary-foreground border-none", children: _tagName }), Object.entries(rest).map(([k, v]) => {
                    if (typeof v !== 'string')
                        return;
                    return (_jsxs("code", { className: "truncate text-xs text-fd-muted-foreground px-1", children: [_jsxs("span", { className: "text-fd-card-foreground", children: [k, ": "] }), v] }, k));
                }), children && _jsx("span", { className: "ps-1", children: children })] }));
    },
    pre(props) {
        return (_jsx("pre", { ...props, className: cn('flex flex-col border rounded-md my-0.5 p-2 bg-fd-secondary text-fd-secondary-foreground max-h-20 overflow-hidden', props.className), children: _jsx(PreContext, { value: true, children: props.children }) }));
    },
};
function rehypeCustomElements() {
    return (tree) => {
        visit(tree, (node) => {
            if (node.type === 'element' &&
                document.createElement(node.tagName) instanceof HTMLUnknownElement) {
                node.properties._tagName = node.tagName;
                node.tagName = 'custom';
            }
        });
    };
}
export function SearchDialog({ open, onOpenChange, search, onSearchChange, isLoading = false, onSelect: onSelectProp, children, }) {
    const router = useRouter();
    const onOpenChangeCallback = useRef(onOpenChange);
    onOpenChangeCallback.current = onOpenChange;
    const onSearchChangeCallback = useRef(onSearchChange);
    onSearchChangeCallback.current = onSearchChange;
    const onSelect = (item) => {
        if (item.type === 'action') {
            item.onSelect();
        }
        else if (item.external) {
            window.open(item.url, '_blank')?.focus();
        }
        else {
            router.push(item.url);
        }
        onOpenChange(false);
        onSelectProp?.(item);
    };
    const onSelectCallback = useRef(onSelect);
    onSelectCallback.current = onSelect;
    return (_jsx(Dialog.Root, { open: open, onOpenChange: onOpenChange, children: _jsx(RootContext, { value: useMemo(() => ({
                open,
                search,
                isLoading,
                onOpenChange: (v) => onOpenChangeCallback.current(v),
                onSearchChange: (v) => onSearchChangeCallback.current(v),
                onSelect: (v) => onSelectCallback.current(v),
            }), [isLoading, open, search]), children: children }) }));
}
export function SearchDialogHeader(props) {
    return _jsx("div", { ...props, className: cn('flex flex-row items-center gap-2 p-3', props.className) });
}
export function SearchDialogInput(props) {
    const t = useTranslations({ note: 'search dialog' });
    const { search, onSearchChange } = useSearch();
    return (_jsx("input", { ...props, value: search, onChange: (e) => onSearchChange(e.target.value), placeholder: t('Search'), className: "w-0 flex-1 bg-transparent text-lg placeholder:text-fd-muted-foreground focus-visible:outline-none" }));
}
export function SearchDialogClose({ children = 'ESC', className, ...props }) {
    const { onOpenChange } = useSearch();
    const t = useTranslations({ note: 'search dialog' });
    return (_jsx("button", { type: "button", "aria-label": t('Close Search', { note: 'aria-label' }), onClick: () => onOpenChange(false), className: cn(buttonVariants({
            color: 'outline',
            size: 'sm',
            className: 'font-mono text-fd-muted-foreground',
        }), className), ...props, children: children }));
}
export function SearchDialogFooter(props) {
    return _jsx("div", { ...props, className: cn('bg-fd-secondary/50 p-3 empty:hidden', props.className) });
}
export function SearchDialogOverlay({ className, ...props }) {
    return (_jsx(Dialog.Backdrop, { ...props, className: (s) => cn('fixed inset-0 z-50 backdrop-blur-xs bg-fd-overlay data-open:animate-fd-fade-in data-closed:animate-fd-fade-out', typeof className === 'function' ? className(s) : className) }));
}
export function SearchDialogContent({ children, className, ...props }) {
    const t = useTranslations({ note: 'search dialog' });
    return (_jsx(Dialog.Portal, { children: _jsxs(Dialog.Popup, { id: "fd-search-dialog-content", "aria-describedby": undefined, ...props, className: (s) => cn('fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl overflow-hidden data-closed:animate-fd-dialog-out data-open:animate-fd-dialog-in focus-visible:outline-none', '*:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0', typeof className === 'function' ? className(s) : className), children: [_jsx(Dialog.Title, { className: "hidden", children: t('Search') }), children] }) }));
}
export function SearchDialogList({ items = null, Empty = () => (_jsx("div", { className: "py-12 text-center text-sm text-fd-muted-foreground", children: _jsx(T, { text: "No results found", note: "search dialog" }) })), Item = (props) => _jsx(SearchDialogListItem, { ...props }), ...props }) {
    const ref = useRef(null);
    const { onSelect } = useSearch();
    const [active, setActive] = useState(() => items && items.length > 0 ? items[0].id : null);
    const onKey = useEffectEvent((e) => {
        if (!items || e.isComposing)
            return;
        if (e.key === 'ArrowDown' || e.key == 'ArrowUp') {
            let idx = items.findIndex((item) => item.id === active);
            if (idx === -1)
                idx = 0;
            else if (e.key === 'ArrowDown')
                idx++;
            else
                idx--;
            setActive(items.at(idx % items.length)?.id ?? null);
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            const selected = items.find((item) => item.id === active);
            if (selected)
                onSelect(selected);
            e.preventDefault();
        }
    });
    useEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const observer = new ResizeObserver(() => {
            const viewport = element.firstElementChild;
            element.style.setProperty('--fd-animated-height', `${viewport.clientHeight}px`);
        });
        const viewport = element.firstElementChild;
        if (viewport)
            observer.observe(viewport);
        const content = document.getElementById('fd-search-dialog-content') ?? window;
        content.addEventListener('keydown', onKey);
        return () => {
            observer.disconnect();
            content.removeEventListener('keydown', onKey);
        };
    }, []);
    useOnChange(items, () => {
        if (items && items.length > 0) {
            setActive(items[0].id);
        }
    });
    return (_jsx("div", { ...props, ref: ref, "data-empty": items === null, className: cn('overflow-hidden h-(--fd-animated-height) transition-[height]', props.className), children: _jsx("div", { className: cn('w-full flex flex-col overflow-y-auto max-h-[460px] p-1', !items && 'hidden'), children: _jsxs(ListContext, { value: useMemo(() => ({
                    active,
                    setActive,
                }), [active]), children: [items?.length === 0 && Empty(), items?.map((item) => (_jsx(Fragment, { children: Item({ item, onClick: () => onSelect(item) }) }, item.id)))] }) }) }));
}
export function SearchDialogListItem({ item, className, children, renderMarkdown = (s) => _jsx(mdRenderer.Markdown, { components: mdComponents, children: s }), renderHighlights: _, ...props }) {
    const { active: activeId, setActive } = useSearchList();
    const active = item.id === activeId;
    if (item.type === 'action') {
        children ?? (children = item.node);
    }
    else {
        children ?? (children = _jsxs(_Fragment, { children: [_jsx("div", { className: "inline-flex items-center text-fd-muted-foreground text-xs empty:hidden", children: item.breadcrumbs?.map((item, i) => (_jsxs(Fragment, { children: [i > 0 && _jsx(ChevronRight, { className: "size-4 rtl:rotate-180" }), item] }, i))) }), item.type !== 'page' && (_jsx("div", { role: "none", className: "absolute inset-s-3 inset-y-0 w-px bg-fd-border" })), item.type === 'heading' && (_jsx(Hash, { className: "absolute inset-s-6 top-2.5 size-4 text-fd-muted-foreground" })), _jsx("div", { className: cn('min-w-0', item.type === 'text' && 'ps-4', item.type === 'heading' && 'ps-8', item.type === 'page' || item.type === 'heading'
                        ? 'font-medium'
                        : 'text-fd-popover-foreground/80'), children: typeof item.content === 'string' ? renderMarkdown(item.content) : item.content })] }));
    }
    return (_jsx("button", { type: "button", ref: useCallback((element) => {
            if (active && element) {
                scrollIntoView(element, {
                    scrollMode: 'if-needed',
                    block: 'nearest',
                    boundary: element.parentElement,
                });
            }
        }, [active]), "aria-selected": active, className: cn('relative select-none shrink-0 px-2.5 py-2 text-start text-sm overflow-hidden rounded-lg', active && 'bg-fd-accent text-fd-accent-foreground', className), onPointerMove: () => setActive(item.id), ...props, children: children }));
}
export function SearchDialogIcon(props) {
    const { isLoading } = useSearch();
    return (_jsx(SearchIcon, { ...props, className: cn('size-5 text-fd-muted-foreground', isLoading && 'animate-pulse duration-400', props.className) }));
}
const itemVariants = cva('rounded-md border px-2 py-0.5 text-xs font-medium text-fd-muted-foreground transition-colors', {
    variants: {
        active: {
            true: 'bg-fd-accent text-fd-accent-foreground',
        },
    },
});
export function TagsList({ tag, onTagChange, allowClear = false, ...props }) {
    const onTagChangeCallback = useRef(onTagChange);
    onTagChangeCallback.current = onTagChange;
    return (_jsx("div", { ...props, className: cn('flex items-center gap-1 flex-wrap', props.className), children: _jsx(TagsListContext, { value: useMemo(() => ({
                value: tag,
                onValueChange: (v) => onTagChangeCallback.current(v),
                allowClear,
            }), [allowClear, tag]), children: props.children }) }));
}
export function TagsListItem({ value, className, ...props }) {
    const { onValueChange, value: selectedValue, allowClear } = useTagsList();
    const selected = value === selectedValue;
    return (_jsx("button", { type: "button", "data-active": selected, className: cn(itemVariants({ active: selected, className })), onClick: () => onValueChange(selected && allowClear ? undefined : value), tabIndex: -1, ...props, children: props.children }));
}
export function useSearch() {
    const ctx = use(RootContext);
    if (!ctx)
        throw new Error('Missing <SearchDialog />');
    return ctx;
}
export function useTagsList() {
    const ctx = use(TagsListContext);
    if (!ctx)
        throw new Error('Missing <TagsList />');
    return ctx;
}
export function useSearchList() {
    const ctx = use(ListContext);
    if (!ctx)
        throw new Error('Missing <SearchDialogList />');
    return ctx;
}
