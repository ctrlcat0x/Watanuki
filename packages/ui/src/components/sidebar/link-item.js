'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePathname } from '@watanuki/core/framework';
import { isLinkItemActive } from '@/layouts/shared';
export function createLinkItemRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarItem, }) {
    /**
     * Render sidebar items from page tree
     */
    return function SidebarLinkItem({ item, ...props }) {
        const pathname = usePathname();
        const active = isLinkItemActive(item, pathname);
        if (item.type === 'custom')
            return _jsx("div", { ...props, children: item.children });
        if (item.type === 'menu')
            return (_jsxs(SidebarFolder, { ...props, children: [item.url ? (_jsxs(SidebarFolderLink, { href: item.url, active: active, external: item.external, children: [item.icon, item.text] })) : (_jsxs(SidebarFolderTrigger, { children: [item.icon, item.text] })), _jsx(SidebarFolderContent, { children: item.items.map((child, i) => (_jsx(SidebarLinkItem, { item: child }, i))) })] }));
        return (_jsx(SidebarItem, { href: item.url, icon: item.icon, external: item.external, active: active, ...props, children: item.text }));
    };
}
