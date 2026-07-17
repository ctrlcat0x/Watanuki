'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon, FileText, Hash } from 'lucide-react';
import { Fragment, use, useMemo } from 'react';
import { useDocsSearch } from '@watanuki/core/search/client';
import { fetchClient } from '@watanuki/core/search/client/fetch';
import { useRouter } from '@watanuki/core/framework';
import { useI18n } from '@/contexts/i18n';
import { Command, CommandCollection, CommandDialog, CommandDialogPopup, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList, CommandPanel, CommandSeparator, } from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
function groupResults(items) {
    const pages = [];
    const sections = [];
    for (const item of items) {
        if (item.type === 'page')
            pages.push(item);
        else
            sections.push(item);
    }
    const groups = [];
    if (pages.length > 0)
        groups.push({ value: 'Pages', items: pages });
    if (sections.length > 0)
        groups.push({ value: 'Sections', items: sections });
    return groups;
}
let STATIC;
export default function CommandSearchDialog({ type = 'static', api = '/static.json', delayMs, open, onOpenChange, }) {
    const { locale } = useI18n();
    const router = useRouter();
    let client;
    if (type === 'static') {
        client = use((STATIC ?? (STATIC = import('@watanuki/core/search/client/orama-static')))).oramaStaticClient({
            from: api,
            locale,
        });
    }
    else {
        client = fetchClient({ api, locale });
    }
    const { search, setSearch, query } = useDocsSearch({ client, delayMs });
    const groups = useMemo(() => {
        if (!query.data || query.data === 'empty')
            return [];
        return groupResults(query.data);
    }, [query.data]);
    const handleSelect = (item) => {
        router.push(item.url);
        onOpenChange(false);
    };
    return (_jsx(CommandDialog, { open: open, onOpenChange: onOpenChange, children: _jsx(CommandDialogPopup, { children: _jsxs(Command, { shouldFilter: false, children: [_jsx(CommandInput, { placeholder: "Search documentation...", value: search, onValueChange: setSearch }), _jsxs(CommandPanel, { children: [_jsx(CommandEmpty, { children: "No results found." }), _jsx(CommandList, { children: groups.map((group, index) => (_jsxs(Fragment, { children: [_jsx(CommandGroup, { heading: group.value, children: _jsx(CommandCollection, { children: group.items.map((item) => (_jsxs(CommandItem, { value: item.id, onSelect: () => handleSelect(item), children: [item.type === 'page' ? _jsx(FileText, {}) : _jsx(Hash, {}), _jsx("span", { className: "flex-1 truncate", children: item.content })] }, item.id))) }) }), index < groups.length - 1 && _jsx(CommandSeparator, {})] }, group.value))) })] }), _jsxs(CommandFooter, { children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(KbdGroup, { children: [_jsx(Kbd, { children: _jsx(ArrowUpIcon, {}) }), _jsx(Kbd, { children: _jsx(ArrowDownIcon, {}) })] }), _jsx("span", { children: "Navigate" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Kbd, { children: _jsx(CornerDownLeftIcon, {}) }), _jsx("span", { children: "Open" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Kbd, { children: "Esc" }), _jsx("span", { children: "Close" })] })] })] }) }) }));
}
