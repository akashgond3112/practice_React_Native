/**
 * Mock for react-native-background-timer
 */

const BackgroundTimer = {
  start: jest.fn(),
  stop: jest.fn(),
  runBackgroundTimer: jest.fn((callback: () => void, interval: number) => {
    return setInterval(callback, interval);
  }),
  stopBackgroundTimer: jest.fn(() => {
    // Do nothing
  }),
  setInterval: jest.fn((callback: () => void, interval: number) => {
    return setInterval(callback, interval);
  }),
  clearInterval: jest.fn((intervalId: NodeJS.Timeout) => {
    clearInterval(intervalId);
  }),
  setTimeout: jest.fn((callback: () => void, timeout: number) => {
    return setTimeout(callback, timeout);
  }),
  clearTimeout: jest.fn((timeoutId: NodeJS.Timeout) => {
    clearTimeout(timeoutId);
  }),
};

export default BackgroundTimer;
