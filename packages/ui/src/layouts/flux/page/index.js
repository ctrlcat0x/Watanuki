'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, use, useEffect, useState, } from 'react';
import { cn } from '@/utils/cn';
import { useTranslations } from '@fuma-translate/react';
import { TOC, TOCProvider } from './slots/toc';
import { Footer } from './slots/footer';
import { Breadcrumb } from './slots/breadcrumb';
import { Container } from './slots/container';
import { buttonVariants } from '@/components/ui/button';
import { Edit } from 'lucide-react';
const PageContext = createContext(null);
export function useDocsPage() {
    const context = use(PageContext);
    if (!context)
        throw new Error('Please use page components under <DocsPage /> (`@watanuki/ui/layouts/flux/page`).');
    return context;
}
export function DocsPage({ full = false, tableOfContent: { enabled: tocEnabled = !full, single, ...tocProps } = {}, breadcrumb: { enabled: breadcrumbEnabled = true, ...breadcrumb } = {}, footer: { enabled: footerEnabled = true, ...footer } = {}, toc = [], slots: defaultSlots = {}, children, ...containerProps }) {
    const slots = {
        breadcrumb: defaultSlots.breadcrumb ?? Breadcrumb,
        footer: defaultSlots.footer ?? Footer,
        container: defaultSlots.container ?? Container,
        toc: defaultSlots.toc ?? {
            provider: TOCProvider,
            main: TOC,
        },
    };
    return (_jsx(PageContext, { value: {
            full,
            slots,
        }, children: _jsxs(slots.toc.provider, { single: single, toc: tocEnabled ? toc : [], children: [tocEnabled && (tocProps.component ?? _jsx(slots.toc.main, { ...tocProps })), _jsxs(slots.container, { ...containerProps, children: [breadcrumbEnabled && (breadcrumb.component ?? _jsx(slots.breadcrumb, { ...breadcrumb })), children, footerEnabled && (footer.component ?? _jsx(slots.footer, { ...footer }))] })] }) }));
}
export function EditOnGitHub(props) {
    const t = useTranslations({ note: 'edit page' });
    return (_jsx("a", { target: "_blank", rel: "noreferrer noopener", ...props, className: cn(buttonVariants({
            color: 'secondary',
            size: 'sm',
        }), 'gap-1.5 not-prose', props.className), children: props.children ?? (_jsxs(_Fragment, { children: [_jsx(Edit, { className: "size-3.5" }), t('Edit on GitHub')] })) }));
}
/**
 * Add typography styles
 */
export function DocsBody({ children, className, ...props }) {
    return (_jsx("div", { ...props, className: cn('prose flex-1', className), children: children }));
}
export function DocsDescription({ children, className, ...props }) {
    // Don't render if no description provided
    if (children === undefined)
        return null;
    return (_jsx("p", { ...props, className: cn('mb-8 text-lg text-fd-muted-foreground', className), children: children }));
}
export function DocsTitle({ children, className, ...props }) {
    return (_jsx("h1", { ...props, className: cn('text-[1.75em] font-semibold', className), children: children }));
}
export function PageLastUpdate({ date: value, ...props }) {
    const t = useTranslations({ note: 'page footer' });
    const [date, setDate] = useState('');
    useEffect(() => {
        // to the timezone of client
        setDate(value.toLocaleDateString());
    }, [value]);
    return (_jsxs("p", { ...props, className: cn('text-sm text-fd-muted-foreground', props.className), children: [t('Last updated on'), " ", date] }));
}
export { Footer as PageFooter } from './slots/footer';
export { Breadcrumb as PageBreadcrumb } from './slots/breadcrumb';
export { MarkdownCopyButton, PagePagerButtons, ViewOptionsPopover, } from '@/layouts/shared/page-actions';
