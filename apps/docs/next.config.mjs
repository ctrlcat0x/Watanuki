import { createMDX } from '@watanuki/mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      'onnxruntime-node': { browser: './empty.js' },
    },
  },
};

export default withMDX(config);
