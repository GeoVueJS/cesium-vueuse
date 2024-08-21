/**
 * @type {import('stylelint').Config}
 */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-recess-order',
  ],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'local'],
      },
    ],
    'selector-class-pattern': [
      '^([a-z0-9]|_|-)*$',
      {
        message: 'class 只能以 小写字母,数字, -, _ 进行命名',
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['v-bind'],
      },
    ],
  },
};
