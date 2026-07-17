'use client';
import type { ComponentProps } from 'react';
import { useI18n } from '@/contexts/i18n';
import { useTranslations } from '@/contexts/translations';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import { Check, Languages } from 'lucide-react';

export interface LanguageSelectProps extends ComponentProps<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
  popoverSide?: 'top' | 'bottom';
  matchAnchor?: boolean;
}

export function LanguageSelect({
  className,
  variant = 'ghost',
  popoverSide = 'bottom',
  matchAnchor = false,
  children,
  ...rest
}: LanguageSelectProps): React.ReactElement {
  const context = useI18n();
  const t = useTranslations({ note: 'language switcher' });
  if (!context.locales) throw new Error('Missing `<I18nProvider />`');

  const chooseLanguage = t('Choose a language');

  return (
    <Popover>
      <PopoverTrigger
        data-language-select=""
        aria-label={t('Choose a language', { note: 'aria-label' })}
        className={(s) =>
          cn(buttonVariants({ variant }), 'gap-1.5 p-1.5', s.open && 'bg-fd-accent', className)
        }
        {...rest}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        side={popoverSide}
        align="start"
        matchAnchor={matchAnchor}
        className="w-full p-0"
      >
        <div className="flex h-[min(16rem,calc(100vh-8rem))] flex-col">
          <div className="sticky top-0 z-10 border-b bg-fd-popover/90 px-3 py-2 backdrop-blur-lg">
            <p className="text-xs font-medium text-fd-muted-foreground">{chooseLanguage}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mask-[linear-gradient(to_bottom,transparent,white_10px,white_calc(100%-10px),transparent)]">
            <div className="flex flex-col gap-0.5">
              {context.locales.map((item) => (
                <button
                  key={item.locale}
                  type="button"
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 text-start text-sm rounded-lg transition-colors',
                    item.locale === context.locale
                      ? 'bg-fd-primary/10 text-fd-primary'
                      : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
                  )}
                  onClick={() => {
                    context.onChange?.(item.locale);
                  }}
                >
                  <Languages className="size-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.locale === context.locale && <Check className="size-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export type LanguageSelectTextProps = ComponentProps<'span'>;

export function LanguageSelectText(props: LanguageSelectTextProps) {
  const { locales, locale } = useI18n();
  const text = locales?.find((item) => item.locale === locale)?.name;

  return <span className="flex-1 truncate" {...props}>{text}</span>;
}
