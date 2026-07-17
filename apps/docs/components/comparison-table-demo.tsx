'use client';

import {
  Code2,
  LayoutGrid,
  Moon,
  Palette,
  Puzzle,
  Search,
  Sparkles,
  Type,
} from 'lucide-react';
import { ComparisonTable } from '@watanuki/ui/components/comparison-table';

export function ComparisonTableDemo() {
  return (
    <ComparisonTable
      columns={['Watanuki', 'Fumadocs']}
      rows={[
        {
          feature: 'Design System',
          description: 'Shared fd-* tokens and theming',
          icon: <LayoutGrid />,
          values: [true, true],
        },
        {
          feature: 'Dark Mode',
          description: 'First-class light and dark themes',
          icon: <Moon />,
          values: [true, true],
        },
        {
          feature: 'UI Primitives',
          description: 'Tabs, callouts, steppers, and more',
          icon: <Puzzle />,
          values: [true, true],
        },
        {
          feature: 'Theme Config',
          description: 'Typed watanuki.config.ts',
          icon: <Palette />,
          values: [true, 'partial'],
        },
        {
          feature: 'Search Providers',
          description: 'Orama, Algolia, and local indexes',
          icon: <Search />,
          values: [true, true],
        },
        {
          feature: 'TypeScript',
          description: 'End-to-end typed APIs',
          icon: <Code2 />,
          values: [true, true],
        },
        {
          feature: 'Typography',
          description: 'Docs-tuned prose styles',
          icon: <Type />,
          values: [true, true],
        },
        {
          feature: 'Motion Details',
          description: 'Terminal, tabs, and micro-interactions',
          icon: <Sparkles />,
          values: [true, false],
        },
      ]}
    />
  );
}
