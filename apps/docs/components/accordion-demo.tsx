'use client';

import {
  Archive,
  CalendarDays,
  FileText,
  Package,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { Accordion } from '@watanuki/ui/components/accordion';

const items = [
  {
    id: 'release-brief',
    title: 'Release Brief',
    icon: <FileText />,
    description: 'Summarize scope, owners, and go/no-go criteria before launch day.',
  },
  {
    id: 'launch-checklist',
    title: 'Launch Checklist',
    icon: <ShieldCheck />,
    description: 'Track approvals, QA gates, and rollback readiness in one place.',
  },
  {
    id: 'campaign-notes',
    title: 'Campaign Notes',
    icon: <Radio />,
    description: 'Keep messaging threads, channels, and creative assets aligned.',
  },
  {
    id: 'rollout-calendar',
    title: 'Rollout Calendar',
    icon: <CalendarDays />,
    description:
      'Plan announcements, staging checks, reminders, and quiet periods around the same timeline.',
  },
  {
    id: 'ship-build',
    title: 'Ship Build',
    icon: <Package />,
    description: 'Tag the release build and confirm deploy targets are healthy.',
  },
  {
    id: 'archive-assets',
    title: 'Archive Assets',
    icon: <Archive />,
    description: 'Store final assets and notes for the next cycle.',
  },
];

export function AccordionDemo() {
  return <Accordion items={items} defaultValue="rollout-calendar" className="my-4" />;
}
