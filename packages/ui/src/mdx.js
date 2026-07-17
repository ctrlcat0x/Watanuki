import { jsx as _jsx } from "react/jsx-runtime";
import Link from '@watanuki/core/link';
import { Image as FrameworkImage } from '@watanuki/core/framework';
import { Card, Cards } from '@/components/card';
import { Callout, CalloutContainer, CalloutDescription, CalloutTitle } from '@/components/callout';
import { Heading } from '@/components/heading';
import { MdxCodeBlock } from '@/components/mdx-codeblock';
import { cn } from '@/utils/cn';
import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, HeadlessCodeBlock, Pre, } from '@/components/codeblock';
import { File, Files, Folder } from '@/components/files';
import { TypeTable } from '@/components/type-table';
function Image({ src, ...props }) {
    return (_jsx(FrameworkImage, { sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px", ...props, src: typeof src === 'string' ? src : undefined, className: cn('rounded-lg', props.className) }));
}
function Table(props) {
    return (_jsx("div", { className: "relative overflow-auto prose-no-margin my-6", children: _jsx("table", { ...props }) }));
}
const defaultMdxComponents = {
    CodeBlockTab,
    CodeBlock: MdxCodeBlock,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    pre: (props) => (_jsx(HeadlessCodeBlock, { ...props, children: _jsx(Pre, { children: props.children }) })),
    Card,
    Cards,
    Files,
    File,
    Folder,
    a: Link,
    img: Image,
    h1: (props) => _jsx(Heading, { as: "h1", ...props }),
    h2: (props) => _jsx(Heading, { as: "h2", ...props }),
    h3: (props) => _jsx(Heading, { as: "h3", ...props }),
    h4: (props) => _jsx(Heading, { as: "h4", ...props }),
    h5: (props) => _jsx(Heading, { as: "h5", ...props }),
    h6: (props) => _jsx(Heading, { as: "h6", ...props }),
    table: Table,
    TypeTable,
    Callout,
    CalloutContainer,
    CalloutTitle,
    CalloutDescription,
};
export const createRelativeLink = () => {
    throw new Error('`createRelativeLink` is only supported in Node.js environment');
};
export { defaultMdxComponents as default };
