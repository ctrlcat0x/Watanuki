'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { usePathname } from '@watanuki/core/framework';
import Link from '@watanuki/core/link';
import { useI18n } from '@/contexts/i18n';
import { cloneElement, isValidElement } from 'react';
import { cn } from '@/utils/cn';
import { isLinkItemActive } from '.';
import { LanguageSelect, LanguageSelectText, } from './slots/language-select';
import { SearchTrigger, FullSearchTrigger, } from './slots/search-trigger';
import { ThemeSwitch } from './slots/theme-switch';
export function LinkItem({ ref, item, ...props }) {
    const pathname = usePathname();
    const active = isLinkItemActive(item, pathname);
    return (_jsx(Link, { ref: ref, href: item.url, external: item.external, ...props, "data-active": active, children: props.children }));
}
export function baseSlots({ useProps }) {
    function InlineThemeSwitch(props) {
        const { themeSwitch } = useProps();
        if (themeSwitch.component) {
            if (isValidElement(themeSwitch.component)) {
                const element = themeSwitch.component;
                return cloneElement(element, {
                    ...props,
                    className: cn(element.props.className, props.className),
                    style: { ...element.props.style, ...props.style },
                });
            }
            return themeSwitch.component;
        }
        return _jsx(ThemeSwitch, { ...props, ...themeSwitch });
    }
    function InlineSearchTrigger(props) {
        const { searchToggle } = useProps();
        if (searchToggle.components?.sm)
            return searchToggle.components.sm;
        return _jsx(SearchTrigger, { ...props, ...searchToggle.sm });
    }
    function InlineSearchTriggerFull(props) {
        const { searchToggle } = useProps();
        if (searchToggle.components?.lg)
            return searchToggle.components.lg;
        return _jsx(FullSearchTrigger, { ...props, ...searchToggle.full });
    }
    function InlineNavTitle({ href: defaultUrl = '/', ...props }) {
        const { url = defaultUrl, title } = useProps().nav ?? {};
        if (typeof title === 'function')
            return title({ href: url, ...props });
        return (_jsx(Link, { href: url, ...props, children: title }));
    }
    return {
        useProvider(options) {
            const { locales = [] } = useI18n();
            const { nav, slots = {}, i18n = locales.length > 1, searchToggle: { enabled: searchToggleEnabled = true, ...searchToggle } = {}, themeSwitch: { enabled: themeSwitchEnabled = true, ...themeSwitch } = {}, } = options;
            return {
                baseSlots: {
                    navTitle: slots.navTitle ?? InlineNavTitle,
                    themeSwitch: themeSwitchEnabled && (slots.themeSwitch ?? InlineThemeSwitch),
                    languageSelect: i18n
                        ? (slots.languageSelect ?? {
                            root: LanguageSelect,
                            text: LanguageSelectText,
                        })
                        : false,
                    searchTrigger: searchToggleEnabled &&
                        (slots.searchTrigger ?? {
                            sm: InlineSearchTrigger,
                            full: InlineSearchTriggerFull,
                        }),
                },
                baseProps: {
                    nav,
                    searchToggle,
                    themeSwitch,
                },
            };
        },
    };
}
