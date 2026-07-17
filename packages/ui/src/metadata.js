function toAbsoluteUrl(baseUrl, path) {
    return new URL(path, baseUrl).toString();
}
export function createDocsMetadata({ title, description, path, image, baseUrl, siteName, }) {
    const canonical = toAbsoluteUrl(baseUrl, path);
    const ogImage = image ? toAbsoluteUrl(baseUrl, image) : undefined;
    return {
        title,
        description,
        alternates: {
            canonical,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            type: 'article',
            url: canonical,
            title,
            description,
            siteName,
            images: ogImage ? [ogImage] : undefined,
        },
        twitter: {
            card: ogImage ? 'summary_large_image' : 'summary',
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}
export function createDocsJsonLd({ title, description, path, image, baseUrl, }) {
    const url = toAbsoluteUrl(baseUrl, path);
    return {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: title,
        description,
        url,
        image: image ? [toAbsoluteUrl(baseUrl, image)] : undefined,
    };
}
