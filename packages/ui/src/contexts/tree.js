'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { usePathname } from '@watanuki/core/framework';
import { useMemo, useRef, createContext, use } from 'react';
import { searchPath } from '@watanuki/core/breadcrumb';
const TreeContext = createContext(null);
const PathContext = createContext([]);
export function TreeContextProvider({ tree: rawTree, children, }) {
    const nextIdRef = useRef(0);
    const pathname = usePathname();
    // I found that object-typed props passed from a RSC will be re-constructed, hence breaking all hooks' dependencies
    // using the id here to make sure this never happens
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tree = useMemo(() => rawTree, [rawTree.$id]);
    const path = useMemo(() => {
        return (searchPath(tree.children, pathname) ??
            (tree.fallback ? searchPath(tree.fallback.children, pathname) : null) ??
            []);
    }, [tree, pathname]);
    const root = path.findLast((item) => item.type === 'folder' && item.root) ?? tree;
    root.$id ?? (root.$id = String(nextIdRef.current++));
    return (_jsx(TreeContext, { value: useMemo(() => ({ root, full: tree }), [root, tree]), children: _jsx(PathContext, { value: path, children: children }) }));
}
export function useTreePath() {
    return use(PathContext);
}
export function useTreeContext() {
    const ctx = use(TreeContext);
    if (!ctx)
        throw new Error('You must wrap this component under <DocsLayout />');
    return ctx;
}
