'use client';
import { useTreeContext } from '@/contexts/tree';
const footerCache = new WeakMap();
/**
 * @returns a list of page tree items (linear), that you can obtain footer items
 */
export function useFooterItems() {
    const { root } = useTreeContext();
    const cached = footerCache.get(root);
    if (cached)
        return cached;
    const list = [];
    function onNode(node) {
        if (node.type === 'folder') {
            if (node.index)
                onNode(node.index);
            for (const child of node.children)
                onNode(child);
        }
        else if (node.type === 'page' && !node.external) {
            list.push(node);
        }
    }
    for (const child of root.children)
        onNode(child);
    footerCache.set(root, list);
    return list;
}
