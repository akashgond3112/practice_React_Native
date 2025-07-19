/**
 * Prepopulate the database with the 6-day PPL template
 * This file contains the initial data for the database
 */

import dbManager from '../database';

// Mapping for day of week to workout type
const WORKOUT_TYPE_MAPPING = {
  1: 'Push', // Monday
  2: 'Pull', // Tuesday
  3: 'Legs', // Wednesday
  4: 'Push', // Thursday
  5: 'Pull', // Friday
  6: 'Legs', // Saturday
  0: 'Rest', // Sunday
};

// The PPL exercises for each day type
const TEMPLATE_EXERCISES = {
  // Monday - Push Day (Chest, Shoulders, Triceps)
  'Push-Monday': [
    {
      name: 'Barbell Bench Press',
      isCompound: true,
      description: 'Targets chest, anterior delts, triceps',
      restPeriod: '90-120s',
      sets: 4,
      reps: '6-8',
    },
    {
      name: 'Standing Overhead Press',
      isCompound: true,
      description: 'Shoulders, triceps',
      restPeriod: '90-120s',
      sets: 3,
      reps: '8-10',
    },
    {
      name: 'Incline Dumbbell Press',
      isCompound: true,
      description: 'Upper chest, front delts',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Dumbbell Lateral Raise',
      isCompound: false,
      description: 'Lateral delts',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Cable Triceps Pushdown',
      isCompound: false,
      description: 'Triceps',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
  ],
  
  // Tuesday - Pull Day (Back, Biceps)
  'Pull-Tuesday': [
    {
      name: 'Deadlift',
      isCompound: true,
      description: 'Full posterior chain: back, glutes, hamstrings',
      restPeriod: '120s',
      sets: 3,
      reps: '5-8',
    },
    {
      name: 'Pull-Ups or Lat Pulldowns',
      isCompound: true,
      description: 'Lats, upper back',
      restPeriod: '90s',
      sets: 3,
      reps: '8-10',
    },
    {
      name: 'Bent-Over Barbell Row',
      isCompound: true,
      description: 'Mid-back, lats',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Face Pull',
      isCompound: false,
      description: 'Rear delts, traps',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Barbell Biceps Curl',
      isCompound: false,
      description: 'Biceps',
      restPeriod: '60s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Hammer Curl',
      isCompound: false,
      description: 'Forearms/brachialis',
      restPeriod: '60s',
      sets: 2,
      reps: '10-12',
    },
  ],
  
  // Wednesday - Legs Day
  'Legs-Wednesday': [
    {
      name: 'Back Squat',
      isCompound: true,
      description: 'Quads, glutes',
      restPeriod: '120s',
      sets: 4,
      reps: '6-8',
    },
    {
      name: 'Romanian Deadlift',
      isCompound: true,
      description: 'Hamstrings, glutes',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Leg Press',
      isCompound: true,
      description: 'Quads, glutes',
      restPeriod: '90s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Lying Leg Curl',
      isCompound: false,
      description: 'Hamstrings',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Seated Calf Raise',
      isCompound: false,
      description: 'Calves',
      restPeriod: '60s',
      sets: 4,
      reps: '12-15',
    },
  ],
  
  // Thursday - Push Day
  'Push-Thursday': [
    {
      name: 'Standing Overhead Press',
      isCompound: true,
      description: 'Shoulders, triceps',
      restPeriod: '120s',
      sets: 4,
      reps: '6-8',
    },
    {
      name: 'Incline Barbell Press',
      isCompound: true,
      description: 'Upper chest, shoulders',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Weighted Dips',
      isCompound: true,
      description: 'Chest, triceps',
      restPeriod: '90s',
      sets: 3,
      reps: '8-10',
    },
    {
      name: 'Cable Lateral Raise',
      isCompound: false,
      description: 'Lateral delts',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Pec Deck or Dumbbell Fly',
      isCompound: false,
      description: 'Chest',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Overhead Cable Triceps Extension',
      isCompound: false,
      description: 'Triceps',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
  ],
  
  // Friday - Pull Day
  'Pull-Friday': [
    {
      name: 'Pendlay or Bent-Over Row',
      isCompound: true,
      description: 'Mid-back, lats',
      restPeriod: '90-120s',
      sets: 4,
      reps: '6-10',
    },
    {
      name: 'Weighted Pull-Ups or Wide-Grip Lat Pulldown',
      isCompound: true,
      description: 'Lats, upper back',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Dumbbell Shrug',
      isCompound: false,
      description: 'Traps',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Face Pull',
      isCompound: false,
      description: 'Rear delts, upper back',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'EZ-Bar Biceps Curl',
      isCompound: false,
      description: 'Biceps',
      restPeriod: '60s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Reverse Grip or Preacher Curl',
      isCompound: false,
      description: 'Biceps/forearms',
      restPeriod: '60s',
      sets: 2,
      reps: '10-12',
    },
  ],
  
  // Saturday - Legs Day
  'Legs-Saturday': [
    {
      name: 'Front Squat',
      isCompound: true,
      description: 'Quads, glutes',
      restPeriod: '120s',
      sets: 4,
      reps: '6-8',
    },
    {
      name: 'Bulgarian Split Squat',
      isCompound: true,
      description: 'Quads, glutes',
      restPeriod: '90s',
      sets: 3,
      reps: '8-10 (each leg)',
    },
    {
      name: 'Barbell Hip Thrust',
      isCompound: true,
      description: 'Glutes, hamstrings',
      restPeriod: '90s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Leg Extension',
      isCompound: false,
      description: 'Quads',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Seated or Lying Leg Curl',
      isCompound: false,
      description: 'Hamstrings',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Standing Calf Raise',
      isCompound: false,
      description: 'Calves',
      restPeriod: '60s',
      sets: 4,
      reps: '12-15',
    },
  ],
};

/**
 * Insert a single exercise into the database
 */
const insertExercise = async (exercise) => {
  const { name, isCompound, description, restPeriod } = exercise;
  return await dbManager.createExercise(name, isCompound, description, restPeriod);
};

/**
 * Insert all template exercises into the database
 */
const insertAllExercises = async () => {
  const exercises = {};
  const allDayTypes = [
    'Push-Monday', 'Pull-Tuesday', 'Legs-Wednesday',
    'Push-Thursday', 'Pull-Friday', 'Legs-Saturday'
  ];
  
  for (const dayType of allDayTypes) {
    const exercisesForDay = TEMPLATE_EXERCISES[dayType];
    
    for (const exercise of exercisesForDay) {
      const exerciseKey = exercise.name;
      
      if (!exercises[exerciseKey]) {
        // Only insert the exercise once if it appears in multiple days
        const exerciseId = await insertExercise(exercise);
        exercises[exerciseKey] = {
          ...exercise,
          id: exerciseId,
        };
      }
    }
  }
  
  return exercises;
};

/**
 * Create the next 7 days of workouts based on the current date
 */
const createUpcomingWorkouts = async (exercisesMap) => {
  // Get current date
  const today = new Date();
  
  // Create the next 7 days of workouts
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() + i);
    
    // Format date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0];
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = currentDate.getDay();
    
    // Get workout type for this day
    const workoutType = WORKOUT_TYPE_MAPPING[dayOfWeek];
    
    if (workoutType === 'Rest') {
      // Skip rest days
      continue;
    }
    
    // Create workout day entry
    const dayId = await dbManager.createWorkoutDay(formattedDate);
    
    // Create workout entries for this day
    const dayKey = `${workoutType}-${getDayName(dayOfWeek)}`;
    const exercisesForDay = TEMPLATE_EXERCISES[dayKey];
    
    if (exercisesForDay) {
      for (const exercise of exercisesForDay) {
        const exerciseKey = exercise.name;
        const exerciseId = exercisesMap[exerciseKey].id;
        
        await dbManager.createWorkoutEntry(
          dayId, 
          exerciseId, 
          exercise.sets, 
          exercise.reps
        );
      }
    }
  }
};

/**
 * Get day name from day of week number
 */
const getDayName = (dayOfWeek) => {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  return days[dayOfWeek];
};

/**
 * Prepopulate database with template data
 * Call this function when the app is first launched
 */
export const prepopulateDatabase = async () => {
  try {
    console.log('Prepopulating database with template data...');
    
    // Check if we already have exercises in the database
    const existingExercises = await dbManager.getAllExercises();
    
    if (existingExercises.length > 0) {
      console.log('Database already has exercises, skipping prepopulation');
      return true;
    }
    
    // Insert all exercises
    const exercisesMap = await insertAllExercises();
    
    // Create upcoming workouts
    await createUpcomingWorkouts(exercisesMap);
    
    console.log('Database prepopulated successfully');
    return true;
  } catch (error) {
    console.error('Error prepopulating database:', error);
    return false;
  }
};
