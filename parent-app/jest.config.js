module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
        },
      },
    ],
  },
};
