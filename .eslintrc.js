// @format

module.exports = {
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script'
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    _: false,
    $: false,
    PIXI: false,
    g: false
  },
  rules: {
    'no-use-before-define': ['error', { functions: false }], // Can use hoisting of functions
    'no-param-reassign': ['error', { props: false }], // Do not warn for reassigning properties (must be for express, example request.session)
    'prefer-destructuring': 0, // Will not throw errors on syntax like: var something = request.body.something;
    'no-underscore-dangle': ['error', { allow: ['_id'] }], // Allow dangle for _id mongodb property
    'object-shorthand': ['error', 'consistent'], // Can use { variable: variable } in objects
    'prefer-template': 0, // Disable so it is not always needed to use `template strings`
    'arrow-body-style': ['error', 'always'], // Always braces when using arrow functions
    'no-console': 0 // Allow console.log and not show any warnings
  }
};
