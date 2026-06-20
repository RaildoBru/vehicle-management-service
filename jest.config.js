export default {
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/app.js'
  ],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/src/generated/'

  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/generated/'
  ],

};
