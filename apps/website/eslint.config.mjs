import { config as smartiveConfig } from '@smartive/eslint-config';
import { tailwindConfig } from '@wehrli/design-system/eslint';

// Architecture boundaries (docs/adr/0001-website-architecture.md).

/** SDKs of external systems and the generated DatoCMS GraphQL code: only inside src/integrations. */
const externalSystemMessage = 'External systems are used only in src/integrations (ADR 0001). Add what you need to a port.';
const externalSystems = {
  paths: ['stripe', 'resend', 'botid/server', 'datocms-structured-text-utils', 'react-datocms'].map((name) => ({
    name,
    message: externalSystemMessage,
  })),
  patterns: [
    { group: ['@datocms/*', 'react-datocms/*', '@/graphql/*'], message: externalSystemMessage },
    {
      group: ['@/integrations/*', '!@/integrations/client'],
      message: "Import integrations only through '@/integrations' or '@/integrations/client' (composition roots).",
    },
  ],
};

const restrict = (...groups) => ({
  'no-restricted-imports': [
    'error',
    {
      paths: groups.flatMap((group) => group.paths ?? []),
      patterns: groups.flatMap((group) => group.patterns ?? [group]),
    },
  ],
});

const layer = (group, message) => ({ group, message });

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs', 'graphql/generated.ts'],
  },
  ...smartiveConfig('nextjs'),
  tailwindConfig('src/styles/globals.css'),
  {
    rules: {
      '@smartive-eslint/forbid-component-props': 'off',
    },
  },
  {
    files: ['src/**'],
    ignores: ['src/integrations/**'],
    rules: restrict(externalSystems),
  },
  {
    files: ['src/domain/**'],
    rules: restrict(
      externalSystems,
      layer(
        [
          'react',
          'react-dom',
          'next',
          'next/*',
          '@wehrli/design-system',
          '@/integrations',
          '@/integrations/*',
          '@/ports/*',
          '@/features/*',
          '@/components/*',
          '@/app/*',
        ],
        'domain is plain TypeScript: business types and rules without frameworks or other layers.',
      ),
    ),
  },
  {
    files: ['src/ports/**'],
    rules: restrict(
      externalSystems,
      layer(
        [
          'react-dom',
          'next',
          'next/*',
          '@wehrli/design-system',
          '@/integrations',
          '@/integrations/*',
          '@/features/*',
          '@/components/*',
          '@/app/*',
        ],
        'ports describe what the app needs, in domain types only.',
      ),
    ),
  },
  {
    files: ['src/features/**'],
    rules: restrict(
      externalSystems,
      layer(
        ['@/components/*', '@/app/*'],
        'features hold use cases; UI and routing depend on them, not the other way round.',
      ),
    ),
  },
  {
    files: ['src/integrations/**'],
    rules: restrict(
      layer(['@/features/*', '@/app/*'], 'integrations implement ports; they never depend on features or routing.'),
    ),
  },
];
