/**
 * Mock for react-native-push-notification
 */

interface PushNotificationPermissions {
  alert: boolean;
  badge: boolean;
  sound: boolean;
}

interface ChannelInfo {
  channelId: string;
  channelName: string;
  channelDescription?: string;
  importance?: number;
  vibrate?: boolean;
}

const PushNotification = {
  configure: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  checkPermissions: jest.fn((callback: (permissions: PushNotificationPermissions) => void) => 
    callback({ alert: true, badge: true, sound: true })),
  requestPermissions: jest.fn(() => 
    Promise.resolve({ alert: true, badge: true, sound: true } as PushNotificationPermissions)),
  abandonPermissions: jest.fn(),
  getScheduledLocalNotifications: jest.fn((callback: (notifications: any[]) => void) => 
    callback([])),
  createChannel: jest.fn((channelInfo: ChannelInfo, callback?: () => void) => {
    if (callback) callback();
  }),
  popInitialNotification: jest.fn((callback: (notification: null) => void) => 
    callback(null)),
  getChannels: jest.fn((callback: (channels: string[]) => void) => 
    callback([])),
  channelExists: jest.fn((channelId: string, callback: (exists: boolean) => void) => 
    callback(false)),
  deleteChannel: jest.fn((channelId: string, callback?: () => void) => {
    if (callback) callback();
  }),
};

export default PushNotification;
