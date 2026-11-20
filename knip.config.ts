import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/**/*.{js,jsx,ts,tsx,mdx}', 'next.config.{js,mjs,cjs}', 'migrations/*.js'],
  ignoreDependencies: ['datocms-structured-text-utils', '@next/env'],
};

export default config;
