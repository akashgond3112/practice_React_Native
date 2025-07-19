/**
 * Unit tests for database operations
 */

import dbManager from '../../src/database';

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
      await dbManager.init();
      
      // SQLite enablePromise should be called
      const SQLite = require('react-native-sqlite-storage');
      expect(SQLite.enablePromise).toHaveBeenCalledWith(true);
      
      // openDatabase should be called with correct params
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
      const mockWorkoutDay = {
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
      // Mock exercise data
      const mockExercises = [
        {
          id: 1,
          name: 'Bench Press',
          isCompound: 1,
          description: 'Chest exercise',
          restPeriod: '90s',
        },
        {
          id: 2,
          name: 'Squat',
          isCompound: 1,
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
            .mockReturnValueOnce(mockExercises[0])
            .mockReturnValueOnce(mockExercises[1]),
        }
      }]);
      
      const result = await dbManager.getAllExercises();
      expect(result).toEqual(mockExercises);
    });
  });

  describe('updateWorkoutEntry', () => {
    it('updates a workout entry successfully', async () => {
      // Setup mock for successful update
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockResolvedValueOnce([{}]);
      
      const result = await dbManager.updateWorkoutEntry(1, 4, '8-12', true);
      expect(result).toBe(true);
      
      // Check that executeSql was called with correct params
      expect(db.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        [4, '8-12', 1, 1]
      );
    });

    it('returns false when update fails', async () => {
      // Setup mock to throw error
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      db.executeSql.mockRejectedValueOnce(new Error('Database error'));
      
      const result = await dbManager.updateWorkoutEntry(1, 4, '8-12', true);
      expect(result).toBe(false);
    });
  });

  describe('close', () => {
    it('closes the database connection successfully', async () => {
      // Initialize db first
      await dbManager.init();
      
      const result = await dbManager.close();
      
      // SQLite close should be called
      const SQLite = require('react-native-sqlite-storage');
      const db = await SQLite.openDatabase();
      expect(db.close).toHaveBeenCalled();
      
      expect(result).toBe(true);
    });
  });
});
