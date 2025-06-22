const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'test-utils',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}',
  ],
};