/**
 * Custom Jest environment to handle React Native and JSDOM conflicts
 */
const JSDOMEnvironment = require('jest-environment-jsdom').default;

class CustomTestEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    
    // Set up global.window to prevent conflicts
    if (this.global.window === undefined) {
      this.global.window = {};
    }
  }
}

module.exports = CustomTestEnvironment;
