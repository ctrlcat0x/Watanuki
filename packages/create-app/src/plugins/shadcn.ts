import type { TemplatePlugin } from '@/index';
import { isNextTemplate, isReactTemplate } from '@/constants';
import { writeFile } from '@/utils';
import path from 'node:path';

function getCssPath(template: Parameters<typeof isNextTemplate>[0]) {
  if (isNextTemplate(template)) return 'app/global.css';
  if (isReactTemplate(template)) return 'src/styles/app.css';
  return 'src/styles/global.css';
}

function getAliasRoot(template: Parameters<typeof isNextTemplate>[0]) {
  return isNextTemplate(template) ? '@/components' : '@/components';
}

export function shadcn(): TemplatePlugin {
  return {
    async afterWrite() {
      const libDir = path.join(this.appDir, 'lib');

      await writeFile(
        path.join(this.dest, 'components.json'),
        `${JSON.stringify(
          {
            $schema: 'https://ui.shadcn.com/schema.json',
            style: 'new-york',
            rsc: true,
            tsx: true,
            iconLibrary: 'lucide',
            tailwind: {
              config: '',
              css: getCssPath(this.template),
              baseColor: 'neutral',
              cssVariables: true,
            },
            aliases: {
              components: getAliasRoot(this.template),
              ui: '@/components/ui',
              lib: '@/lib',
              hooks: '@/hooks',
              utils: '@/lib/utils',
            },
          },
          null,
          2,
        )}\n`,
      );

      await writeFile(path.join(libDir, 'utils.ts'), `export { cn } from './cn';\n`);
      this.log('Configured shadcn/ui aliases');
    },
  };
}
