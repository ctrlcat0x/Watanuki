import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTreeContext, useTreePath } from '@/contexts/tree';
import { Fragment, createContext, use, useMemo } from 'react';
import { usePathname } from '@watanuki/core/framework';
import { isActive } from '@/utils/urls';
const RendererContext = createContext(null);
export function createPageTreeRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarSeparator, SidebarItem, }) {
    function renderList(nodes) {
        return nodes.map((node, i) => _jsx(PageTreeNode, { node: node }, i));
    }
    function PageTreeNode({ node }) {
        const { Separator, Item, Folder, pathname } = use(RendererContext);
        if (node.type === 'separator') {
            if (Separator)
                return _jsx(Separator, { item: node });
            return (_jsxs(SidebarSeparator, { children: [node.icon, node.name] }));
        }
        if (node.type === 'folder') {
            // eslint-disable-next-line react-hooks/rules-of-hooks -- assume node type unchanged
            const path = useTreePath();
            if (Folder)
                return _jsx(Folder, { item: node, children: renderList(node.children) });
            return (_jsxs(SidebarFolder, { collapsible: node.collapsible, active: path.includes(node), defaultOpen: node.defaultOpen, children: [node.index ? (_jsxs(SidebarFolderLink, { href: node.index.url, active: isActive(node.index.url, pathname), external: node.index.external, children: [node.icon, node.name] })) : (_jsxs(SidebarFolderTrigger, { children: [node.icon, node.name] })), _jsx(SidebarFolderContent, { children: renderList(node.children) })] }));
        }
        if (Item)
            return _jsx(Item, { item: node });
        return (_jsx(SidebarItem, { href: node.url, external: node.external, active: isActive(node.url, pathname), icon: node.icon, children: node.name }));
    }
    /**
     * Render sidebar items from page tree
     */
    return function SidebarPageTree(components) {
        const { Folder, Item, Separator } = components;
        const { root } = useTreeContext();
        const pathname = usePathname();
        return (_jsx(RendererContext, { value: useMemo(() => ({ Folder, Item, Separator, pathname }), [Folder, Item, Separator, pathname]), children: _jsx(Fragment, { children: renderList(root.children) }, root.$id) }));
    };
}
