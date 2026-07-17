'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/utils/cn';
import { useDocsPage } from '..';
export function Container(props) {
    const { full } = useDocsPage();
    return (_jsx("article", { id: "nd-page", "data-full": full, ...props, className: cn('flex flex-col w-full max-w-[900px] mx-auto [grid-area:main] px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14', full && 'max-w-[1200px]', props.className), children: props.children }));
}
