/**
 * Component tests for DailyWorkoutScreen
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DailyWorkoutScreen from '../../src/screens/DailyWorkoutScreen';
import { WorkoutProvider } from '../../src/contexts/WorkoutContext';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock useWorkout hook
jest.mock('../../src/contexts/WorkoutContext', () => ({
  WorkoutProvider: ({ children }) => children,
  useWorkout: () => ({
    isLoading: false,
    currentDate: '2025-07-19',
    workoutEntries: [
      {
        id: 1,
        name: 'Front Squat',
        sets: 4,
        reps: '6-8',
        isCompound: true,
        description: 'Quads, glutes',
        restPeriod: '120s',
        isCompleted: 0,
      },
      {
        id: 2,
        name: 'Bulgarian Split Squat',
        sets: 3,
        reps: '8-10 (each leg)',
        isCompound: true,
        description: 'Quads, glutes',
        restPeriod: '90s',
        isCompleted: 1,
      },
    ],
    goToPreviousDay: jest.fn(),
    goToNextDay: jest.fn(),
    goToToday: jest.fn(),
    toggleEntryCompletion: jest.fn(),
    error: null,
  }),
}));

// Mock dateTime utility functions
jest.mock('../../src/utils/dateTime', () => ({
  getDayName: jest.fn().mockReturnValue('Saturday'),
  getWorkoutTypeForDate: jest.fn().mockReturnValue('Legs'),
}));

describe('DailyWorkoutScreen', () => {
  it('renders correctly with workout entries', () => {
    const { getByText, queryByText, getAllByText } = render(
        <DailyWorkoutScreen navigation={mockNavigation} />
    );

    // Check header elements
    expect(getByText('2025-07-19')).toBeTruthy();
    expect(getByText('Saturday')).toBeTruthy();
    expect(getByText('Legs Day')).toBeTruthy();

    // Check navigation buttons
    expect(getByText('Previous')).toBeTruthy();
    expect(getByText('Today')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();

    // Check exercise entries
    expect(getByText('Front Squat')).toBeTruthy();
    expect(getByText('4 × 6-8 reps')).toBeTruthy();
    expect(getByText('Bulgarian Split Squat')).toBeTruthy();
    expect(getByText('3 × 8-10 (each leg) reps')).toBeTruthy();

    // Check that both exercise types are shown
    expect(getAllByText('Compound Exercise').length).toBe(2);
    
    // Check descriptions are displayed
    expect(getAllByText('Quads, glutes').length).toBe(2);
    
    // Make sure there's no error message
    expect(queryByText('Failed to load workout data.')).toBeNull();
  });

  it('handles navigation button clicks', () => {
    const { getByText } = render(
      <DailyWorkoutScreen navigation={mockNavigation} />
    );

    // Test navigation buttons
    fireEvent.press(getByText('Previous'));
    fireEvent.press(getByText('Today'));
    fireEvent.press(getByText('Next'));

    const { useWorkout } = require('../../src/contexts/WorkoutContext');
    const { goToPreviousDay, goToToday, goToNextDay } = useWorkout();

    expect(goToPreviousDay).toHaveBeenCalled();
    expect(goToToday).toHaveBeenCalled();
    expect(goToNextDay).toHaveBeenCalled();
  });

  it('navigates to exercise detail screen when exercise is pressed', () => {
    const { getByText } = render(
      <DailyWorkoutScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Front Squat'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ExerciseDetail', {
      exercise: expect.objectContaining({
        id: 1,
        name: 'Front Squat',
      }),
    });
  });

  it('toggles exercise completion when checkbox is pressed', () => {
    const { getAllByText } = render(
      <DailyWorkoutScreen navigation={mockNavigation} />
    );

    // Find the 'Front Squat' exercise container
    const exerciseElement = getAllByText('Compound Exercise')[0];
    
    // Find the checkbox within the parent container (this is a simplification)
    // In a real test, you'd need to query by testID or more precise selectors
    const exerciseContainer = exerciseElement.parent.parent;
    const checkbox = exerciseContainer.findByProps({ 
      style: expect.arrayContaining([expect.objectContaining({ 
        borderRadius: 12 
      })])
    });

    fireEvent.press(checkbox);

    const { useWorkout } = require('../../src/contexts/WorkoutContext');
    const { toggleEntryCompletion } = useWorkout();

    expect(toggleEntryCompletion).toHaveBeenCalledWith(1);
  });

  it('displays loading indicator when isLoading is true', () => {
    // Override the mock to return isLoading: true
    jest.mock('../../src/contexts/WorkoutContext', () => ({
      useWorkout: () => ({
        isLoading: true,
        currentDate: '2025-07-19',
        workoutEntries: [],
        goToPreviousDay: jest.fn(),
        goToNextDay: jest.fn(),
        goToToday: jest.fn(),
        toggleEntryCompletion: jest.fn(),
        error: null,
      }),
    }));

    // Force a re-render to pick up the new mock
    jest.resetModules();

    const { getByText } = render(
      <DailyWorkoutScreen navigation={mockNavigation} />
    );

    expect(getByText('Loading workout...')).toBeTruthy();
  });

  it('displays error message when there is an error', () => {
    // Override the mock to return an error
    jest.mock('../../src/contexts/WorkoutContext', () => ({
      useWorkout: () => ({
        isLoading: false,
        currentDate: '2025-07-19',
        workoutEntries: [],
        goToPreviousDay: jest.fn(),
        goToNextDay: jest.fn(),
        goToToday: jest.fn(),
        toggleEntryCompletion: jest.fn(),
        error: 'Failed to load workout data.',
      }),
    }));

    // Force a re-render to pick up the new mock
    jest.resetModules();

    const { getByText } = render(
      <DailyWorkoutScreen navigation={mockNavigation} />
    );

    expect(getByText('Failed to load workout data.')).toBeTruthy();
  });

  it('displays empty state when there are no workout entries', () => {
    // Override the mock to return no workout entries
    jest.mock('../../src/contexts/WorkoutContext', () => ({
      useWorkout: () => ({
        isLoading: false,
        currentDate: '2025-07-19',
        workoutEntries: [],
        goToPreviousDay: jest.fn(),
        goToNextDay: jest.fn(),
        goToToday: jest.fn(),
        toggleEntryCompletion: jest.fn(),
        error: null,
      }),
    }));

    // Force a re-render to pick up the new mock
    jest.resetModules();

    const { getByText } = render(
      <DailyWorkoutScreen navigation={mockNavigation} />
    );

    expect(getByText('No exercises for today.')).toBeTruthy();
    expect(getByText('Enjoy your rest day or add custom exercises!')).toBeTruthy();
  });
});
