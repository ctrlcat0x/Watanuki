'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useI18n } from '@/contexts/i18n';
import { useTranslations } from '@fuma-translate/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import { Check, Languages } from 'lucide-react';
export function LanguageSelect({ className, variant = 'ghost', popoverSide = 'bottom', matchAnchor = false, children, ...rest }) {
    const context = useI18n();
    const t = useTranslations({ note: 'language switcher' });
    if (!context.locales)
        throw new Error('Missing `<I18nProvider />`');
    const chooseLanguage = t('Choose a language');
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { "data-language-select": "", "aria-label": t('Choose a language', { note: 'aria-label' }), className: (s) => cn(buttonVariants({ variant }), 'gap-1.5 p-1.5', s.open && 'bg-fd-accent', className), ...rest, children: children }), _jsx(PopoverContent, { side: popoverSide, align: "start", matchAnchor: matchAnchor, className: "w-full p-0", children: _jsxs("div", { className: "flex h-[min(16rem,calc(100vh-8rem))] flex-col", children: [_jsx("div", { className: "sticky top-0 z-10 border-b bg-fd-popover/90 px-3 py-2 backdrop-blur-lg", children: _jsx("p", { className: "text-xs font-medium text-fd-muted-foreground", children: chooseLanguage }) }), _jsx("div", { className: "flex-1 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mask-[linear-gradient(to_bottom,transparent,white_10px,white_calc(100%-10px),transparent)]", children: _jsx("div", { className: "flex flex-col gap-0.5", children: context.locales.map((item) => (_jsxs("button", { type: "button", className: cn('flex items-center gap-2 px-2 py-1.5 text-start text-sm rounded-lg transition-colors', item.locale === context.locale
                                        ? 'bg-fd-primary/10 text-fd-primary'
                                        : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'), onClick: () => {
                                        context.onChange?.(item.locale);
                                    }, children: [_jsx(Languages, { className: "size-4 shrink-0" }), _jsx("span", { className: "flex-1", children: item.name }), item.locale === context.locale && _jsx(Check, { className: "size-3.5 shrink-0" })] }, item.locale))) }) })] }) })] }));
}
export function LanguageSelectText(props) {
    const { locales, locale } = useI18n();
    const text = locales?.find((item) => item.locale === locale)?.name;
    return _jsx("span", { className: "flex-1 truncate", ...props, children: text });
}
