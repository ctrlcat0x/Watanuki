'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { CodeBlock, Pre } from '@/components/codeblock';
import { useShikiDynamic } from '@watanuki/core/highlight/shiki/react';
import { cn } from '@/utils/cn';
import { createContext, use, useId } from 'react';
const PropsContext = createContext(undefined);
function DefaultPre(props) {
    const extraProps = use(PropsContext);
    return (_jsx(CodeBlock, { ...props, ...extraProps, className: cn('my-0', props.className, extraProps?.className), children: _jsx(Pre, { children: props.children }) }));
}
export function DynamicCodeBlock({ lang, code, codeblock, options, wrapInSuspense = true, highlighter, }) {
    const id = useId();
    const shikiOptions = {
        lang,
        defaultColor: false,
        ...options,
        components: {
            pre: DefaultPre,
            ...options.components,
        },
    };
    let node = useShikiDynamic(highlighter, code, shikiOptions, [id, lang, code]);
    if (wrapInSuspense)
        node ?? (node = _jsx(Placeholder, { code: code, components: shikiOptions.components }));
    return _jsx(PropsContext, { value: codeblock, children: node });
}
function Placeholder({ code, components = {}, }) {
    const { pre: Pre = 'pre', code: Code = 'code' } = components;
    return (_jsx(Pre, { children: _jsx(Code, { children: code.split('\n').map((line, i) => (_jsx("span", { className: "line", children: line }, i))) }) }));
}
