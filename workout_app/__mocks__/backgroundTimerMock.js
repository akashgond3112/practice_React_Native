/**
 * Mock for react-native-background-timer
 */
const BackgroundTimer = {
  start: jest.fn(),
  stop: jest.fn(),
  runBackgroundTimer: jest.fn((callback, interval) => {
    return setInterval(callback, interval);
  }),
  stopBackgroundTimer: jest.fn(() => {
    // Do nothing
  }),
  setInterval: jest.fn((callback, interval) => {
    return setInterval(callback, interval);
  }),
  clearInterval: jest.fn((intervalId) => {
    clearInterval(intervalId);
  }),
  setTimeout: jest.fn((callback, timeout) => {
    return setTimeout(callback, timeout);
  }),
  clearTimeout: jest.fn((timeoutId) => {
    clearTimeout(timeoutId);
  }),
};

export default BackgroundTimer;
