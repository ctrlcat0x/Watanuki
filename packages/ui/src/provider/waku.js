'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { RootProvider as BaseProvider } from '@/provider/base';
import { WakuProvider } from '@watanuki/core/framework/waku';
export function RootProvider({ components, ...props }) {
    return (_jsx(WakuProvider, { Link: components?.Link, Image: components?.Image, children: _jsx(BaseProvider, { ...props, children: props.children }) }));
}
