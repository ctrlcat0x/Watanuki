'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRightLeft,
  Boxes,
  LayoutTemplate,
  Map,
  Palette,
  Rocket,
  Search,
  FileCode2,
} from 'lucide-react';
import { gitConfig } from '@/lib/shared';

const categories = [
  {
    href: '/docs/getting-started',
    title: 'Getting Started',
    description: 'Scaffold a project and ship your first MDX page.',
    icon: Rocket,
  },
  {
    href: '/docs/ui',
    title: 'UI & Layouts',
    description: 'Classic, minimal, and modern docs layout skins.',
    icon: LayoutTemplate,
  },
  {
    href: '/docs/theming',
    title: 'Theming',
    description: 'One-variable style control for color and TOC.',
    icon: Palette,
  },
  {
    href: '/docs/search',
    title: 'Search',
    description: 'Local, Algolia, or Orama Cloud — pick a provider.',
    icon: Search,
  },
  {
    href: '/docs/components',
    title: 'Components',
    description: 'Callouts, cards, tabs, and other MDX primitives.',
    icon: Boxes,
  },
  {
    href: '/docs/migration-from-fumadocs',
    title: 'Migration',
    description: 'Move from Fumadocs or Nextra with a clear map.',
    icon: ArrowRightLeft,
  },
  {
    href: '/docs/sitemap',
    title: 'Sitemap & LLMs',
    description: 'sitemap.xml, llms.txt, and machine-readable docs.',
    icon: Map,
  },
  {
    href: '/docs',
    title: 'Overview',
    description: 'What ships in core and how the packages fit together.',
    icon: FileCode2,
  },
] as const;

export function HomeLanding() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.45_0.08_55_/0.35),transparent_55%),radial-gradient(ellipse_60%_40%_at_80%_60%,oklch(0.35_0.04_240_/0.2),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <section className="relative flex min-h-[min(88vh,760px)] flex-col items-center justify-center px-6 pb-10 pt-8 text-center">
        <motion.div
          className="flex w-full max-w-xl flex-col items-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/watanuki-sticker.png"
            alt="Watanuki"
            width={720}
            height={280}
            priority
            className="h-auto w-[min(100%,28rem)] drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)] sm:w-[min(100%,32rem)]"
          />
          <h1 className="sr-only">Watanuki</h1>
          <p className="mt-6 max-w-md text-balance text-base text-fd-muted-foreground sm:text-lg">
            Opinionated docs infrastructure — Base UI, Motion, and one-variable styling.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-fd-border bg-fd-secondary/40 px-5 py-2.5 text-sm font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              GitHub
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 pb-20">
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.05 },
            },
          }}
        >
          {categories.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col gap-2 rounded-xl border border-fd-border bg-fd-card/60 p-4 transition-[background-color,border-color,transform] hover:border-fd-foreground/20 hover:bg-fd-accent/40 active:scale-[0.99]"
              >
                <item.icon
                  className="size-5 text-fd-muted-foreground transition-colors group-hover:text-fd-foreground"
                  aria-hidden
                />
                <span className="text-sm font-semibold text-fd-foreground">{item.title}</span>
                <span className="text-xs leading-relaxed text-fd-muted-foreground">
                  {item.description}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
