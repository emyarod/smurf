module.exports = {
  extends: 'airbnb',
  installedESLint: true,
  rules: {
    'no-console': ['error', {
      allow: ['log', 'warn', 'error'],
    }],
  },
};
