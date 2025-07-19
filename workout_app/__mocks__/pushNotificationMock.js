/**
 * Mock for react-native-push-notification
 */
const PushNotification = {
  configure: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  checkPermissions: jest.fn((callback) => callback({ alert: true, badge: true, sound: true })),
  requestPermissions: jest.fn(() => Promise.resolve({ alert: true, badge: true, sound: true })),
  abandonPermissions: jest.fn(),
  getScheduledLocalNotifications: jest.fn((callback) => callback([])),
  createChannel: jest.fn((channelInfo, callback) => {
    if (callback) callback();
  }),
  popInitialNotification: jest.fn((callback) => callback(null)),
  getChannels: jest.fn((callback) => callback([])),
  channelExists: jest.fn((channelId, callback) => callback(false)),
  deleteChannel: jest.fn((channelId, callback) => {
    if (callback) callback();
  }),
};

export default PushNotification;
