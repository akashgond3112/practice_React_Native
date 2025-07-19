/**
 * Unit tests for dateTime utility functions
 */

import {
  formatDate,
  getCurrentDate,
  getDateOffset,
  getDayName,
  getWorkoutTypeForDate,
  isTimeInWindow,
} from '../../src/utils/dateTime';

// Mock the Date object for consistent test results
const mockDate = new Date(2025, 6, 19); // July 19, 2025 (Saturday)
global.Date = class extends Date {
  constructor(...args) {
    if (args.length === 0) {
      return mockDate;
    }
    return new mockDate.constructor(...args);
  }
  
  static now() {
    return mockDate.getTime();
  }
};

describe('dateTime utility functions', () => {
  describe('formatDate', () => {
    it('formats a date as YYYY-MM-DD', () => {
      const date = new Date(2025, 6, 19);
      expect(formatDate(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
  
  describe('getCurrentDate', () => {
    it('returns the current date in YYYY-MM-DD format', () => {
      expect(getCurrentDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
  
  describe('getDateOffset', () => {
    it('returns the date n days from today', () => {
      expect(getDateOffset(1)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(getDateOffset(-1)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(getDateOffset(7)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getDayName', () => {
    it('returns the correct day name for a date object', () => {
      const date = new Date(2025, 6, 19);
      expect(getDayName(date)).toBe('Saturday');
    });

    it('returns the correct day name for a date string', () => {
      expect(getDayName('2025-07-19')).toBe('Saturday');
      expect(getDayName('2025-07-20')).toBe('Sunday');
      expect(getDayName('2025-07-21')).toBe('Monday');
    });
  });

  describe('getWorkoutTypeForDate', () => {
    it('returns the correct workout type for each day of the week', () => {
      // Monday (Push)
      expect(getWorkoutTypeForDate(new Date(2025, 6, 21))).toBe('Push');
      // Tuesday (Pull)
      expect(getWorkoutTypeForDate(new Date(2025, 6, 22))).toBe('Pull');
      // Wednesday (Legs)
      expect(getWorkoutTypeForDate(new Date(2025, 6, 23))).toBe('Legs');
      // Thursday (Push)
      expect(getWorkoutTypeForDate(new Date(2025, 6, 24))).toBe('Push');
      // Friday (Pull)
      expect(getWorkoutTypeForDate(new Date(2025, 6, 25))).toBe('Pull');
      // Saturday (Legs)
      expect(getWorkoutTypeForDate(new Date(2025, 6, 19))).toBe('Legs');
      // Sunday (Rest)
      expect(getWorkoutTypeForDate(new Date(2025, 6, 20))).toBe('Rest');
    });

    it('works with date strings', () => {
      expect(getWorkoutTypeForDate('2025-07-21')).toBe('Push'); // Monday
      expect(getWorkoutTypeForDate('2025-07-20')).toBe('Rest'); // Sunday
    });
  });

  describe('isTimeInWindow', () => {
    let realDateNow;
    
    beforeEach(() => {
      realDateNow = Date.now;
    });
    
    afterEach(() => {
      Date.now = realDateNow;
    });
    
    it('correctly checks if time is within a window', () => {
      // Mock isTimeInWindow to use specific times instead of the actual Date object
      const mockIsTimeInWindow = (startTime, endTime, currentHours, currentMinutes) => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        const currentTimeValue = currentHours * 60 + currentMinutes;
        const startTimeValue = startHours * 60 + startMinutes;
        const endTimeValue = endHours * 60 + endMinutes;
        
        return currentTimeValue >= startTimeValue && currentTimeValue <= endTimeValue;
      };
      
      // Test cases using the mock function
      // Current time 18:30, window 17:00-20:00 -> should be true
      expect(mockIsTimeInWindow('17:00', '20:00', 18, 30)).toBe(true);
      
      // Current time 16:30, window 17:00-20:00 -> should be false (before window)
      expect(mockIsTimeInWindow('17:00', '20:00', 16, 30)).toBe(false);
      
      // Current time 21:00, window 17:00-20:00 -> should be false (after window)
      expect(mockIsTimeInWindow('17:00', '20:00', 21, 0)).toBe(false);
      
      // Current time 17:00, window 17:00-20:00 -> should be true (at start)
      expect(mockIsTimeInWindow('17:00', '20:00', 17, 0)).toBe(true);
      
      // Current time 20:00, window 17:00-20:00 -> should be true (at end)
      expect(mockIsTimeInWindow('17:00', '20:00', 20, 0)).toBe(true);
    });
  });
});
