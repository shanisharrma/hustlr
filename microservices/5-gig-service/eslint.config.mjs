import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslingPluginImporter from 'eslint-plugin-import';

export default tseslint.config({
  ignores: [
    'node_modules',
    'coverage',
    'dist',
    'build',
    'Dockerfile',
    'Dockerfile.dev',
    '.dockerignore',
    '.npmrc',
    'Jenkinsfile'
  ],
  languageOptions: {
    // parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true // Enable JSX if React is used
      },
      tsconfigRootDir: import.meta.dirname
    }
  },
  files: ['**/*.ts', '**/*.tsx'],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
  plugins: {
    import: eslingPluginImporter
  },
  rules: {
    'no-multiple-empty-lines': [2, { max: 2 }],
    semi: [2, 'always'],
    curly: ['warn'],
    'prefer-template': ['warn'],
    'space-before-function-paren': [0, { anonymous: 'always', named: 'always' }],
    camelcase: 0,
    'no-return-assign': 0,
    'no-console': 'error' /* while pushing to github there shouldn't be any console log statements */,
    quotes: ['error', 'single'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 'import/no-unresolved': ['off'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type', 'object'],
        'newlines-between': 'always',
        distinctGroup: true, // This helps in separating import groups properly
        named: false,
        warnOnUnassignedImports: false
      }
    ]
  }
});
