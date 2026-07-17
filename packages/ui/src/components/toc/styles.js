'use client';
import * as TocAccent from './accent';
import * as TocClerk from './clerk';
import * as TocDefault from './default';
export function normalizeTOCStyle(style) {
    if (!style || style === 'normal' || style === 'line')
        return 'clerk';
    if (style === 'step')
        return 'tab';
    if (style === 'accent')
        return 'basic';
    return style;
}
export function resolveTOCStyle(style) {
    switch (normalizeTOCStyle(style)) {
        case 'tab':
            return TocClerk;
        case 'basic':
            return TocAccent;
        default:
            return TocDefault;
    }
}
