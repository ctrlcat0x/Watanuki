'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  FileText,
  Hash,
  History,
} from 'lucide-react';
import { Fragment, type ReactNode, use, useEffect, useMemo, useState } from 'react';
import { type SearchClient, useDocsSearch } from '@watanuki/core/search/client';
import { fetchClient } from '@watanuki/core/search/client/fetch';
import { useRouter } from '@watanuki/core/framework';
import type { SortedResult } from '@watanuki/core/search';
import { useI18n } from '@/contexts/i18n';
import type { SharedProps } from '@/contexts/search';
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { addRecentSearch, getRecentSearches } from './recent-searches';

/** Render Orama hit content — highlights arrive as `<mark>` wrappers. */
function HitContent({ content }: { content: string }) {
  const nodes: ReactNode[] = [];
  const re = /<mark>(.*?)<\/mark>/gi;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(content))) {
    if (match.index > last) nodes.push(content.slice(last, match.index));
    nodes.push(
      <mark key={key++} className="bg-transparent text-fd-primary underline">
        {match[1]}
      </mark>,
    );
    last = match.index + match[0].length;
  }

  if (last < content.length) nodes.push(content.slice(last));
  return <>{nodes.length > 0 ? nodes : content}</>;
}

export interface CommandSearchDialogProps extends SharedProps {
  /**
   * When `static`, load indexes from a prebuilt JSON dump (e.g. `/static.json`).
   * Otherwise fetch results from a runtime search API.
   */
  type?: 'static';
  api?: string;
  delayMs?: number;
}

interface ResultGroup {
  value: string;
  items: SortedResult[];
}

function groupResults(items: SortedResult[]): ResultGroup[] {
  const pages: SortedResult[] = [];
  const sections: SortedResult[] = [];

  for (const item of items) {
    if (item.type === 'page') pages.push(item);
    else sections.push(item);
  }

  const groups: ResultGroup[] = [];
  if (pages.length > 0) groups.push({ value: 'Pages', items: pages });
  if (sections.length > 0) groups.push({ value: 'Sections', items: sections });
  return groups;
}

let STATIC: Promise<typeof import('@watanuki/core/search/client/orama-static')> | undefined;

export default function CommandSearchDialog({
  type = 'static',
  api = '/static.json',
  delayMs,
  open,
  onOpenChange,
}: CommandSearchDialogProps) {
  const { locale } = useI18n();
  const router = useRouter();
  const [recent, setRecent] = useState<string[]>([]);

  let client: SearchClient;
  if (type === 'static') {
    client = use((STATIC ??= import('@watanuki/core/search/client/orama-static'))).oramaStaticClient(
      {
        from: api,
        locale,
      },
    );
  } else {
    client = fetchClient({ api, locale });
  }

  const { search, setSearch, query } = useDocsSearch({ client, delayMs });

  useEffect(() => {
    if (open) setRecent(getRecentSearches());
  }, [open]);

  const groups = useMemo(() => {
    if (!query.data || query.data === 'empty') return [];
    return groupResults(query.data);
  }, [query.data]);

  const isEmptyQuery = search.trim().length === 0;

  const handleSelect = (item: SortedResult) => {
    const q = search.trim();
    if (q) setRecent(addRecentSearch(q));
    router.push(item.url);
    onOpenChange(false);
  };

  const handleRecentSelect = (q: string) => {
    setSearch(q);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandDialogPopup>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search documentation..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandPanel>
            {!isEmptyQuery && <CommandEmpty>No results found.</CommandEmpty>}
            <CommandList>
              {isEmptyQuery ? (
                recent.length > 0 ? (
                  <CommandGroup heading="Recent">
                    <CommandCollection>
                      {recent.map((q) => (
                        <CommandItem
                          key={q}
                          value={`recent:${q}`}
                          onSelect={() => handleRecentSelect(q)}
                        >
                          <History />
                          <span className="flex-1 truncate">{q}</span>
                        </CommandItem>
                      ))}
                    </CommandCollection>
                  </CommandGroup>
                ) : (
                  <div className="py-8 text-center text-sm text-fd-muted-foreground">
                    No recent searches
                  </div>
                )
              ) : (
                groups.map((group, index) => (
                  <Fragment key={group.value}>
                    <CommandGroup heading={group.value}>
                      <CommandCollection>
                        {group.items.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={item.id}
                            onSelect={() => handleSelect(item)}
                          >
                            {item.type === 'page' ? <FileText /> : <Hash />}
                            <span className="flex-1 truncate">
                              <HitContent content={item.content} />
                            </span>
                          </CommandItem>
                        ))}
                      </CommandCollection>
                    </CommandGroup>
                    {index < groups.length - 1 && <CommandSeparator />}
                  </Fragment>
                ))
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span>Open</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
