import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fromTranslations } from '../src/contexts/translations';
import { describe, expect, test } from 'vitest';

test('translation helper applies context and variables', () => {
  const translate = fromTranslations(
    {
      'Hello {name}(navigation)': 'Welcome {name}',
    },
    { note: 'navigation' },
  );

  expect(translate('Hello {name}', { variables: { name: 'Watanuki' } })).toBe(
    'Welcome Watanuki',
  );
});

describe('JSX translations', () => {
  const translate = fromTranslations({});
  const render = (node: React.ReactNode) =>
    renderToStaticMarkup(createElement('div', null, node));

  test('renders paired, nested, and self-closing tags', () => {
    const output = translate.jsx(
      'Read <bold><link>docs</link></bold> or <signup/>',
      {
        tags: {
          bold: createElement('b'),
          link: (children) => createElement('a', { href: '/docs' }, children),
          signup: () => createElement('button', { type: 'button' }, 'Sign up'),
        },
      },
    );

    expect(render(output)).toBe(
      '<div>Read <b><a href="/docs">docs</a></b> or <button type="button">Sign up</button></div>',
    );
  });

  test('renders React variables and escaped markup', () => {
    expect(
      render(
        translate.jsx('Hello {name}; use \\{value} and \\<tag>', {
          variables: { name: createElement('strong', null, 'Watanuki') },
          tags: {},
        }),
      ),
    ).toBe('<div>Hello <strong>Watanuki</strong>; use {value} and &lt;tag&gt;</div>');
  });
});
