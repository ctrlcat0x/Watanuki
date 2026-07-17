'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { RootProvider as BaseProvider } from '@/provider/base';
import { ReactRouterProvider } from '@watanuki/core/framework/react-router';
export function RootProvider({ components, ...props }) {
    return (_jsx(ReactRouterProvider, { Link: components?.Link, Image: components?.Image, children: _jsx(BaseProvider, { ...props, children: props.children }) }));
}
