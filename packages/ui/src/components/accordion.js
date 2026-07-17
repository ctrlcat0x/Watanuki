'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, LinkIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { useCopyButton } from '@/utils/use-copy-button';
import { buttonVariants } from '@/components/ui/button';
import { mergeRefs } from '@/utils/merge-refs';
import { useTranslations } from '@fuma-translate/react';
import { Accordion as Root, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger, } from '@/components/ui/accordion';
export function Accordions({ ref, className, defaultValue, ...props }) {
    const rootRef = useRef(null);
    const composedRef = mergeRefs(ref, rootRef);
    const [value, setValue] = useState(defaultValue ?? []);
    useEffect(() => {
        const id = window.location.hash.substring(1);
        const element = rootRef.current;
        if (!element || id.length === 0)
            return;
        const selected = document.getElementById(id);
        if (!selected || !element.contains(selected))
            return;
        const value = selected.getAttribute('data-accordion-value');
        if (value)
            setValue((prev) => [value, ...prev]);
    }, []);
    return (_jsx(Root, { ref: composedRef, value: value, onValueChange: setValue, className: (s) => cn('divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card', typeof className === 'function' ? className(s) : className), ...props }));
}
export function Accordion({ title, id, value = String(title), children, ...props }) {
    return (_jsxs(AccordionItem, { value: value, ...props, children: [_jsxs(AccordionHeader, { id: id, "data-accordion-value": value, children: [_jsx(AccordionTrigger, { children: title }), id ? _jsx(CopyButton, { id: id }) : null] }), _jsx(AccordionContent, { hiddenUntilFound: true, children: _jsx("div", { className: "px-4 pb-2 text-[0.9375rem] prose-no-margin [&[hidden]:not([hidden='until-found'])]:hidden", children: children }) })] }));
}
function CopyButton({ id }) {
    const t = useTranslations({ note: 'accordion' });
    const [checked, onClick] = useCopyButton(() => {
        const url = new URL(window.location.href);
        url.hash = id;
        return navigator.clipboard.writeText(url.toString());
    });
    return (_jsx("button", { type: "button", "aria-label": t('Copy Link', { note: 'aria-label' }), className: cn(buttonVariants({
            color: 'ghost',
            className: 'text-fd-muted-foreground me-2',
        })), onClick: onClick, children: checked ? _jsx(Check, { className: "size-3.5" }) : _jsx(LinkIcon, { className: "size-3.5" }) }));
}
