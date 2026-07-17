import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ServerCodeBlock } from '@/components/codeblock.rsc';
import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, } from '@/components/codeblock';
export async function MdxCodeBlock({ tabs, code, language = 'bash', meta, title, }) {
    if (tabs && tabs.length > 0) {
        const first = tabs[0];
        return (_jsxs(CodeBlockTabs, { defaultValue: first?.label, children: [_jsx(CodeBlockTabsList, { children: tabs.map((tab) => (_jsx(CodeBlockTabsTrigger, { value: tab.label, children: tab.label }, tab.label))) }), await Promise.all(tabs.map(async (tab) => (_jsx(CodeBlockTab, { value: tab.label, children: await ServerCodeBlock({
                        code: tab.code,
                        lang: tab.language ?? language,
                        meta: tab.meta,
                        codeblock: {
                            title,
                        },
                    }) }, tab.label))))] }));
    }
    if (!code)
        return null;
    return await ServerCodeBlock({
        code,
        lang: language,
        meta: meta,
        codeblock: {
            title,
        },
    });
}
