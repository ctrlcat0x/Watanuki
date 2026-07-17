'use client';

import {
  type ComponentProps,
  createContext,
  use,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Tabs as Primitive } from '@base-ui/react/tabs';
import { mergeRefs } from '@/utils/merge-refs';

type ChangeListener = (v: string) => void;
const listeners = new Map<string, Set<ChangeListener>>();

export interface TabsProps extends ComponentProps<typeof Primitive.Root> {
  /**
   * Identifier for sharing value across tab groups (sessionStorage key).
   * Use the same `groupId` on MDX `<Tabs>` and code tabs (`tab-group="…"`)
   * so matching labels stay in sync.
   */
  groupId?: string;

  /**
   * Persist selection in localStorage (in addition to sessionStorage)
   */
  persist?: boolean;

  /**
   * Sync active tab with a URL search param (`?groupId=value`).
   * When `true`, uses `groupId` as the param name. When a string, uses that name.
   */
  queryString?: boolean | string;

  /**
   * If true, updates the URL hash based on the tab's id
   */
  updateAnchor?: boolean;

  onValueChange?: (value: string) => void;
}

const TabsContext = createContext<{
  valueToIdMap: Map<string, string>;
} | null>(null);

function useTabContext() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('You must wrap your component in <Tabs>');
  return ctx;
}

export const TabsList = Primitive.List;

export const TabsTrigger = Primitive.Tab;

export const TabsIndicator = Primitive.Indicator;

export function Tabs({
  ref,
  groupId,
  persist = false,
  queryString = false,
  updateAnchor = false,
  defaultValue,
  value: _value,
  onValueChange: _onValueChange,
  ...props
}: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const valueToIdMap = useMemo(() => new Map<string, string>(), []);
  const queryKey =
    queryString === true ? groupId : typeof queryString === 'string' ? queryString : undefined;
  const [value, setValue] =
    _value === undefined
      ? // eslint-disable-next-line react-hooks/rules-of-hooks -- not supposed to change controlled/uncontrolled
        useState(defaultValue)
      : // eslint-disable-next-line react-hooks/rules-of-hooks -- not supposed to change controlled/uncontrolled
        [_value, useEffectEvent((v: string) => _onValueChange?.(v))];

  useLayoutEffect(() => {
    if (!groupId) return;

    const fromQuery = queryKey
      ? new URLSearchParams(window.location.search).get(queryKey)
      : null;
    if (fromQuery) {
      setValue(fromQuery);
    } else {
      let previous = sessionStorage.getItem(groupId);
      if (persist) previous ??= localStorage.getItem(groupId);
      if (previous) setValue(previous);
    }

    const groupListeners = listeners.get(groupId) ?? new Set();
    groupListeners.add(setValue);
    listeners.set(groupId, groupListeners);
    return () => {
      groupListeners.delete(setValue);
    };
  }, [groupId, persist, queryKey, setValue]);

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    for (const [value, id] of valueToIdMap.entries()) {
      if (id === hash) {
        setValue(value);
        tabsRef.current?.scrollIntoView();
        break;
      }
    }
  }, [setValue, valueToIdMap]);

  return (
    <Primitive.Root
      ref={mergeRefs(ref, tabsRef)}
      value={value}
      onValueChange={(v: string) => {
        if (updateAnchor) {
          const id = valueToIdMap.get(v);

          if (id) {
            window.history.replaceState(null, '', `#${id}`);
          }
        }

        if (queryKey) {
          const url = new URL(window.location.href);
          url.searchParams.set(queryKey, v);
          window.history.replaceState(null, '', url);
        }

        if (groupId) {
          const groupListeners = listeners.get(groupId);
          if (groupListeners) {
            for (const listener of groupListeners) listener(v);
          }

          sessionStorage.setItem(groupId, v);
          if (persist) localStorage.setItem(groupId, v);
        } else {
          setValue(v);
        }
      }}
      {...props}
    >
      <TabsContext value={useMemo(() => ({ valueToIdMap }), [valueToIdMap])}>
        {props.children}
      </TabsContext>
    </Primitive.Root>
  );
}

export function TabsContent({ value, ...props }: ComponentProps<typeof Primitive.Panel>) {
  const { valueToIdMap } = useTabContext();

  if (props.id) {
    valueToIdMap.set(value, props.id);
  }

  return (
    <Primitive.Panel value={value} {...props}>
      {props.children}
    </Primitive.Panel>
  );
}
