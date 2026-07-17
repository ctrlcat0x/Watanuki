'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDocsSearch } from '@watanuki/core/search/client';
import { fetchClient } from '@watanuki/core/search/client/fetch';
import { use, useMemo, useState } from 'react';
import { useOnChange } from '@watanuki/core/utils/use-on-change';
import { useI18n } from '@/contexts/i18n';
import { SearchDialog, SearchDialogClose, SearchDialogContent, SearchDialogFooter, SearchDialogHeader, SearchDialogIcon, SearchDialogInput, SearchDialogList, SearchDialogOverlay, TagsList, TagsListItem, } from './search';
let STATIC;
export default function DefaultSearchDialog({ type, defaultTag, tags = [], api, delayMs, allowClear = false, links = [], footer, ...props }) {
    const { locale } = useI18n();
    const [tag, setTag] = useState(defaultTag);
    let client;
    if (type === 'static') {
        // TODO: must remove it on next major, currently, this will bundle the Orama client unnecessarily
        client = use((STATIC ?? (STATIC = import('@watanuki/core/search/client/orama-static')))).oramaStaticClient({
            from: api,
            locale,
            tag,
        });
    }
    else {
        client = fetchClient({
            api,
            locale,
            tag,
        });
    }
    const { search, setSearch, query } = useDocsSearch({ client, delayMs });
    const defaultItems = useMemo(() => {
        if (links.length === 0)
            return null;
        return links.map(([name, link]) => ({
            type: 'page',
            id: name,
            content: name,
            url: link,
        }));
    }, [links]);
    useOnChange(defaultTag, (v) => {
        setTag(v);
    });
    return (_jsxs(SearchDialog, { search: search, onSearchChange: setSearch, isLoading: query.isLoading, ...props, children: [_jsx(SearchDialogOverlay, {}), _jsxs(SearchDialogContent, { children: [_jsxs(SearchDialogHeader, { children: [_jsx(SearchDialogIcon, {}), _jsx(SearchDialogInput, {}), _jsx(SearchDialogClose, {})] }), _jsx(SearchDialogList, { items: query.data !== 'empty' ? query.data : defaultItems })] }), _jsxs(SearchDialogFooter, { children: [tags.length > 0 && (_jsx(TagsList, { tag: tag, onTagChange: setTag, allowClear: allowClear, children: tags.map((tag) => (_jsx(TagsListItem, { value: tag.value, children: tag.name }, tag.value))) })), footer] })] }));
}
