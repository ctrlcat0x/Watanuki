import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts', './src/config.ts', './src/theme-init.ts', './src/react.ts'],
  format: 'esm',
  target: 'es2023',
  platform: 'browser',
  dts: { sourcemap: false },
  fixedExtension: false,
  deps: { neverBundle: ['cnfast', 'react', 'react-dom', '@base-ui/react', 'lucide-react'] },
  exports: { enabled: false },
});
