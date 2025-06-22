const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  
  // Projects configuration for monorepo
  projects: [
    '<rootDir>/apps/*/jest.config.js',
    '<rootDir>/libs/*/jest.config.js',
  ],
  
  // Global coverage
  coverageDirectory: '<rootDir>/coverage',
  
  // Collect coverage from all workspaces
  collectCoverageFrom: [
    'apps/*/src/**/*.{js,jsx,ts,tsx}',
    'libs/*/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/.next/**',
  ],
  
  // Root test setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};