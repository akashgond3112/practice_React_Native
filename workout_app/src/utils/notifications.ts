/**
 * Notification utility functions for the PPL Workout App
 */

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import { getWorkoutTypeForDate } from './dateTime';

/**
 * Initialize notifications for the app
 */
export const initNotifications = (): void => {
  // Configure notifications
  configurePushNotifications();
  
  // Request notification permissions if needed
  requestNotificationPermissions();
  
  console.log('Notifications initialized');
};

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = (): void => {
  if (Platform.OS === 'ios') {
    PushNotificationIOS.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
    }).then(
      (data) => {
        console.log('PushNotificationIOS.requestPermissions success', data);
      },
      (data) => {
        console.log('PushNotificationIOS.requestPermissions failed', data);
      },
    );
  }
};

/**
 * Configure push notifications
 */
export const configurePushNotifications = (): void => {
  // Configure the notification channel for Android
  PushNotification.createChannel(
    {
      channelId: 'workout-reminders',
      channelName: 'Workout Reminders',
      channelDescription: 'Notifications for workout reminders',
      playSound: true,
      soundName: 'default',
      importance: 4, // High importance
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );

  // Configure push notifications
  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // Required on iOS only
      if (notification.finish) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    // IOS ONLY
    // Should the initial notification be popped automatically
    popInitialNotification: true,

    // Request permissions (required for iOS)
    requestPermissions: Platform.OS === 'ios',
  });
};

/**
 * Schedule a local notification
 * @param title - Notification title
 * @param message - Notification message
 * @param date - When to trigger the notification
 * @param channelId - Android notification channel ID
 */
export const scheduleLocalNotification = (
  title: string,
  message: string,
  date: Date,
  channelId: string = 'workout-reminders'
): void => {
  PushNotification.localNotificationSchedule({
    channelId,
    title,
    message,
    date,
    allowWhileIdle: true, // Works even when app is in background
    playSound: true,
    soundName: 'default',
  });
};

/**
 * Show an immediate local notification
 * @param title - Notification title
 * @param message - Notification message
 * @param channelId - Android notification channel ID
 */
export const showLocalNotification = (
  title: string,
  message: string,
  channelId: string = 'workout-reminders'
): void => {
  PushNotification.localNotification({
    channelId,
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};

/**
 * Schedule a workout reminder notification for when the user enters the gym
 * @param date - Date in YYYY-MM-DD format
 */
export const scheduleWorkoutReminder = (date: string): void => {
  const workoutType = getWorkoutTypeForDate(date);
  
  if (workoutType === 'Rest') {
    return; // Don't schedule reminders for rest days
  }
  
  showLocalNotification(
    'Time for your workout!',
    `Today's ${workoutType} day workout is ready for you.`
  );
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = (): void => {
  PushNotification.cancelAllLocalNotifications();
};
