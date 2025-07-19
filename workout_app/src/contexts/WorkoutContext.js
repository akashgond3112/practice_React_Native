/**
 * Workout Context for the PPL Workout App
 * Provides global state management for workout data
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import dbManager from '../database';
import { getCurrentDate, getDateOffset } from '../utils/dateTime';
import { prepopulateDatabase } from '../database/prepopulate';

// Create the context
const WorkoutContext = createContext();

// Custom hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

// Context provider component
export const WorkoutProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [workoutDay, setWorkoutDay] = useState(null);
  const [workoutEntries, setWorkoutEntries] = useState([]);
  const [error, setError] = useState(null);

  // Initialize the database and load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Initialize the database
        await dbManager.init();
        
        // Prepopulate the database if needed
        await prepopulateDatabase();
        
        // Load today's workout
        await loadWorkoutForDate(currentDate);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize app. Please restart the application.');
        setIsLoading(false);
      }
    };

    initializeApp();

    // Close database connection when the app is closed
    return () => {
      dbManager.close();
    };
  }, []);

  // Load workout for a specific date
  const loadWorkoutForDate = async (date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get or create workout day
      let day = await dbManager.getWorkoutDayByDate(date);
      
      if (!day) {
        // No workout day exists for this date, create it
        const dayId = await dbManager.createWorkoutDay(date);
        day = { id: dayId, date };
      }
      
      // Get workout entries for this day
      const entries = await dbManager.getWorkoutEntriesByDayId(day.id);
      
      setWorkoutDay(day);
      setWorkoutEntries(entries);
      setCurrentDate(date);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading workout:', error);
      setError('Failed to load workout data.');
      setIsLoading(false);
    }
  };

  // Navigate to the previous day
  const goToPreviousDay = () => {
    const prevDate = getDateOffset(-1);
    loadWorkoutForDate(prevDate);
  };

  // Navigate to the next day
  const goToNextDay = () => {
    const nextDate = getDateOffset(1);
    loadWorkoutForDate(nextDate);
  };

  // Navigate to today
  const goToToday = () => {
    const today = getCurrentDate();
    loadWorkoutForDate(today);
  };

  // Toggle completion status of a workout entry
  const toggleEntryCompletion = async (entryId) => {
    try {
      // Find the entry
      const entry = workoutEntries.find(e => e.id === entryId);
      
      if (!entry) {
        throw new Error('Workout entry not found');
      }
      
      // Toggle completion status
      const isCompleted = entry.isCompleted === 1 ? 0 : 1;
      
      // Update in database
      await dbManager.updateWorkoutEntry(
        entryId,
        entry.sets,
        entry.reps,
        isCompleted
      );
      
      // Update local state
      setWorkoutEntries(workoutEntries.map(e => 
        e.id === entryId ? { ...e, isCompleted } : e
      ));
      
      return true;
    } catch (error) {
      console.error('Error toggling entry completion:', error);
      setError('Failed to update workout entry.');
      return false;
    }
  };

  // Update workout entry details
  const updateWorkoutEntry = async (entryId, sets, reps) => {
    try {
      // Find the entry
      const entry = workoutEntries.find(e => e.id === entryId);
      
      if (!entry) {
        throw new Error('Workout entry not found');
      }
      
      // Update in database
      await dbManager.updateWorkoutEntry(
        entryId,
        sets,
        reps,
        entry.isCompleted
      );
      
      // Update local state
      setWorkoutEntries(workoutEntries.map(e => 
        e.id === entryId ? { ...e, sets, reps } : e
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating entry:', error);
      setError('Failed to update workout entry.');
      return false;
    }
  };

  // Clear any error messages
  const clearError = () => {
    setError(null);
  };

  // Context value to be provided
  const contextValue = {
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
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};
