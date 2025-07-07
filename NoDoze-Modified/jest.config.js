module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.css$': 'identity-obj-proxy',
    // Mock Electron
    '^electron$': '<rootDir>/src/__tests__/__mocks__/electron.ts'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  // Setup separate configurations for main and renderer processes
  projects: [
    {
      displayName: 'main',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/main/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
        }],
      },
    },
    {
      displayName: 'renderer',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/renderer/**/*.test.tsx'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
        }],
      },
    },
  ],
  // Fixes the "SyntaxError: Cannot use import statement outside a module" error
  transformIgnorePatterns: [
    "node_modules/(?!.*\\.mjs$)"
  ],
};