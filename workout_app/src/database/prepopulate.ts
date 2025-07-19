/**
 * Prepopulate the database with the 6-day PPL template
 * This file contains the initial data for the database
 */

import dbManager, { Exercise } from '../database';
import { WorkoutType } from '../utils/dateTime';

// Mapping for day of week to workout type
export const WORKOUT_TYPE_MAPPING: Record<number, WorkoutType> = {
  1: 'Push', // Monday
  2: 'Pull', // Tuesday
  3: 'Legs', // Wednesday
  4: 'Push', // Thursday
  5: 'Pull', // Friday
  6: 'Legs', // Saturday
  0: 'Rest', // Sunday
};

// Template exercise interface
interface TemplateExercise extends Omit<Exercise, 'id'> {
  sets: number;
  reps: string;
}

// Define the type for the template exercises object
interface TemplateExercisesMap {
  [key: string]: TemplateExercise[];
}

// The PPL exercises for each day type
const TEMPLATE_EXERCISES: TemplateExercisesMap = {
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
      reps: '10-15',
    },
    {
      name: 'Cable Tricep Pushdown',
      isCompound: false,
      description: 'Triceps isolation',
      restPeriod: '60s',
      sets: 3,
      reps: '10-15',
    },
    {
      name: 'Overhead Tricep Extension',
      isCompound: false,
      description: 'Triceps, especially long head',
      restPeriod: '60s',
      sets: 3,
      reps: '10-15',
    },
  ],

  // Thursday - Push Day (Chest, Shoulders, Triceps)
  'Push-Thursday': [
    {
      name: 'Incline Barbell Bench Press',
      isCompound: true,
      description: 'Upper chest, front delts, triceps',
      restPeriod: '90-120s',
      sets: 4,
      reps: '6-10',
    },
    {
      name: 'Seated Dumbbell Shoulder Press',
      isCompound: true,
      description: 'Shoulders, triceps',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Dumbbell Chest Fly',
      isCompound: false,
      description: 'Chest isolation',
      restPeriod: '60s',
      sets: 3,
      reps: '10-15',
    },
    {
      name: 'Cable Front Raise',
      isCompound: false,
      description: 'Front delts',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Dips',
      isCompound: true,
      description: 'Chest, triceps',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Skull Crushers',
      isCompound: false,
      description: 'Triceps isolation',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
  ],

  // Tuesday - Pull Day (Back, Biceps)
  'Pull-Tuesday': [
    {
      name: 'Barbell Deadlift',
      isCompound: true,
      description: 'Posterior chain, back',
      restPeriod: '120-180s',
      sets: 3,
      reps: '5-8',
    },
    {
      name: 'Pull-Ups / Lat Pulldown',
      isCompound: true,
      description: 'Lats, biceps',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Barbell Bent-Over Row',
      isCompound: true,
      description: 'Upper back, lats',
      restPeriod: '90s',
      sets: 3,
      reps: '8-10',
    },
    {
      name: 'Face Pulls',
      isCompound: false,
      description: 'Rear delts, upper back',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Barbell Bicep Curl',
      isCompound: false,
      description: 'Biceps',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Hammer Curls',
      isCompound: false,
      description: 'Biceps, brachialis',
      restPeriod: '60s',
      sets: 3,
      reps: '10-15',
    },
  ],

  // Friday - Pull Day (Back, Biceps)
  'Pull-Friday': [
    {
      name: 'T-Bar Row',
      isCompound: true,
      description: 'Mid back, lats',
      restPeriod: '90s',
      sets: 3,
      reps: '8-10',
    },
    {
      name: 'Chest Supported Row',
      isCompound: true,
      description: 'Upper back isolation',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12',
    },
    {
      name: 'Lat Pulldown',
      isCompound: true,
      description: 'Lats, biceps',
      restPeriod: '90s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Cable Seated Row',
      isCompound: true,
      description: 'Mid back, lats',
      restPeriod: '90s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Preacher Curls',
      isCompound: false,
      description: 'Biceps, brachialis',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
    {
      name: 'Incline Dumbbell Curl',
      isCompound: false,
      description: 'Biceps (long head)',
      restPeriod: '60s',
      sets: 3,
      reps: '10-12',
    },
  ],

  // Wednesday - Legs Day (Quads, Hamstrings, Calves)
  'Legs-Wednesday': [
    {
      name: 'Barbell Squat',
      isCompound: true,
      description: 'Quads, glutes, lower back',
      restPeriod: '120-180s',
      sets: 4,
      reps: '6-8',
    },
    {
      name: 'Romanian Deadlift',
      isCompound: true,
      description: 'Hamstrings, glutes, lower back',
      restPeriod: '90-120s',
      sets: 3,
      reps: '8-10',
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
      name: 'Walking Lunges',
      isCompound: true,
      description: 'Quads, glutes, balance',
      restPeriod: '90s',
      sets: 3,
      reps: '10-12 per leg',
    },
    {
      name: 'Leg Curl',
      isCompound: false,
      description: 'Hamstrings isolation',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Standing Calf Raise',
      isCompound: false,
      description: 'Calves (gastrocnemius)',
      restPeriod: '60s',
      sets: 4,
      reps: '15-20',
    },
  ],

  // Saturday - Legs Day (Quads, Hamstrings, Calves)
  'Legs-Saturday': [
    {
      name: 'Front Squat',
      isCompound: true,
      description: 'Quads, upper back',
      restPeriod: '120s',
      sets: 4,
      reps: '6-10',
    },
    {
      name: 'Bulgarian Split Squat',
      isCompound: true,
      description: 'Quads, glutes, balance',
      restPeriod: '90s',
      sets: 3,
      reps: '8-12 per leg',
    },
    {
      name: 'Leg Extension',
      isCompound: false,
      description: 'Quads isolation',
      restPeriod: '60s',
      sets: 3,
      reps: '12-15',
    },
    {
      name: 'Glute-Ham Raise / Lying Leg Curl',
      isCompound: false,
      description: 'Hamstrings, glutes',
      restPeriod: '60s',
      sets: 3,
      reps: '10-15',
    },
    {
      name: 'Seated Calf Raise',
      isCompound: false,
      description: 'Calves (soleus)',
      restPeriod: '60s',
      sets: 4,
      reps: '15-20',
    },
    {
      name: 'Hip Thrust',
      isCompound: true,
      description: 'Glutes, hamstrings',
      restPeriod: '90s',
      sets: 3,
      reps: '10-15',
    },
  ],
};

/**
 * Prepopulate the database with exercises
 */
export const prepopulateExercises = async (): Promise<void> => {
  console.log('Prepopulating exercises...');
  
  try {
    // Collect all unique exercises from the template
    const uniqueExercises: Set<string> = new Set();
    const exercisesToAdd: Omit<Exercise, 'id'>[] = [];
    
    // Gather all exercises from all workout days
    Object.values(TEMPLATE_EXERCISES).forEach(exercises => {
      exercises.forEach(exercise => {
        if (!uniqueExercises.has(exercise.name)) {
          uniqueExercises.add(exercise.name);
          
          // Add the exercise to our list
          exercisesToAdd.push({
            name: exercise.name,
            isCompound: exercise.isCompound,
            description: exercise.description,
            restPeriod: exercise.restPeriod,
          });
        }
      });
    });
    
    // Add exercises to the database
    for (const exercise of exercisesToAdd) {
      await dbManager.addExercise(exercise);
    }
    
    console.log(`Successfully added ${exercisesToAdd.length} exercises`);
  } catch (error) {
    console.error('Error prepopulating exercises:', error);
  }
};

/**
 * Generate a workout for a specific date
 * @param date Date in YYYY-MM-DD format
 */
export const generateWorkoutForDate = async (date: string): Promise<void> => {
  try {
    // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    const dayObj = new Date(date);
    const dayOfWeek = dayObj.getDay();
    
    // Get the workout type for this day
    const workoutType = WORKOUT_TYPE_MAPPING[dayOfWeek];
    
    if (workoutType === 'Rest') {
      console.log(`${date} is a rest day, no workout generated`);
      return;
    }
    
    // Create a workout day entry
    const dayId = await dbManager.createWorkoutDay(date);
    
    // Get appropriate exercises based on the day and workout type
    let templateKey = `${workoutType}-${getDayName(dayObj)}`;
    
    // Fall back to the first day of this type if specific day not found
    if (!TEMPLATE_EXERCISES[templateKey]) {
      const fallbackDays = Object.keys(TEMPLATE_EXERCISES)
        .filter(key => key.startsWith(workoutType));
      
      if (fallbackDays.length > 0) {
        templateKey = fallbackDays[0];
      } else {
        console.error(`No template found for ${workoutType} day`);
        return;
      }
    }
    
    // Get all exercises to find IDs
    const allExercises = await dbManager.getAllExercises();
    
    // Create workout entries for each exercise in the template
    for (const templateExercise of TEMPLATE_EXERCISES[templateKey]) {
      // Find the exercise in our database
      const exercise = allExercises.find(e => e.name === templateExercise.name);
      
      if (exercise?.id) {
        // Create workout entry
        await dbManager.addWorkoutEntry({
          day_id: dayId,
          exercise_id: exercise.id,
          sets: templateExercise.sets,
          reps: templateExercise.reps,
          isCompleted: false,
        });
      }
    }
    
    console.log(`Generated ${workoutType} workout for ${date}`);
  } catch (error) {
    console.error(`Error generating workout for ${date}:`, error);
  }
};

/**
 * Helper function to get day name
 */
function getDayName(date: Date): string {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  return days[date.getDay()];
}
