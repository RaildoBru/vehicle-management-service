export default {
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/app.js',
    '!src/docs/*.swagger.js',
    '!src/docs/health.swagger.js',
    '!src/docs/config/*.swagger.js',
    '!src/docs/vehicle.swagger.js',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/src/generated/'

  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/generated/'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }

};
