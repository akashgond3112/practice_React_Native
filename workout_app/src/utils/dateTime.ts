/**
 * Date and time utility functions for the PPL Workout App
 */

/**
 * Format a date as YYYY-MM-DD
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get the current date as YYYY-MM-DD
 * @returns Today's date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

/**
 * Get a date that is n days from today
 * @param days - Number of days to add (or subtract if negative)
 * @returns The resulting date in YYYY-MM-DD format
 */
export const getDateOffset = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

/**
 * Get the day name (Monday, Tuesday, etc.) from a date
 * @param date - Date object or string in YYYY-MM-DD format
 * @returns The day name
 */
export const getDayName = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  return days[dateObj.getDay()];
};

/**
 * Workout type mapping
 */
export type WorkoutType = 'Push' | 'Pull' | 'Legs' | 'Rest';

/**
 * Day of week to workout type mapping
 */
export const WORKOUT_TYPE_MAPPING: Record<number, WorkoutType> = {
  1: 'Push', // Monday
  2: 'Pull', // Tuesday
  3: 'Legs', // Wednesday
  4: 'Push', // Thursday
  5: 'Pull', // Friday
  6: 'Legs', // Saturday
  0: 'Rest', // Sunday
};

/**
 * Get the workout type (Push, Pull, Legs, Rest) for a given date
 * @param date - Date object or string in YYYY-MM-DD format
 * @returns The workout type
 */
export const getWorkoutTypeForDate = (date: Date | string): WorkoutType => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  return WORKOUT_TYPE_MAPPING[dayOfWeek];
};

/**
 * Check if a time is within a specified time window
 * @param startTime - Start time in 24-hour format (HH:MM)
 * @param endTime - End time in 24-hour format (HH:MM)
 * @returns True if current time is within the window
 */
export const isTimeInWindow = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const currentTimeValue = currentHours * 60 + currentMinutes;
  const startTimeValue = startHours * 60 + startMinutes;
  const endTimeValue = endHours * 60 + endMinutes;
  
  return currentTimeValue >= startTimeValue && currentTimeValue <= endTimeValue;
};
