import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  // https://github.com/antfu/eslint-config?tab=readme-ov-file#editor-specific-disables
  isInEditor: false,
  jsx: true,
  unocss: true,
  stylistic: {
    semi: true,
  },
  vue: {
    overrides: {
      'vue/valid-template-root': 'off',
      'vue/max-attributes-per-line': [
        'warn',
        {
          singleline: { max: 5 },
        },
      ],
    },
  },
  rules: {
    'import/no-duplicates': 'warn',
    'import/consistent-type-specifier-style': 'warn',
    'import/no-default-export': 'off',
  },
});
