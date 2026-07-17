'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { RootProvider as BaseProvider } from '@/provider/base';
import { TanstackProvider } from '@watanuki/core/framework/tanstack';
export function RootProvider({ components, ...props }) {
    return (_jsx(TanstackProvider, { Link: components?.Link, Image: components?.Image, children: _jsx(BaseProvider, { ...props, children: props.children }) }));
}
