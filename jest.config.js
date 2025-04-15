const config = {
  silent: false,
  moduleNameMapper: {
    '^test-utils': '<rootDir>/src/test/setupTest.js',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
    '^Components(.*)$': '<rootDir>/src/components$1',
    '^App(.*)$': '<rootDir>/src/app$1',
    '^Utilities(.*)$': '<rootDir>/src/utilities$1',
    '^Services(.*)$': '<rootDir>/src/services$1',
    '^Constants(.*)$': '<rootDir>/src/constants$1',
    '^Pages(.*)$': '<rootDir>/src/pages$1',
    '^Hooks(.*)$': '<rootDir>/src/hooks$1',
    '^Routes(.*)$': '<rootDir>/src/routes$1',
  },
  // by default jest ignores node modules, but vg-library code is needed to be transformed
  // otherwise parsing error is received
  transformIgnorePatterns: ['/node_modules/(?!(vg-library)/)'],
  transform: {
    '^.+\\.(js)$': 'babel-jest',
  },
  testMatch: ['<rootDir>/src/**/*.test.js'],
  testPathIgnorePatterns: ['<rootDir>/src/test'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/assets/**',
    '!src/test/**',
    '!src/**/*.test.js',
  ],
  moduleDirectories: ['node_modules'],
  globals: {
    API: true,
    PUBLIC_URL: '/app',
  },
};

module.exports = config;
