const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const os = require('os');

// Polyfill for older Node.js versions that don't have os.availableParallelism
if (!os.availableParallelism) {
  os.availableParallelism = () => {
    return Math.max(os.cpus().length - 1, 1);
  };
}

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
