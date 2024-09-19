import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src', 'src/app/api/**'],
  ignore: ['**/graphql/generated.ts', ''],
  ignoreDependencies: ['datocms-structured-text-utils', '@next/env', 'graphql'],
};

export default config;
