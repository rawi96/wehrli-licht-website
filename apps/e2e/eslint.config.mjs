import { config } from '@smartive/eslint-config';

export default [...config('typescript'), { ignores: ['playwright-report/**', 'test-results/**', 'eslint.config.mjs'] }];
