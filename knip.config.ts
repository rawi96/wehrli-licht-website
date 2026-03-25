import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/**/*.{js,jsx,ts,tsx,mdx}', 'next.config.{js,mjs,cjs}'],
  ignore: ['**/graphql/generated.ts'],
  ignoreDependencies: ['datocms-structured-text-utils', '@next/env', 'graphql'],
};

export default config;
