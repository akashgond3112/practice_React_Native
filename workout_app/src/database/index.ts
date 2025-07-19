/**
 * Database manager for the PPL Workout App
 * Handles database initialization, connections, and operations
 */

import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { 
  DATABASE_NAME, 
  CREATE_TABLES_QUERIES, 
  CREATE_INDEXES_QUERIES, 
  TABLES
} from './schema';

// Enable promise mode for SQLite
SQLite.enablePromise(true);

// Define interfaces for database entities
export interface WorkoutDay {
  id?: number;
  date: string;
}

export interface Exercise {
  id?: number;
  name: string;
  isCompound: boolean;
  description?: string;
  restPeriod?: string;
}

export interface WorkoutEntry {
  id?: number;
  day_id: number;
  exercise_id: number;
  sets: number;
  reps: string;
  isCompleted: boolean;
  exercise?: Exercise;  // For joined queries
}

class DatabaseManager {
  private db: SQLiteDatabase | null = null;

  /**
   * Initialize the database
   */
  async init(): Promise<boolean> {
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
  async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      for (const query of CREATE_TABLES_QUERIES) {
        await this.db.executeSql(query);
      }
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  /**
   * Create database indexes
   */
  async createIndexes(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      for (const query of CREATE_INDEXES_QUERIES) {
        await this.db.executeSql(query);
      }
      console.log('Indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw error;
    }
  }

  /**
   * Get workout day by date
   * @param date Date in YYYY-MM-DD format
   */
  async getWorkoutDayByDate(date: string): Promise<WorkoutDay | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `SELECT * FROM ${TABLES.WORKOUT_DAY} WHERE date = ?`,
        [date]
      );

      if (results.rows.length > 0) {
        return results.rows.item(0) as WorkoutDay;
      }
      return null;
    } catch (error) {
      console.error('Error fetching workout day:', error);
      throw error;
    }
  }

  /**
   * Create a new workout day
   * @param date Date in YYYY-MM-DD format
   */
  async createWorkoutDay(date: string): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `INSERT INTO ${TABLES.WORKOUT_DAY} (date) VALUES (?)`,
        [date]
      );
      return results.insertId || 0;
    } catch (error) {
      console.error('Error creating workout day:', error);
      throw error;
    }
  }

  /**
   * Get workout entries for a specific day
   * @param dayId Workout day ID
   */
  async getWorkoutEntriesForDay(dayId: number): Promise<WorkoutEntry[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `SELECT we.*, e.name, e.isCompound, e.description, e.restPeriod
         FROM ${TABLES.WORKOUT_ENTRY} we
         JOIN ${TABLES.EXERCISE} e ON we.exercise_id = e.id
         WHERE we.day_id = ?`,
        [dayId]
      );

      const entries: WorkoutEntry[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        
        // Convert SQLite INTEGER (0/1) to boolean
        const isCompleted = row.isCompleted === 1;
        const isCompound = row.isCompound === 1;
        
        entries.push({
          id: row.id,
          day_id: row.day_id,
          exercise_id: row.exercise_id,
          sets: row.sets,
          reps: row.reps,
          isCompleted,
          exercise: {
            id: row.exercise_id,
            name: row.name,
            isCompound,
            description: row.description,
            restPeriod: row.restPeriod,
          },
        });
      }
      return entries;
    } catch (error) {
      console.error('Error fetching workout entries:', error);
      throw error;
    }
  }

  /**
   * Add a workout entry
   * @param entry WorkoutEntry object without id
   */
  async addWorkoutEntry(entry: Omit<WorkoutEntry, 'id'>): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `INSERT INTO ${TABLES.WORKOUT_ENTRY} (day_id, exercise_id, sets, reps, isCompleted)
         VALUES (?, ?, ?, ?, ?)`,
        [
          entry.day_id,
          entry.exercise_id,
          entry.sets,
          entry.reps,
          entry.isCompleted ? 1 : 0,
        ]
      );
      return results.insertId || 0;
    } catch (error) {
      console.error('Error adding workout entry:', error);
      throw error;
    }
  }

  /**
   * Update workout entry completion status
   * @param entryId Entry ID
   * @param isCompleted Completion status
   */
  async updateEntryCompletion(entryId: number, isCompleted: boolean): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      await this.db.executeSql(
        `UPDATE ${TABLES.WORKOUT_ENTRY} SET isCompleted = ? WHERE id = ?`,
        [isCompleted ? 1 : 0, entryId]
      );
    } catch (error) {
      console.error('Error updating entry completion status:', error);
      throw error;
    }
  }

  /**
   * Get all exercises
   */
  async getAllExercises(): Promise<Exercise[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(`SELECT * FROM ${TABLES.EXERCISE}`);
      
      const exercises: Exercise[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        exercises.push({
          id: row.id,
          name: row.name,
          isCompound: row.isCompound === 1,
          description: row.description,
          restPeriod: row.restPeriod,
        });
      }
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }
  
  /**
   * Add a new exercise
   * @param exercise Exercise object without id
   */
  async addExercise(exercise: Omit<Exercise, 'id'>): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `INSERT INTO ${TABLES.EXERCISE} (name, isCompound, description, restPeriod)
         VALUES (?, ?, ?, ?)`,
        [
          exercise.name,
          exercise.isCompound ? 1 : 0,
          exercise.description || null,
          exercise.restPeriod || null,
        ]
      );
      return results.insertId || 0;
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw error;
    }
  }

  /**
   * Clean up old data (more than 30 days old)
   */
  async cleanupOldData(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateString = thirtyDaysAgo.toISOString().split('T')[0];

      await this.db.executeSql(
        `DELETE FROM ${TABLES.WORKOUT_DAY} WHERE date < ?`,
        [dateString]
      );
      console.log('Old workout data cleaned up');
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      throw error;
    }
  }

  /**
   * Gets workout entries by day ID
   * @param dayId Day ID
   */
  async getWorkoutEntriesByDayId(dayId: number): Promise<WorkoutEntry[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `SELECT we.*, e.name, e.isCompound, e.description, e.restPeriod
         FROM ${TABLES.WORKOUT_ENTRY} we
         LEFT JOIN ${TABLES.EXERCISE} e ON we.exercise_id = e.id
         WHERE we.day_id = ?`,
        [dayId]
      );

      const entries: WorkoutEntry[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        entries.push({
          id: row.id,
          day_id: row.day_id,
          exercise_id: row.exercise_id,
          sets: row.sets,
          reps: row.reps,
          isCompleted: !!row.isCompleted,
          exercise: {
            id: row.exercise_id,
            name: row.name,
            isCompound: !!row.isCompound,
            description: row.description,
            restPeriod: row.restPeriod,
          },
        });
      }
      return entries;
    } catch (error) {
      console.error('Error fetching workout entries by day ID:', error);
      throw error;
    }
  }

  /**
   * Update a workout entry
   * @param entry WorkoutEntry object with id
   */
  async updateWorkoutEntry(entry: WorkoutEntry): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    if (!entry.id) {
      throw new Error('Entry ID is required for update');
    }

    try {
      await this.db.executeSql(
        `UPDATE ${TABLES.WORKOUT_ENTRY} 
         SET sets = ?, reps = ?, isCompleted = ?
         WHERE id = ?`,
        [
          entry.sets,
          entry.reps,
          entry.isCompleted ? 1 : 0,
          entry.id,
        ]
      );
    } catch (error) {
      console.error('Error updating workout entry:', error);
      throw error;
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('Database connection closed');
    }
  }
}

// Create and export a singleton instance
const dbManager = new DatabaseManager();
export default dbManager;
