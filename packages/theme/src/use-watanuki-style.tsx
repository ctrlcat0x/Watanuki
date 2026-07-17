'use client';

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import type { WatanukiStyle } from './config';

const StyleContext = createContext<WatanukiStyle | null>(null);

function getStyle(): WatanukiStyle | null {
  if (typeof document === 'undefined') return null;
  return document.documentElement.getAttribute('data-watanuki-style') as WatanukiStyle | null;
}

export function WatanukiStyleProvider({
  style,
  children,
}: {
  style: WatanukiStyle;
  children: ReactNode;
}) {
  return <StyleContext.Provider value={style}>{children}</StyleContext.Provider>;
}

export function useWatanukiStyle(): WatanukiStyle | null {
  const fallback = useContext(StyleContext);
  return useSyncExternalStore(
    (onStoreChange) => {
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-watanuki-style'],
      });
      return () => observer.disconnect();
    },
    getStyle,
    () => fallback,
  ) ?? fallback;
}
