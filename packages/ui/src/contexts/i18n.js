'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, use, useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from '@watanuki/core/framework';
import { TranslationProvider } from '@fuma-translate/react';
const LocaleContext = createContext({});
export function useI18n() {
    return use(LocaleContext);
}
const Empty = {};
function localeFromPath(pathname, locales, fallback) {
    const codes = new Set(locales.map((item) => item.locale));
    const first = pathname.split('/').filter((v) => v.length > 0)[0];
    if (first && codes.has(first))
        return first;
    return fallback;
}
export function I18nProvider({ locales = [], locale: localeProp, onLocaleChange, children, translations = Empty, }) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = localeFromPath(pathname, locales, localeProp);
    // Keep <html lang> in sync without `headers()` in the root layout (that
    // dynamic API hangs App Router soft navigations under i18n rewrites).
    useEffect(() => {
        if (!locale)
            return;
        document.documentElement.lang = locale;
    }, [locale]);
    const onChange = (value) => {
        if (onLocaleChange) {
            return onLocaleChange(value);
        }
        const segments = pathname.split('/').filter((v) => v.length > 0);
        const localeCodes = new Set(locales.map((item) => item.locale));
        const hasLocalePrefix = segments.length > 0 && localeCodes.has(segments[0]);
        if (hasLocalePrefix) {
            segments[0] = value;
        }
        else {
            segments.unshift(value);
        }
        // Prefixed form always — i18n middleware strips the default locale from the URL.
        router.push(`/${segments.join('/')}`);
    };
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    return (_jsx(LocaleContext, { value: useMemo(() => ({
            locale,
            locales,
            onChange: (v) => onChangeRef.current(v),
        }), [locale, locales]), children: _jsx(TranslationProvider, { translations: translations, children: children }) }));
}
