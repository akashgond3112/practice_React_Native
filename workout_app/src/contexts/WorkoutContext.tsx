/**
 * Workout Context for the PPL Workout App
 * Provides global state management for workout data
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import dbManager, { WorkoutDay as DbWorkoutDay, WorkoutEntry as DbWorkoutEntry } from '../database';
import { getCurrentDate, getDateOffset } from '../utils/dateTime';
import { prepopulateExercises, generateWorkoutForDate } from '../database/prepopulate';

// Define types for the context
export interface WorkoutDay {
  id: number;
  date: string;
}

export interface Exercise {
  id: number;
  name: string;
  isCompound: boolean;
  description?: string;
  restPeriod?: string;
}

export interface WorkoutEntry {
  id: number;
  day_id: number;
  exercise_id: number;
  sets: number;
  reps: string;
  isCompleted: boolean;
  exercise?: Exercise;
  exerciseName?: string;
}

export interface WorkoutContextType {
  isLoading: boolean;
  currentDate: string;
  workoutDay: WorkoutDay | null;
  workoutEntries: WorkoutEntry[];
  error: string | null;
  loadWorkoutForDate: (date: string) => Promise<void>;
  goToPreviousDay: () => Promise<void>;
  goToNextDay: () => Promise<void>;
  goToToday: () => Promise<void>;
  toggleEntryCompletion: (entryId: number) => Promise<boolean>;
  updateWorkoutEntry: (entryId: number, sets: number, reps: string) => Promise<boolean>;
  clearError: () => void;
}

// Convert types from DB to Context types
const convertDbWorkoutDayToContextWorkoutDay = (dbDay: DbWorkoutDay | null): WorkoutDay | null => {
  if (!dbDay?.id) return null;
  return {
    id: dbDay.id,
    date: dbDay.date
  };
};

const convertDbWorkoutEntriesToContextWorkoutEntries = (dbEntries: DbWorkoutEntry[]): WorkoutEntry[] => {
  return dbEntries.filter(entry => entry.id !== undefined).map(entry => ({
    id: entry.id as number,
    day_id: entry.day_id,
    exercise_id: entry.exercise_id,
    sets: entry.sets,
    reps: typeof entry.reps === 'string' ? entry.reps : String(entry.reps),
    isCompleted: Boolean(entry.isCompleted),
    exercise: entry.exercise ? {
      id: entry.exercise.id || 0,
      name: entry.exercise.name,
      isCompound: Boolean(entry.exercise.isCompound),
      description: entry.exercise.description,
      restPeriod: entry.exercise.restPeriod
    } : undefined,
    exerciseName: entry.exercise?.name
  }));
};

interface WorkoutProviderProps {
  children: ReactNode;
}

// Create the context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Custom hook to use the workout context
export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<string>(getCurrentDate());
  const [workoutDay, setWorkoutDay] = useState<WorkoutDay | null>(null);
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load today's workout
  useEffect(() => {
    const initDb = async () => {
      try {
        await dbManager.init();
        
        // Check if database needs to be prepopulated
        await prepopulateExercises();
        
        // Generate workout for today if needed
        const today = getCurrentDate();
        await generateWorkoutForDate(today);
        
        // Load today's workout
        await loadWorkoutForDate(getCurrentDate());
      } catch (error) {
        console.error('Database initialization error:', error);
        setError('Failed to initialize the database.');
        setIsLoading(false);
      }
    };

    initDb();
  }, []);

  // Load workout data for a specific date
  const loadWorkoutForDate = async (date: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let dbDay = await dbManager.getWorkoutDayByDate(date);
      
      if (!dbDay) {
        // No workout day exists for this date, create it
        const dayId = await dbManager.createWorkoutDay(date);
        if (dayId) {
          dbDay = { id: dayId, date };
        } else {
          throw new Error("Failed to create workout day");
        }
      }
      
      if (!dbDay?.id) {
        throw new Error("Invalid workout day");
      }
      
      // Get workout entries for this day
      const dbEntries = await dbManager.getWorkoutEntriesByDayId(dbDay.id);
      
      const contextDay = convertDbWorkoutDayToContextWorkoutDay(dbDay);
      const contextEntries = convertDbWorkoutEntriesToContextWorkoutEntries(dbEntries);
      
      if (contextDay) {
        setWorkoutDay(contextDay);
        setWorkoutEntries(contextEntries);
        setCurrentDate(date);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading workout:', error);
      setError('Failed to load workout data.');
      setIsLoading(false);
    }
  };

  // Navigate to the previous day
  const goToPreviousDay = async (): Promise<void> => {
    const prevDate = getDateOffset(-1);
    await loadWorkoutForDate(prevDate);
  };

  // Navigate to the next day
  const goToNextDay = async (): Promise<void> => {
    const nextDate = getDateOffset(1);
    await loadWorkoutForDate(nextDate);
  };

  // Navigate to today
  const goToToday = async (): Promise<void> => {
    const today = getCurrentDate();
    await loadWorkoutForDate(today);
  };

  // Toggle completion status of a workout entry
  const toggleEntryCompletion = async (entryId: number): Promise<boolean> => {
    try {
      const entry = workoutEntries.find(e => e.id === entryId);
      if (!entry) return false;

      const updatedDbEntry: DbWorkoutEntry = {
        id: entry.id,
        day_id: entry.day_id,
        exercise_id: entry.exercise_id,
        sets: entry.sets,
        reps: entry.reps,
        // Convert boolean to 0/1 for database
        isCompleted: !entry.isCompleted ? 1 : 0 as any
      };

      await dbManager.updateWorkoutEntry(updatedDbEntry);
      
      // Update local state
      setWorkoutEntries(workoutEntries.map(e => 
        e.id === entryId ? { ...e, isCompleted: !e.isCompleted } : e
      ));
      
      return true;
    } catch (error) {
      console.error('Error toggling completion status:', error);
      setError('Failed to update workout status.');
      return false;
    }
  };

  // Update workout entry details
  const updateWorkoutEntry = async (
    entryId: number, 
    sets: number, 
    reps: string
  ): Promise<boolean> => {
    try {
      const entry = workoutEntries.find(e => e.id === entryId);
      if (!entry) return false;

      const updatedDbEntry: DbWorkoutEntry = {
        id: entry.id,
        day_id: entry.day_id,
        exercise_id: entry.exercise_id,
        sets: sets,
        reps: reps,
        // Convert boolean to 0/1 for database
        isCompleted: entry.isCompleted ? 1 : 0 as any
      };

      await dbManager.updateWorkoutEntry(updatedDbEntry);
      
      // Update local state
      setWorkoutEntries(workoutEntries.map(e => 
        e.id === entryId ? { ...e, sets, reps } : e
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating workout entry:', error);
      setError('Failed to update workout entry.');
      return false;
    }
  };

  // Clear any error messages
  const clearError = (): void => {
    setError(null);
  };

  // Context value to be provided with useMemo to prevent unnecessary re-renders
  const contextValue = React.useMemo<WorkoutContextType>(() => ({
    isLoading,
    currentDate,
    workoutDay,
    workoutEntries, 
    error,
    loadWorkoutForDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    toggleEntryCompletion,
    updateWorkoutEntry,
    clearError,
  }), [
    isLoading,
    currentDate,
    workoutDay,
    workoutEntries, 
    error,
    // Functions are stable and don't need to be added to the dependency array
  ]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};
