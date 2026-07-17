import translationKeys from '@/.translations/keys.json';
export function uiTranslations() {
    return { keys: translationKeys };
}
export function i18nProvider(translations, lang) {
    const t = translations.extend(uiTranslations());
    if ('config' in t) {
        const { defaultLanguage, languages } = t.config;
        const locale = lang ?? defaultLanguage;
        return {
            locale: lang,
            translations: t.get(locale) ?? t.get(defaultLanguage),
            locales: languages.map((code) => ({
                locale: code,
                // default language is English
                name: t.get(code).displayName ?? 'English',
            })),
        };
    }
    return {
        translations: t.get(),
    };
}
export function defineI18nUI(config, localeTranslations = {}) {
    return {
        ...config,
        provider(locale = config.defaultLanguage) {
            const t = localeTranslations[locale];
            return {
                locale,
                translations: t,
                locales: config.languages.map((code) => ({
                    locale: code,
                    name: localeTranslations[code]?.displayName ?? code,
                })),
            };
        },
    };
}
