'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, use } from 'react';
import { baseSlots, useLinkItems } from '@/layouts/shared';
import { Container } from './slots/container';
import { Header } from './slots/header';
const LayoutContext = createContext(null);
export function useHomeLayout() {
    const context = use(LayoutContext);
    if (!context)
        throw new Error('Please use this component under <HomeLayout /> (`@watanuki/ui/layouts/home`).');
    return context;
}
const { useProvider } = baseSlots({
    useProps() {
        return useHomeLayout().props;
    },
});
export function HomeLayout(props) {
    const { nav: { enabled: navEnabled = true } = {}, slots: defaultSlots, children, i18n: _i18n, githubUrl: _githubUrl, links: _links, themeSwitch: _themeSwitch, searchToggle: _searchToggle, ...rest } = props;
    const { baseSlots, baseProps } = useProvider(props);
    const linkItems = useLinkItems(props);
    const slots = {
        ...baseSlots,
        header: defaultSlots?.header ?? InlineHeader,
        container: defaultSlots?.container ?? Container,
    };
    return (_jsx(LayoutContext, { value: {
            props: baseProps,
            slots,
            ...linkItems,
        }, children: _jsxs(slots.container, { ...rest, children: [navEnabled && _jsx(slots.header, {}), children] }) }));
}
function InlineHeader(props) {
    const { nav } = useHomeLayout().props;
    if (nav?.component)
        return nav.component;
    return _jsx(Header, { ...props });
}
