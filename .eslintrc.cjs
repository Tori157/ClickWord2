module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'vue/valid-attribute-name': 'off',
    'vue/multi-word-component-names': 'off',
  },
  parser: 'vue-eslint-parser',
};