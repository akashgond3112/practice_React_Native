/**
 * Navigation type definitions for the app
 */

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the types for our stack navigator parameters
export type WorkoutStackParamList = {
  DailyWorkout: undefined;
  ExerciseDetail: { entryId: number; exerciseName: string };
};

// Define types for our tab navigator parameters
export type TabNavigatorParamList = {
  Workout: undefined;
  Calendar: undefined;
  Settings: undefined;
};

// Navigation prop types for each screen
export type DailyWorkoutScreenNavigationProp = StackNavigationProp<WorkoutStackParamList, 'DailyWorkout'>;
export type ExerciseDetailScreenNavigationProp = StackNavigationProp<WorkoutStackParamList, 'ExerciseDetail'>;
export type ExerciseDetailScreenRouteProp = RouteProp<WorkoutStackParamList, 'ExerciseDetail'>;

// Props type for each screen
export type DailyWorkoutScreenProps = {
  navigation: DailyWorkoutScreenNavigationProp;
};

export type ExerciseDetailScreenProps = {
  navigation: ExerciseDetailScreenNavigationProp;
  route: ExerciseDetailScreenRouteProp;
};

export type CalendarScreenProps = {
  navigation: StackNavigationProp<TabNavigatorParamList, 'Calendar'>;
};

export type SettingsScreenProps = {
  navigation: StackNavigationProp<TabNavigatorParamList, 'Settings'>;
};
