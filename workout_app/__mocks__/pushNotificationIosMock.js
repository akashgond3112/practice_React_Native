/**
 * Mock for @react-native-community/push-notification-ios
 */
const PushNotificationIOS = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve({ alert: true, badge: true, sound: true })),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn((callback) => callback({ alert: true, badge: true, sound: true })),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  constructor: jest.fn(),
  getScheduledLocalNotifications: jest.fn((callback) => callback([])),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn((callback) => callback(0)),
  cancelAllLocalNotifications: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  addNotificationRequest: jest.fn(),
  removeAllPendingNotificationRequests: jest.fn(),
  removePendingNotificationRequests: jest.fn(),
  setNotificationCategories: jest.fn(),
  getNotificationCategories: jest.fn((callback) => callback([])),
};

export default PushNotificationIOS;
