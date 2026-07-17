#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  cancel,
  confirm,
  group,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import pc from 'picocolors';
import { getPackageManager, managers } from './auto-install';
import { create, type Template, type TemplatePlugin } from './index';
import {
  isCI,
  searchProviders,
  stylePresets,
  templates,
  type SearchProvider,
  type StylePreset,
} from './constants';
import { Option, program } from '@commander-js/extra-typings';
import { shadcn } from './plugins/shadcn';
import { search as searchPlugin } from './plugins/search';
import { staticSearch } from './plugins/static-search';

const command = program
  .argument('[name]', 'the project name')
  .option('--install', 'install packages automatically')
  .option('--no-git', 'disable auto Git repository initialization')
  .option('--no-shadcn', 'skip shadcn/ui components.json bootstrap')
  .addOption(
    new Option('--template <name>', 'choose a template').choices(
      templates.map((item) => item.value),
    ),
  )
  .addOption(
    new Option('--search <name>', 'choose a search provider').choices(
      searchProviders.map((item) => item.value),
    ),
  )
  .addOption(
    new Option('--style <name>', 'choose a style preset').choices(
      stylePresets.map((item) => item.value),
    ),
  )
  .addOption(
    new Option('--pm <name>', 'choose a package manager')
      .choices(managers)
      .default(getPackageManager()),
  );

async function main(): Promise<void> {
  command.parse(process.argv);
  const defaultName = command.args[0];
  const config = command.opts();
  intro(pc.bgCyan(pc.bold('Create Watanuki')));

  const options = await group(
    {
      name: async () => {
        if (defaultName) return defaultName;
        if (isCI) return 'my-docs';

        return text({
          message: 'Project name',
          placeholder: 'my-docs',
          defaultValue: 'my-docs',
        });
      },
      template: async () => {
        if (config.template) return config.template;
        if (isCI) return 'next';

        return select<Template>({
          message: 'Choose a framework',
          initialValue: 'next',
          options: templates,
        });
      },
      style: async () => {
        if (config.style) return config.style;
        if (isCI) return 'classic';

        return select<StylePreset>({
          message: 'Choose a layout style',
          initialValue: 'classic',
          options: [...stylePresets],
        });
      },
      search: async () => {
        if (config.search) return config.search;
        if (isCI) return 'local';

        return select<SearchProvider>({
          message: 'Choose a search provider',
          initialValue: 'local',
          options: [...searchProviders],
        });
      },
      setupShadcn: async () => {
        if (config.shadcn !== undefined) return config.shadcn;
        return true;
      },
      installDeps: async () => {
        if (config.install !== undefined) return config.install;
        return false;
      },
    },
    {
      onCancel: () => {
        cancel('Installation stopped.');
        process.exit(0);
      },
    },
  );

  const projectName = options.name.toLowerCase().replace(/\s/, '-');
  if (!isCI) await checkDir(projectName);

  const info = spinner();
  info.start('Generating project');

  const plugins: TemplatePlugin[] = [];

  if (options.search === 'local') {
    plugins.push(staticSearch());
  } else {
    plugins.push(searchPlugin(options.search));
  }

  plugins.push({
      async afterWrite() {
        const configPath = ['next'].includes(options.template)
          ? path.join(this.dest, 'lib/watanuki.config.ts')
          : path.join(this.dest, 'src/lib/watanuki.config.ts');

        let configFile = await fs.readFile(configPath, 'utf-8');
        configFile = configFile.replace(/style:\s*'[^']*'/, `style: '${options.style}'`);
        await fs.writeFile(configPath, configFile);

        const template = templates.find((item) => item.value === options.template);
        if (!template) throw new Error(`Unknown template: ${options.template}`);

        const layoutPath = path.join(this.dest, template.appDir, template.rootProviderPath);

        let layout = await fs.readFile(layoutPath, 'utf-8');
        layout = layout.replace(
          /data-watanuki-style=\{watanukiConfig\.style\}/,
          `data-watanuki-style="${options.style}"`,
        );
        layout = layout.replace(
          /data-watanuki-style="[^"]*"/,
          `data-watanuki-style="${options.style}"`,
        );
        await fs.writeFile(layoutPath, layout);
      },
    });

  if (options.setupShadcn) {
    plugins.unshift(shadcn());
  }

  await create({
    packageManager: config.pm,
    template: options.template,
    outputDir: projectName,
    installDeps: options.installDeps,
    initializeGit: config.git,
    plugins,
    log: (message) => {
      info.message(message);
    },
  });

  info.stop('Project generated');
  outro(pc.bgGreen(pc.bold('Done')));

  const devCommand = config.pm === 'npm' || config.pm === 'bun' ? 'run dev' : 'dev';
  const installCommand =
    config.pm === 'npm' ? 'npm install' : config.pm === 'bun' ? 'bun install' : `${config.pm} install`;

  console.log(pc.bold('\nNext steps'));
  console.log(pc.cyan(`  cd ${projectName}`));
  if (!options.installDeps) {
    console.log(pc.cyan(`  ${installCommand}`));
  }
  console.log(pc.cyan(`  ${config.pm} ${devCommand}`));
  console.log(pc.dim('\nDocs live at /docs. Edit content in content/docs.'));
  if (options.search === 'local') {
    console.log(pc.dim('Search uses built-in fuzzy over /static.json — no API route needed.'));
  } else if (options.search === 'algolia') {
    console.log(pc.dim('Search uses Algolia — set ALGOLIA_* env vars from .env.example.'));
  } else if (options.search === 'orama') {
    console.log(pc.dim('Search uses Orama Cloud — set ORAMA_* env vars from .env.example.'));
  }

  process.exit(0);
}

async function checkDir(outputDir: string) {
  const destDir = await fs.readdir(outputDir).catch(() => null);
  if (!destDir || destDir.length === 0) return;
  const del = await confirm({
    message: `Directory ${outputDir} already exists. Delete its files?`,
  });

  if (isCancel(del)) {
    cancel();
    process.exit(1);
  }

  if (!del) return;

  const info = spinner();
  info.start(`Deleting files in ${outputDir}`);

  await Promise.all(
    destDir.map((item) => {
      return fs.rm(path.join(outputDir, item), {
        recursive: true,
        force: true,
      });
    }),
  );

  info.stop(`Deleted files in ${outputDir}`);
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
