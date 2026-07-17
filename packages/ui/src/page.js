'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/utils/cn';
import * as Docs from './layouts/docs/page';
import * as Notebook from './layouts/notebook/page';
import { useIsDocsLayout } from './layouts/docs/client';
// TODO: remove this compat layer on v17
export { DocsDescription, DocsTitle, EditOnGitHub, DocsBody, PageBreadcrumb, PageLastUpdate, } from './layouts/docs/page';
/**
 * For separate MDX page
 */
export function withArticle(props) {
    return (_jsx("main", { ...props, className: cn('w-full max-w-[1400px] mx-auto px-4 py-12', props.className), children: _jsx("article", { className: "prose", children: props.children }) }));
}
export function DocsPage({ lastUpdate, editOnGithub, children, ...props }) {
    const { DocsPage, EditOnGitHub, PageLastUpdate } = useIsDocsLayout() ? Docs : Notebook;
    return (_jsxs(DocsPage, { ...props, children: [children, _jsxs("div", { className: "flex flex-row flex-wrap items-center justify-between gap-4 empty:hidden", children: [editOnGithub && (_jsx(EditOnGitHub, { href: `https://github.com/${editOnGithub.owner}/${editOnGithub.repo}/blob/${editOnGithub.sha ?? 'main'}/${editOnGithub.path.startsWith('/') ? editOnGithub.path.slice(1) : editOnGithub.path}` })), lastUpdate && _jsx(PageLastUpdate, { date: new Date(lastUpdate) })] })] }));
}
