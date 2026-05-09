export default [
  {
    ignores: ['node_modules/', 'favicon.*', '*.json'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        caches: 'readonly',
        self: 'readonly',
        Response: 'readonly',
        Intl: 'readonly',
        Request: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['warn', 'always'],
    },
  },
];
