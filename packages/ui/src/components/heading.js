'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CopyCheckIcon, LinkIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { buttonVariants } from './ui/button';
import { useCopyButton } from '@/utils/use-copy-button';
import { useTranslations } from '@fuma-translate/react';
export function Heading({ as, ...props }) {
    const As = as ?? 'h1';
    const t = useTranslations({ note: 'heading anchor' });
    const [isChecked, onCopy] = useCopyButton(() => {
        if (!props.id)
            return;
        const url = new URL(window.location.href);
        url.hash = props.id;
        return navigator.clipboard.writeText(url.href);
    });
    if (!props.id)
        return _jsx(As, { ...props });
    return (_jsxs(As, { ...props, className: cn('group/heading flex scroll-m-28 flex-row items-center gap-1', props.className), children: [_jsx("a", { "data-card": "", href: `#${props.id}`, children: props.children }), _jsx("button", { "aria-label": t('Copy Anchor Link', { note: 'aria-label' }), className: cn(buttonVariants({
                    variant: 'ghost',
                    size: 'icon-xs',
                }), 'not-prose shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 focus-visible:opacity-100'), onClick: onCopy, children: isChecked ? _jsx(CopyCheckIcon, {}) : _jsx(LinkIcon, {}) })] }));
}
