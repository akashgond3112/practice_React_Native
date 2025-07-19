/**
 * Date and time utility functions for the PPL Workout App
 */

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get the current date as YYYY-MM-DD
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getCurrentDate = () => {
  return formatDate(new Date());
};

/**
 * Get a date that is n days from today
 * @param {number} days - Number of days to add (or subtract if negative)
 * @returns {string} The resulting date in YYYY-MM-DD format
 */
export const getDateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

/**
 * Get the day name (Monday, Tuesday, etc.) from a date
 * @param {Date|string} date - Date object or string in YYYY-MM-DD format
 * @returns {string} The day name
 */
export const getDayName = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  return days[dateObj.getDay()];
};

/**
 * Get the workout type (Push, Pull, Legs, Rest) for a given date
 * @param {Date|string} date - Date object or string in YYYY-MM-DD format
 * @returns {string} The workout type
 */
export const getWorkoutTypeForDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const WORKOUT_TYPE_MAPPING = {
    1: 'Push', // Monday
    2: 'Pull', // Tuesday
    3: 'Legs', // Wednesday
    4: 'Push', // Thursday
    5: 'Pull', // Friday
    6: 'Legs', // Saturday
    0: 'Rest', // Sunday
  };
  
  return WORKOUT_TYPE_MAPPING[dayOfWeek];
};

/**
 * Check if a time is within a specified time window
 * @param {string} startTime - Start time in 24-hour format (HH:MM)
 * @param {string} endTime - End time in 24-hour format (HH:MM)
 * @returns {boolean} True if current time is within the window
 */
export const isTimeInWindow = (startTime, endTime) => {
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
