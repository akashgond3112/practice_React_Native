/**
 * Mock for @react-native-community/push-notification-ios
 */

interface PushNotificationPermissions {
  alert: boolean;
  badge: boolean;
  sound: boolean;
}

const PushNotificationIOS = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve({ alert: true, badge: true, sound: true } as PushNotificationPermissions)),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn((callback: (permissions: PushNotificationPermissions) => void) => 
    callback({ alert: true, badge: true, sound: true })),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  constructor: jest.fn(),
  getScheduledLocalNotifications: jest.fn((callback: (notifications: any[]) => void) => callback([])),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn((callback: (badgeCount: number) => void) => callback(0)),
  cancelAllLocalNotifications: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  addNotificationRequest: jest.fn(),
  removeAllPendingNotificationRequests: jest.fn(),
  removePendingNotificationRequests: jest.fn(),
  setNotificationCategories: jest.fn(),
  getNotificationCategories: jest.fn((callback: (categories: string[]) => void) => callback([])),
};

export default PushNotificationIOS;
