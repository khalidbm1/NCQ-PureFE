const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'utils',
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/*.test.{js,ts}',
    '<rootDir>/src/**/*.spec.{js,ts}',
  ],
};