module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
  },
};
