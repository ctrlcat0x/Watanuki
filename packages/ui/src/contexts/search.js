'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, lazy, Suspense, use, useEffect, useEffectEvent, useMemo, useState, } from 'react';
const SearchContext = createContext({
    enabled: false,
    open: false,
    hotKey: [],
    setOpenSearch: () => undefined,
});
export function useSearchContext() {
    return use(SearchContext);
}
function MetaOrControl() {
    const [key, setKey] = useState('⌘');
    useEffect(() => {
        if (/Windows|Linux/i.test(window.navigator.userAgent))
            setKey('Ctrl');
    }, []);
    return key;
}
const DEFAULT_HOT_KEYS = [
    {
        key: (e) => e.metaKey || e.ctrlKey,
        display: _jsx(MetaOrControl, {}),
    },
    {
        key: 'k',
        display: 'k',
    },
];
const DefaultSearchDialog = lazy(() => import('@/components/dialog/search-default'));
export function SearchProvider({ SearchDialog = DefaultSearchDialog, children, preload = true, options, hotKey = DEFAULT_HOT_KEYS, links, }) {
    const [isOpen, setIsOpen] = useState(preload ? false : undefined);
    const onKeyDown = useEffectEvent((e) => {
        if (hotKey.every((v) => (typeof v.key === 'string' ? e.key === v.key : v.key(e)))) {
            setIsOpen((open) => !open);
            e.preventDefault();
        }
    });
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);
    return (_jsxs(SearchContext, { value: useMemo(() => ({
            enabled: true,
            open: isOpen ?? false,
            hotKey,
            setOpenSearch: setIsOpen,
        }), [isOpen, hotKey]), children: [_jsx(Suspense, { fallback: null, children: isOpen !== undefined && (_jsx(SearchDialog, { open: isOpen, onOpenChange: setIsOpen, links: links, ...options })) }), children] }));
}
/**
 * Show children only when search is enabled via React Context
 */
export function SearchOnly({ children }) {
    const search = useSearchContext();
    if (search.enabled)
        return children;
}
