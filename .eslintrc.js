module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Enforce the rules of hooks
    'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none', // Do not warn for unused function arguments
        ignoreRestSiblings: true, // Ignore unused variables when using rest siblings
      },
    ], // Change unused variables to warnings instead of errors
    'quotes': [
      'error',
      'single',
      { avoidEscape: true }, // Allow single quotes in JSX when escaped
    ],
    'react/jsx-uses-react': 'off', // Disable for React 17+ with new JSX transform
    'react/react-in-jsx-scope': 'off', // Disable for React 17+ with new JSX transform
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
