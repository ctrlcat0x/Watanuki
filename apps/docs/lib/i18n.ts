import { defineI18n } from '@watanuki/core/i18n';
import { defineI18nUI } from '@watanuki/ui/i18n';

export const i18n = defineI18nUI(
  defineI18n({
    languages: ['en', 'ja'],
    defaultLanguage: 'en',
    parser: 'dot',
    hideLocale: 'default-locale',
  }),
  {
    en: { displayName: 'English' },
    ja: { displayName: '日本語' },
  },
);
