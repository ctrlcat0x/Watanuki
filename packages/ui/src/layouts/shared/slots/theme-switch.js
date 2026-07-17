'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { Airplay, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { cn } from '@/utils/cn';
import { useTranslations } from '@fuma-translate/react';
const itemVariants = cva('size-6.5 p-1.5 text-fd-muted-foreground', {
    variants: {
        active: {
            true: 'bg-fd-accent text-fd-accent-foreground',
            false: 'text-fd-muted-foreground',
        },
    },
});
const themes = [['light', Sun], ['dark', Moon], ['system', Airplay]];
export function ThemeSwitch({ className, mode = 'light-dark', ...props }) {
    const { setTheme, theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations({ note: 'theme switcher' });
    const themeAriaLabels = {
        light: t('Light', { note: 'aria-label' }),
        dark: t('Dark', { note: 'aria-label' }),
        system: t('System', { note: 'aria-label' }),
    };
    const handleThemeChange = (newTheme) => {
        if (document?.startViewTransition) {
            document.startViewTransition(() => flushSync(() => setTheme(newTheme)));
        }
        else {
            setTheme(newTheme);
        }
    };
    useEffect(() => {
        setMounted(true);
    }, []);
    const container = cn('inline-flex items-center rounded-full border p-1 overflow-hidden *:rounded-full', className);
    if (mode === 'light-dark') {
        const value = mounted ? resolvedTheme : null;
        return (_jsx("button", { className: container, "aria-label": t('Toggle Theme', { note: 'aria-label' }), onClick: () => handleThemeChange(value === 'light' ? 'dark' : 'light'), "data-theme-toggle": "", children: themes.map(([key, Icon]) => {
                if (key === 'system')
                    return;
                return (_jsx(Icon, { fill: "currentColor", className: cn(itemVariants({ active: value === key })) }, key));
            }) }));
    }
    const value = mounted ? theme : null;
    return (_jsxs("div", { className: container, "data-theme-toggle": "", ...props, children: [_jsx("button", { "aria-label": themeAriaLabels.light, className: cn(itemVariants({ active: value === 'light' })), onClick: () => handleThemeChange('light'), children: _jsx(Sun, { className: "size-full", fill: "currentColor" }) }), _jsx("button", { "aria-label": themeAriaLabels.dark, className: cn(itemVariants({ active: value === 'dark' })), onClick: () => handleThemeChange('dark'), children: _jsx(Moon, { className: "size-full", fill: "currentColor" }) }), _jsx("button", { "aria-label": themeAriaLabels.system, className: cn(itemVariants({ active: value === 'system' })), onClick: () => handleThemeChange('system'), children: _jsx(Airplay, { className: "size-full", fill: "currentColor" }) })] }));
}
