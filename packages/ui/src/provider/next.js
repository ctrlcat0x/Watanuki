'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { RootProvider as BaseProvider } from '@/provider/base';
import { NextProvider } from '@watanuki/core/framework/next';
export function RootProvider({ components, ...props }) {
    return (_jsx(NextProvider, { Link: components?.Link, Image: components?.Image, children: _jsx(BaseProvider, { ...props, children: props.children }) }));
}
