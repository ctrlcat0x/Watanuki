import defaultMdxComponents from '@watanuki/ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { ComparisonTableDemo } from '@/components/comparison-table-demo';
import { AccordionDemo } from '@/components/accordion-demo';
import { createGenerator } from '@watanuki/typescript';
import { AutoTypeTable } from '@watanuki/typescript/ui';

const generator = createGenerator();

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ComparisonTableDemo,
    AccordionDemo,
    AutoTypeTable: (props: Omit<ComponentProps<typeof AutoTypeTable>, 'generator'>) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
