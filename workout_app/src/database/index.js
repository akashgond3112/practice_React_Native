/**
 * Database manager for the PPL Workout App
 * Handles database initialization, connections, and operations
 */

import SQLite from 'react-native-sqlite-storage';
import { 
  DATABASE_NAME, 
  CREATE_TABLES_QUERIES, 
  CREATE_INDEXES_QUERIES, 
  CLEANUP_OLD_DATA_QUERY,
  TABLES
} from './schema';

// Enable promise mode for SQLite
SQLite.enablePromise(true);

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize the database
   */
  async init() {
    try {
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
      });
      
      console.log('Database initialized');
      
      // Create tables if they don't exist
      await this.createTables();
      
      // Create indexes for performance
      await this.createIndexes();
      
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  }

  /**
   * Create database tables
   */
  async createTables() {
    try {
      for (const query of CREATE_TABLES_QUERIES) {
        await this.db.executeSql(query);
      }
      console.log('Tables created successfully');
      return true;
    } catch (error) {
      console.error('Error creating tables:', error);
      return false;
    }
  }

  /**
   * Create database indexes
   */
  async createIndexes() {
    try {
      for (const query of CREATE_INDEXES_QUERIES) {
        await this.db.executeSql(query);
      }
      console.log('Indexes created successfully');
      return true;
    } catch (error) {
      console.error('Error creating indexes:', error);
      return false;
    }
  }

  /**
   * Close the database connection
   */
  async close() {
    if (this.db) {
      try {
        await this.db.close();
        this.db = null;
        console.log('Database connection closed');
        return true;
      } catch (error) {
        console.error('Error closing database:', error);
        return false;
      }
    }
    return true;
  }

  /**
   * Execute a SQL query with parameters
   */
  async executeSql(query, params = []) {
    if (!this.db) {
      await this.init();
    }
    
    try {
      const [results] = await this.db.executeSql(query, params);
      return results;
    } catch (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
  }

  /**
   * Delete workout data older than 30 days
   */
  async cleanupOldData() {
    try {
      await this.executeSql(CLEANUP_OLD_DATA_QUERY);
      console.log('Old data cleaned up successfully');
      return true;
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      return false;
    }
  }

  /**
   * Get a workout day by date
   */
  async getWorkoutDayByDate(date) {
    try {
      const query = `SELECT * FROM ${TABLES.WORKOUT_DAY} WHERE date = ?`;
      const results = await this.executeSql(query, [date]);
      
      if (results.rows.length > 0) {
        return results.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error getting workout day:', error);
      return null;
    }
  }

  /**
   * Create a new workout day
   */
  async createWorkoutDay(date) {
    try {
      const query = `INSERT INTO ${TABLES.WORKOUT_DAY} (date) VALUES (?)`;
      const results = await this.executeSql(query, [date]);
      
      return results.insertId;
    } catch (error) {
      console.error('Error creating workout day:', error);
      throw error;
    }
  }

  /**
   * Get all exercises
   */
  async getAllExercises() {
    try {
      const query = `SELECT * FROM ${TABLES.EXERCISE}`;
      const results = await this.executeSql(query);
      
      const exercises = [];
      for (let i = 0; i < results.rows.length; i++) {
        exercises.push(results.rows.item(i));
      }
      
      return exercises;
    } catch (error) {
      console.error('Error getting exercises:', error);
      return [];
    }
  }

  /**
   * Create a new exercise
   */
  async createExercise(name, isCompound, description = '', restPeriod = '') {
    try {
      const query = `INSERT INTO ${TABLES.EXERCISE} (name, isCompound, description, restPeriod) 
                    VALUES (?, ?, ?, ?)`;
      const results = await this.executeSql(query, [
        name,
        isCompound ? 1 : 0,
        description,
        restPeriod,
      ]);
      
      return results.insertId;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  }

  /**
   * Get workout entries for a specific day
   */
  async getWorkoutEntriesByDayId(dayId) {
    try {
      const query = `
        SELECT we.*, e.name, e.isCompound, e.description, e.restPeriod
        FROM ${TABLES.WORKOUT_ENTRY} we
        JOIN ${TABLES.EXERCISE} e ON we.exercise_id = e.id
        WHERE we.day_id = ?
      `;
      const results = await this.executeSql(query, [dayId]);
      
      const entries = [];
      for (let i = 0; i < results.rows.length; i++) {
        entries.push(results.rows.item(i));
      }
      
      return entries;
    } catch (error) {
      console.error('Error getting workout entries:', error);
      return [];
    }
  }

  /**
   * Create a new workout entry
   */
  async createWorkoutEntry(dayId, exerciseId, sets, reps) {
    try {
      const query = `INSERT INTO ${TABLES.WORKOUT_ENTRY} (day_id, exercise_id, sets, reps) 
                    VALUES (?, ?, ?, ?)`;
      const results = await this.executeSql(query, [
        dayId,
        exerciseId,
        sets,
        reps,
      ]);
      
      return results.insertId;
    } catch (error) {
      console.error('Error creating workout entry:', error);
      throw error;
    }
  }

  /**
   * Update a workout entry
   */
  async updateWorkoutEntry(entryId, sets, reps, isCompleted) {
    try {
      const query = `UPDATE ${TABLES.WORKOUT_ENTRY} 
                    SET sets = ?, reps = ?, isCompleted = ?
                    WHERE id = ?`;
      await this.executeSql(query, [
        sets,
        reps,
        isCompleted ? 1 : 0,
        entryId,
      ]);
      
      return true;
    } catch (error) {
      console.error('Error updating workout entry:', error);
      return false;
    }
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

export default dbManager;
