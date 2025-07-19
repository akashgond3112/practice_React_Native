import { getDefaultConfig, mergeConfig } from '@react-native/metro-config';
import * as os from 'os';

// Polyfill for older Node.js versions that don't have os.availableParallelism
if (!('availableParallelism' in os)) {
  (os as any).availableParallelism = (): number => {
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

export default mergeConfig(getDefaultConfig(__dirname), config);
