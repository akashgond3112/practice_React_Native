const NodeEnvironment = require('jest-environment-node').default;

/**
 * Custom test environment that extends Node environment
 * but includes additional global mocks needed for React Native
 */
class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    
    // Add any custom setup here that should be available in all test environments
    this.global.__DEV__ = true;
  }
}

module.exports = CustomEnvironment;
