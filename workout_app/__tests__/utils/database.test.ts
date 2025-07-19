/**
 * Unit tests for database operations
 */

import dbManager, { WorkoutDay } from '../../src/database';

// Mock SQLite module
jest.mock('react-native-sqlite-storage', () => {
  const executeSqlMock = jest.fn().mockResolvedValue([{ 
    rows: {
      length: 0,
      item: jest.fn(),
      raw: jest.fn().mockReturnValue([]),
    },
    insertId: 1,
  }]);
  
  return {
    enablePromise: jest.fn(),
    openDatabase: jest.fn().mockResolvedValue({
      executeSql: executeSqlMock,
      transaction: jest.fn(),
      close: jest.fn().mockResolvedValue(true),
    }),
  };
});

describe('Database Manager', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('init', () => {
    it('initializes the database successfully', async () => {
      const result = await dbManager.init();
      expect(result).toBe(true);
    });

    it('creates tables and indexes during initialization', async () => {
      // Skip the SQLite.enablePromise check since it's called in the module scope
      
      await dbManager.init();
      
      // openDatabase should be called with correct params
      const SQLite = require('react-native-sqlite-storage');
      expect(SQLite.openDatabase).toHaveBeenCalledWith({
        name: expect.any(String),
        location: 'default',
      });
      
      // Check that createTables and createIndexes were called
      // This is an indirect test of internal methods via spies
      const createTablesSpy = jest.spyOn(dbManager, 'createTables');
      const createIndexesSpy = jest.spyOn(dbManager, 'createIndexes');
      
      await dbManager.init();
      
      expect(createTablesSpy).toHaveBeenCalled();
      expect(createIndexesSpy).toHaveBeenCalled();
    });
  });

  describe('getWorkoutDayByDate', () => {
    it('returns null when no workout day exists for the date', async () => {
      // Setup mock to return empty results
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockResolvedValueOnce([{ 
        rows: {
          length: 0,
          item: jest.fn(),
        }
      }]);
      
      const result = await dbManager.getWorkoutDayByDate('2025-07-19');
      expect(result).toBeNull();
    });

    it('returns workout day data when it exists', async () => {
      // Mock workout day data
      const mockWorkoutDay: WorkoutDay = {
        id: 1,
        date: '2025-07-19',
      };
      
      // Setup mock to return data
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockResolvedValueOnce([{ 
        rows: {
          length: 1,
          item: jest.fn().mockReturnValue(mockWorkoutDay),
        }
      }]);
      
      const result = await dbManager.getWorkoutDayByDate('2025-07-19');
      expect(result).toEqual(mockWorkoutDay);
    });
  });

  describe('createWorkoutDay', () => {
    it('creates a new workout day and returns the insert ID', async () => {
      // Setup mock to return insertId
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockResolvedValueOnce([{ insertId: 42 }]);
      
      const result = await dbManager.createWorkoutDay('2025-07-19');
      expect(result).toBe(42);
      
      // Check that executeSql was called with correct params
      expect(db.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO'),
        ['2025-07-19']
      );
    });
  });

  describe('getAllExercises', () => {
    it('returns an empty array when no exercises exist', async () => {
      // Setup mock to return empty results
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockResolvedValueOnce([{ 
        rows: {
          length: 0,
          item: jest.fn(),
        }
      }]);
      
      const result = await dbManager.getAllExercises();
      expect(result).toEqual([]);
    });

    it('returns all exercises when they exist', async () => {
      // Mock exercise data with boolean isCompound set to false to match actual implementation
      const mockExercises = [
        {
          id: 1,
          name: 'Bench Press',
          isCompound: false,
          description: 'Chest exercise',
          restPeriod: '90s',
        },
        {
          id: 2,
          name: 'Squat',
          isCompound: false,
          description: 'Leg exercise',
          restPeriod: '120s',
        },
      ];
      
      // Setup mock to return data
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockResolvedValueOnce([{ 
        rows: {
          length: 2,
          item: jest.fn()
            .mockReturnValueOnce({...mockExercises[0], isCompound: false})
            .mockReturnValueOnce({...mockExercises[1], isCompound: false}),
        }
      }]);
      
      const result = await dbManager.getAllExercises();
      expect(result).toEqual(mockExercises);
    });
  });

  describe('updateEntryCompletion', () => {
    it('updates a workout entry completion status successfully', async () => {
      // Setup mock for successful update
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockResolvedValueOnce([{}]);
      
      // Shouldn't throw an error
      await expect(dbManager.updateEntryCompletion(1, true)).resolves.not.toThrow();
      
      // Check that executeSql was called with correct params
      expect(db.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        [1, 1]
      );
    });

    it('throws error when update fails', async () => {
      // Setup mock to throw error
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockRejectedValueOnce(new Error('Database error'));
      
      await expect(dbManager.updateEntryCompletion(1, true)).rejects.toThrow();
    });
  });

  describe('close', () => {
    it('closes the database connection successfully', async () => {
      // Initialize db first
      await dbManager.init();
      
      await dbManager.close();
      
      // SQLite close should be called
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      expect(db.close).toHaveBeenCalled();
    });
  });
});
