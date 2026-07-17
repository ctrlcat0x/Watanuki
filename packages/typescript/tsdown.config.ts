import { defineConfig } from 'tsdown';

export default defineConfig({
  format: 'esm',
  target: 'es2023',
  entry: ['./src/index.ts', './src/ui/index.tsx'],
  fixedExtension: false,
  dts: {
    sourcemap: false,
  },
  deps: {
    onlyBundle: [],
  },
  exports: true,
});
