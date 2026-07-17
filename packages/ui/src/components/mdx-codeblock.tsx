import type { HTMLAttributes } from 'react';
import { ServerCodeBlock } from '@/components/codeblock.rsc';
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from '@/components/codeblock';

export interface MdxCodeTab {
  label: string;
  code: string;
  language?: string;
  meta?: string;
}

export interface MdxCodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  tabs?: MdxCodeTab[];
  code?: string;
  language?: string;
  meta?: string;
  title?: string;
}

export async function MdxCodeBlock({
  tabs,
  code,
  language = 'bash',
  meta,
  title,
}: MdxCodeBlockProps) {
  if (tabs && tabs.length > 0) {
    const first = tabs[0];

    return (
      <CodeBlockTabs defaultValue={first?.label}>
        <CodeBlockTabsList>
          {tabs.map((tab) => (
            <CodeBlockTabsTrigger key={tab.label} value={tab.label}>
              {tab.label}
            </CodeBlockTabsTrigger>
          ))}
        </CodeBlockTabsList>
        {await Promise.all(
          tabs.map(async (tab) => (
            <CodeBlockTab key={tab.label} value={tab.label}>
              {await ServerCodeBlock({
                code: tab.code,
                lang: tab.language ?? language,
                meta: tab.meta as never,
                codeblock: {
                  title,
                },
              })}
            </CodeBlockTab>
          )),
        )}
      </CodeBlockTabs>
    );
  }

  if (!code) return null;

  return await ServerCodeBlock({
    code,
    lang: language,
    meta: meta as never,
    codeblock: {
      title,
    },
  });
}
