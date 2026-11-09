import tseslint from 'typescript-eslint';

const tests = ['**/*.test.{ts,tsx}', '**/__tests__/**', '**/fixtures/**'];
const noRandom = {
  object: 'Math',
  property: 'random',
  message: 'Runtime code must not generate random or synthetic data (docs/DATA_ARCHITECTURE.md, principle 2).',
};
const noWallClock = ['Date.now', 'performance.now'].map((name) => {
  const [object, property] = name.split('.');
  return { object, property, message: 'Engines must read time from the injected Clock (principle 7).' };
});

export default [
  { ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', 'docs/**'] },
  ...tseslint.configs.recommended,
  {
    files: ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
    ignores: tests,
    rules: { 'no-restricted-properties': ['error', noRandom] },
  },
  {
    files: ['packages/{engines,replay,indicators,alerts,execution}/src/**/*.{ts,tsx}'],
    ignores: tests,
    rules: {
      'no-restricted-properties': ['error', noRandom, ...noWallClock],
      'no-restricted-syntax': [
        'error',
        {
          selector: `NewExpression[callee.name='Date'][arguments.length=0]`,
          message: 'Engines must read time from the injected Clock (principle 7).',
        },
      ],
    },
  },
];
