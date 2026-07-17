'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslations } from '@fuma-translate/react';
import { cn } from '@/utils/cn';
import { isActive } from '@/utils/urls';
import { useFooterItems } from '@/utils/use-footer-items';
import { usePathname } from '@watanuki/core/framework';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from '@watanuki/core/link';
import { useMemo } from 'react';
export function Footer({ items, children, className, ...props }) {
    const footerList = useFooterItems();
    const pathname = usePathname();
    const { previous, next } = useMemo(() => {
        if (items)
            return items;
        const idx = footerList.findIndex((item) => isActive(item.url, pathname));
        if (idx === -1)
            return {};
        return {
            previous: footerList[idx - 1],
            next: footerList[idx + 1],
        };
    }, [footerList, items, pathname]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: cn('@container grid gap-4', previous && next ? 'grid-cols-2' : 'grid-cols-1', className), ...props, children: [previous && _jsx(FooterItem, { item: previous, index: 0 }), next && _jsx(FooterItem, { item: next, index: 1 })] }), children] }));
}
function FooterItem({ item, index }) {
    const t = useTranslations({ note: 'pagination' });
    const Icon = index === 0 ? ChevronLeft : ChevronRight;
    return (_jsxs(Link, { href: item.url, className: cn('flex flex-col gap-2 rounded-lg border p-4 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground @max-lg:col-span-full', index === 1 && 'text-end'), children: [_jsxs("div", { className: cn('inline-flex items-center gap-1.5 font-medium text-fd-muted-foreground', index === 1 && 'flex-row-reverse'), children: [_jsx(Icon, { className: "-mx-1 size-4 shrink-0 rtl:rotate-180" }), _jsx("p", { children: item.name })] }), _jsx("p", { className: "truncate text-fd-muted-foreground/80", children: item.description ?? (index === 0 ? t('Previous Page') : t('Next Page')) })] }));
}
