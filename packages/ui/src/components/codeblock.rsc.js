import { jsx as _jsx } from "react/jsx-runtime";
import { CodeBlock, HeadlessCodeBlock, Pre } from './codeblock';
import { highlight } from '@watanuki/core/highlight';
import { cn } from '@/utils/cn';
export async function ServerCodeBlock({ code, codeblock, ...options }) {
    return await highlight(code, {
        defaultColor: false,
        ...options,
        components: {
            pre: (props) => (codeblock?.title ? (_jsx(CodeBlock, { ...props, ...codeblock, className: cn('my-0', props.className, codeblock?.className), children: _jsx(Pre, { children: props.children }) })) : (_jsx(HeadlessCodeBlock, { ...props, ...codeblock, className: cn('my-0', props.className, codeblock?.className), children: _jsx(Pre, { children: props.children }) }))),
            ...options.components,
        },
    });
}
