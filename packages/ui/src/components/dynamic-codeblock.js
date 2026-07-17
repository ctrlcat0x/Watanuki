'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { defaultShikiFactory } from '@watanuki/core/highlight/shiki/full';
import * as Base from './dynamic-codeblock.core';
export function DynamicCodeBlock(props) {
    return (_jsx(Base.DynamicCodeBlock, { highlighter: () => defaultShikiFactory.getOrInit(), options: { themes: { light: 'github-light', dark: 'github-dark' } }, ...props }));
}
