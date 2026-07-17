'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { SidebarIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { SidebarTrigger } from './sidebar';
export function SidebarFab() {
    return (_jsx(SidebarTrigger, { "aria-label": "Open sidebar", className: cn(buttonVariants({ color: 'secondary', size: 'icon-sm' }), 'fixed top-4 inset-s-4 z-50 size-9 rounded-full shadow-md lg:hidden'), children: _jsx(SidebarIcon, { className: "size-4" }) }));
}
