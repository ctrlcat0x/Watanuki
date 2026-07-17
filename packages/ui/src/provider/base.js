'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/contexts/i18n';
import { SearchProvider } from '@/contexts/search';
export function RootProvider({ children, dir = 'ltr', theme = {}, search, i18n, }) {
    let body = children;
    if (search?.enabled !== false) {
        body = _jsx(SearchProvider, { ...search, children: body });
    }
    if (theme?.enabled !== false) {
        body = (_jsx(ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true, ...theme, children: body }));
    }
    if (i18n) {
        body = _jsx(I18nProvider, { ...i18n, children: body });
    }
    return _jsx(DirectionProvider, { direction: dir, children: body });
}
export { 
/**
 * re-exported from `next-themes`
 */
useTheme, } from 'next-themes';
