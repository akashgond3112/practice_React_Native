module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        '@babel/plugin-transform-react-jsx',
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }]
      ]
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-sqlite-storage|@react-navigation|react-native-background-timer|react-native-push-notification|@react-native-community|react-native-background-actions|react-native-background-fetch)/)'
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/__mocks__/fileMock.js',
  },
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/babel.config.js'
  ],
  // Override the testEnvironment to 'node' for all tests, regardless of what's in the test files
  // This makes tests more stable and avoids jsdom-related issues
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  // To fix "SyntaxError: Missing semicolon." error related to TypeScript
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsconfig: 'tsconfig.jest.json'
    }
  }
};
