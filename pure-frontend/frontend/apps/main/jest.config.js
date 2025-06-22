const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: 'main-app',
  rootDir: '.',
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@ncq/design-system$': '<rootDir>/../../libs/design-system/src',
    '^@ncq/utils$': '<rootDir>/../../libs/utils/src',
  },
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.js'],
  testMatch: [
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}',
  ],
};