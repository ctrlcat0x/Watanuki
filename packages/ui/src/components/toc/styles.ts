'use client';
import type { WatanukiTOCStyle } from '@watanuki/theme/config';
import * as TocAccent from './accent';
import * as TocClerk from './clerk';
import * as TocDefault from './default';

export type TOCStyle =
  | WatanukiTOCStyle
  | 'normal'
  | 'clerk'
  | 'line'
  | 'step'
  | 'accent';

export type TOCStyleProps =
  | {
      style?: 'clerk' | 'line' | 'normal';
      list?: TocDefault.TOCItemsProps;
    }
  | {
      style: 'tab' | 'step';
      list?: TocClerk.TOCItemsProps;
    }
  | {
      style: 'basic' | 'accent';
      list?: TocAccent.TOCItemsProps;
    };

export function normalizeTOCStyle(style?: TOCStyle): WatanukiTOCStyle {
  if (!style || style === 'normal' || style === 'line') return 'clerk';
  if (style === 'step') return 'tab';
  if (style === 'accent') return 'basic';
  return style as WatanukiTOCStyle;
}

export function resolveTOCStyle(style?: TOCStyle) {
  switch (normalizeTOCStyle(style)) {
    case 'tab':
      return TocClerk;
    case 'basic':
      return TocAccent;
    default:
      return TocDefault;
  }
}
