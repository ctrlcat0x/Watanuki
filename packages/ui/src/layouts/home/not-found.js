'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import Link from '@watanuki/core/link';
import { HomeIcon } from 'lucide-react';
import { useTranslations } from '@fuma-translate/react';
/**
 * the default not found page content, please make your own if you want to customize it.
 */
export function DefaultNotFound() {
    const t = useTranslations({ note: '404 not found page' });
    return (_jsxs("div", { className: "flex flex-col px-8 justify-center flex-1 text-center items-center gap-4", children: [_jsx("h1", { className: "text-6xl font-bold text-fd-muted-foreground", children: "404" }), _jsx("h2", { className: "text-2xl font-semibold", children: t('Page Not Found') }), _jsx("p", { className: "text-fd-muted-foreground max-w-md", children: t('The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.') }), _jsxs(Link, { href: "/", className: cn(buttonVariants({
                    className: 'mt-4 gap-1.5',
                    variant: 'primary',
                })), children: [_jsx(HomeIcon, { className: "size-4" }), t('Back to Home')] })] }));
}
