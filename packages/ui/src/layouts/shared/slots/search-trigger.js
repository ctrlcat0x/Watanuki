'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search } from 'lucide-react';
import { useSearchContext } from '@/contexts/search';
import { useTranslations } from '@fuma-translate/react';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button';
export function SearchTrigger({ hideIfDisabled, size = 'icon-sm', color = 'ghost', ...props }) {
    const { setOpenSearch, enabled } = useSearchContext();
    const t = useTranslations({ note: 'search trigger' });
    if (hideIfDisabled && !enabled)
        return null;
    return (_jsx("button", { type: "button", className: cn(buttonVariants({
            size,
            color,
        }), props.className), "data-search": "", "aria-label": t('Open Search', { note: 'aria-label' }), onClick: () => {
            setOpenSearch(true);
        }, children: _jsx(Search, {}) }));
}
export function FullSearchTrigger({ hideIfDisabled, ...props }) {
    const { enabled, hotKey, setOpenSearch } = useSearchContext();
    const t = useTranslations({ note: 'search trigger' });
    if (hideIfDisabled && !enabled)
        return null;
    return (_jsxs("button", { type: "button", "data-search-full": "", ...props, className: cn('inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground', props.className), onClick: () => {
            setOpenSearch(true);
        }, children: [_jsx(Search, { className: "size-4" }), t('Search'), _jsx("div", { className: "ms-auto inline-flex gap-0.5", children: hotKey.map((k, i) => (_jsx("kbd", { className: "rounded-md border bg-fd-background px-1.5", children: k.display }, i))) })] }));
}
