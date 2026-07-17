'use client';
import { createContext, type ReactNode, use, useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from '@watanuki/core/framework';
import { TranslationProvider } from './translations';

export { fromTranslations, T, TranslationProvider, useTranslations } from './translations';

interface LocaleItem {
  name: string;
  locale: string;
}

interface LocaleContextType {
  locale?: string;
  onChange?: (v: string) => void;
  locales?: LocaleItem[];
}

const LocaleContext = createContext<LocaleContextType>({});

export function useI18n(): LocaleContextType {
  return use(LocaleContext);
}

export interface I18nProviderProps {
  locale?: string;
  onLocaleChange?: (v: string) => void;
  translations?: Partial<Record<string, string>>;
  locales?: LocaleItem[];
  children?: ReactNode;
}

const Empty = {};

function localeFromPath(pathname: string, locales: LocaleItem[], fallback?: string) {
  const codes = new Set(locales.map((item) => item.locale));
  const first = pathname.split('/').filter((v) => v.length > 0)[0];
  if (first && codes.has(first)) return first;
  return fallback;
}

export function I18nProvider({
  locales = [],
  locale: localeProp,
  onLocaleChange,
  children,
  translations = Empty,
}: I18nProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeFromPath(pathname, locales, localeProp);

  // Keep <html lang> in sync without `headers()` in the root layout (that
  // dynamic API hangs App Router soft navigations under i18n rewrites).
  useEffect(() => {
    if (!locale) return;
    document.documentElement.lang = locale;
  }, [locale]);

  const onChange = (value: string) => {
    if (onLocaleChange) {
      return onLocaleChange(value);
    }

    const segments = pathname.split('/').filter((v) => v.length > 0);
    const localeCodes = new Set(locales.map((item) => item.locale));
    const hasLocalePrefix = segments.length > 0 && localeCodes.has(segments[0]);

    if (hasLocalePrefix) {
      segments[0] = value;
    } else {
      segments.unshift(value);
    }

    // Prefixed form always — i18n middleware strips the default locale from the URL.
    router.push(`/${segments.join('/')}`);
  };
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  return (
    <LocaleContext
      value={useMemo(
        () => ({
          locale,
          locales,
          onChange: (v) => onChangeRef.current(v),
        }),
        [locale, locales],
      )}
    >
      <TranslationProvider translations={translations}>{children}</TranslationProvider>
    </LocaleContext>
  );
}
