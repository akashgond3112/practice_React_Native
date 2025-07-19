/**
 * Custom test environment that extends Node environment
 * but includes additional global mocks needed for React Native
 */
import NodeEnvironment from 'jest-environment-node';

class CustomEnvironment extends NodeEnvironment {
  constructor(config: any, options?: any) {
    super(config, options);
  }

  async setup(): Promise<void> {
    await super.setup();
    
    // Add any custom setup here that should be available in all test environments
    if (this.global) {
      Object.defineProperty(this.global, '__DEV__', {
        value: true,
        writable: true
      });
    }
  }
}

module.exports = CustomEnvironment;
