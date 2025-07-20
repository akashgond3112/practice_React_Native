/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('@react-native/metro-config');
const os = require('os');

// Polyfill for older Node.js versions that don't have os.availableParallelism
if (!('availableParallelism' in os)) {
  os.availableParallelism = () => {
    return Math.max(os.cpus().length - 1, 1);
  };
}

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  // Add TypeScript extensions to the resolver
  config.resolver.sourceExts = [
    ...config.resolver.sourceExts, 
    'ts', 
    'tsx'
  ];
  
  return config;
})();
