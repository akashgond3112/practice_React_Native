/**
 * Database schema for the PPL Workout App
 * This file defines the database tables and their relationships
 */

export const DATABASE_NAME = 'ppl_workout.db';

// Table names
export const TABLES = {
  WORKOUT_DAY: 'workout_day',
  EXERCISE: 'exercise',
  WORKOUT_ENTRY: 'workout_entry',
} as const;

// Define table types
export type TableName = keyof typeof TABLES;

// Schema definitions
export const CREATE_TABLES_QUERIES: string[] = [
  // WorkoutDay table
  `CREATE TABLE IF NOT EXISTS ${TABLES.WORKOUT_DAY} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL
  )`,
  
  // Exercise table
  `CREATE TABLE IF NOT EXISTS ${TABLES.EXERCISE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    isCompound INTEGER NOT NULL,
    description TEXT,
    restPeriod TEXT
  )`,
  
  // WorkoutEntry table (links Day ⇆ Exercise)
  `CREATE TABLE IF NOT EXISTS ${TABLES.WORKOUT_ENTRY} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    reps TEXT NOT NULL,
    isCompleted INTEGER DEFAULT 0,
    FOREIGN KEY (day_id) REFERENCES ${TABLES.WORKOUT_DAY}(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES ${TABLES.EXERCISE}(id) ON DELETE CASCADE
  )`
];

// Indexes for performance
export const CREATE_INDEXES_QUERIES: string[] = [
  `CREATE INDEX IF NOT EXISTS idx_workout_day_date ON ${TABLES.WORKOUT_DAY} (date)`,
  `CREATE INDEX IF NOT EXISTS idx_workout_entry_day ON ${TABLES.WORKOUT_ENTRY} (day_id)`,
  `CREATE INDEX IF NOT EXISTS idx_workout_entry_exercise ON ${TABLES.WORKOUT_ENTRY} (exercise_id)`
];
