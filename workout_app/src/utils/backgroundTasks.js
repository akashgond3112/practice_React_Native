/**
 * Background tasks utility functions for the PPL Workout App
 */

import BackgroundTimer from 'react-native-background-timer';
import dbManager from '../database';
import { getCurrentDate } from './dateTime';

/**
 * Setup all background tasks for the app
 */
export const setupBackgroundTasks = () => {
  console.log('Setting up background tasks...');
  
  // Schedule data cleanup
  scheduleDataCleanup();
  
  // Schedule daily reset at midnight
  scheduleDailyReset();
  
  console.log('Background tasks setup complete');
};

/**
 * Schedule data cleanup to run every 30 days
 * This will delete workout entries older than 30 days
 */
export const scheduleDataCleanup = () => {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  // Start a timer that will trigger every 30 days
  BackgroundTimer.runBackgroundTimer(() => {
    console.log('Running scheduled data cleanup...');
    performDataCleanup();
  }, THIRTY_DAYS_MS);
};

/**
 * Perform the data cleanup operation
 */
export const performDataCleanup = async () => {
  try {
    console.log('Cleaning up old workout data...');
    await dbManager.cleanupOldData();
    console.log('Data cleanup complete');
    
    // Store the last cleanup date
    saveLastCleanupDate();
    
    return true;
  } catch (error) {
    console.error('Error during data cleanup:', error);
    return false;
  }
};

/**
 * Save the last cleanup date to AsyncStorage
 */
export const saveLastCleanupDate = () => {
  const currentDate = getCurrentDate();
  // This would typically use AsyncStorage, but we're using a global variable for simplicity
  global.lastCleanupDate = currentDate;
  console.log(`Last cleanup date saved: ${currentDate}`);
};

/**
 * Schedule daily reset at midnight
 * This will prepare the next day's workout entries
 */
export const scheduleDailyReset = () => {
  // Calculate time until midnight
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0
  );
  const timeUntilMidnight = midnight.getTime() - now.getTime();

  // Set a one-time timer to trigger at midnight
  BackgroundTimer.setTimeout(() => {
    console.log('Running daily reset at midnight...');
    performDailyReset();
    
    // Schedule the next day's reset
    scheduleDailyReset();
  }, timeUntilMidnight);
};

/**
 * Perform the daily reset operation
 */
export const performDailyReset = async () => {
  try {
    console.log('Performing daily reset...');
    // Additional logic for daily reset could go here
    
    return true;
  } catch (error) {
    console.error('Error during daily reset:', error);
    return false;
  }
};

/**
 * Stop all background timers
 */
export const stopAllBackgroundTasks = () => {
  BackgroundTimer.stopBackgroundTimer();
};
