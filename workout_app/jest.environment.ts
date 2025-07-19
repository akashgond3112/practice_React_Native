/**
 * Custom Jest environment to handle React Native and JSDOM conflicts
 */
import JSDOMEnvironment from 'jest-environment-jsdom';

class CustomTestEnvironment extends JSDOMEnvironment {
  constructor(config: any, options?: any) {
    super(config, options);
  }

  async setup(): Promise<void> {
    await super.setup();
    
    // Set up global properties to prevent conflicts
    if (this.global) {
      Object.defineProperty(this.global, 'window', {
        value: this.global.window || {},
        writable: true
      });
    }
  }
}

module.exports = CustomTestEnvironment;
