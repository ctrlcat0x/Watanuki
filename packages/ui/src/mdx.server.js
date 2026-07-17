import { jsx as _jsx } from "react/jsx-runtime";
import defaultMdxComponents from '@/mdx';
/**
 * Extend the default Link component to resolve relative file paths in `href`.
 *
 * @param page the current page
 * @param source the source object
 * @param OverrideLink The component to override from
 */
export function createRelativeLink(source, page, OverrideLink = defaultMdxComponents.a) {
    return async function RelativeLink({ href, ...props }) {
        return _jsx(OverrideLink, { href: href ? source.resolveHref(href, page) : href, ...props });
    };
}
export { defaultMdxComponents as default };
