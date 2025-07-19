/**
 * @jest-environment node
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExerciseDetailScreen from '../../src/screens/ExerciseDetailScreen';
import { useWorkout } from '../../src/contexts/WorkoutContext';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('../../src/contexts/WorkoutContext', () => ({
  useWorkout: jest.fn(),
}));

// Mock React Navigation
const mockNavigation = {
  goBack: jest.fn(),
};

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  // Simulate pressing the first button (usually 'OK')
  if (buttons && buttons.length > 0 && buttons[0].onPress) {
    buttons[0].onPress();
  }
});

describe('ExerciseDetailScreen', () => {
  // Sample exercise for testing
  const mockExercise = {
    id: 1,
    name: 'Bench Press',
    isCompound: true,
    description: 'A compound chest exercise',
    sets: 3,
    reps: '8-10',
    isCompleted: 0,
    restPeriod: '90 seconds',
  };

  // Mock context functions
  const mockUpdateWorkoutEntry = jest.fn().mockResolvedValue(true);
  const mockToggleEntryCompletion = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup context mock implementation
    useWorkout.mockReturnValue({
      updateWorkoutEntry: mockUpdateWorkoutEntry,
      toggleEntryCompletion: mockToggleEntryCompletion,
    });
  });

  it('renders exercise details correctly', () => {
    const { getByText } = render(
      React.createElement(ExerciseDetailScreen, {
        route: { params: { exercise: mockExercise } },
        navigation: mockNavigation
      })
    );

    // Check exercise name and type are displayed
    expect(getByText('Bench Press')).toBeTruthy();
    expect(getByText('Compound Exercise')).toBeTruthy();
    
    // Check other details
    expect(getByText('Description')).toBeTruthy();
    expect(getByText('A compound chest exercise')).toBeTruthy();
    expect(getByText('Rest Period')).toBeTruthy();
    expect(getByText('90 seconds')).toBeTruthy();
    expect(getByText('Sets & Reps')).toBeTruthy();
    expect(getByText('3 × 8-10 reps')).toBeTruthy();
    
    // Check status
    expect(getByText('Not completed')).toBeTruthy();
    expect(getByText('Mark as Complete')).toBeTruthy();
  });

  it('renders completed exercise correctly', () => {
    const completedExercise = {
      ...mockExercise,
      isCompleted: 1,
    };

    const { getByText } = render(
      React.createElement(ExerciseDetailScreen, {
        route: { params: { exercise: completedExercise } },
        navigation: mockNavigation
      })
    );

    expect(getByText('Completed')).toBeTruthy();
    expect(getByText('Mark as Incomplete')).toBeTruthy();
  });

  it('handles navigation back to workout', () => {
    const { getByText } = render(
      React.createElement(ExerciseDetailScreen, {
        route: { params: { exercise: mockExercise } },
        navigation: mockNavigation
      })
    );

    fireEvent.press(getByText('Back to Workout'));
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('toggles exercise completion status', async () => {
    const { getByText } = render(
      React.createElement(ExerciseDetailScreen, {
        route: { params: { exercise: mockExercise } },
        navigation: mockNavigation
      })
    );

    // Press the mark as complete button
    fireEvent.press(getByText('Mark as Complete'));
    
    // Check if the context function was called with the correct ID
    await waitFor(() => {
      expect(mockToggleEntryCompletion).toHaveBeenCalledWith(mockExercise.id);
    });
    
    // Check if the alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Exercise Completed',
      'Great job! The exercise has been marked as complete.',
      expect.anything()
    );
  });

  it('enters edit mode and updates exercise details', async () => {
    const { getByText, getByDisplayValue } = render(
      React.createElement(ExerciseDetailScreen, {
        route: { params: { exercise: mockExercise } },
        navigation: mockNavigation
      })
    );

    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Check if we're in edit mode
    expect(getByDisplayValue('3')).toBeTruthy();
    expect(getByDisplayValue('8-10')).toBeTruthy();
    
    // Change values
    fireEvent.changeText(getByDisplayValue('3'), '4');
    fireEvent.changeText(getByDisplayValue('8-10'), '6-8');
    
    // Save changes
    fireEvent.press(getByText('Save'));
    
    // Check if the context function was called correctly
    await waitFor(() => {
      expect(mockUpdateWorkoutEntry).toHaveBeenCalledWith(mockExercise.id, 4, '6-8');
    });
    
    // Check if confirmation alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Changes Saved',
      'Your changes have been saved successfully.'
    );
  });

  it('handles invalid input when editing', async () => {
    const { getByText, getByDisplayValue } = render(
      React.createElement(ExerciseDetailScreen, {
        route: { params: { exercise: mockExercise } },
        navigation: mockNavigation
      })
    );

    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Enter invalid sets (non-numeric)
    fireEvent.changeText(getByDisplayValue('3'), 'abc');
    
    // Try to save
    fireEvent.press(getByText('Save'));
    
    // Check error alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid Sets',
      'Please enter a valid number of sets.'
    );
    
    // updateWorkoutEntry should not have been called
    expect(mockUpdateWorkoutEntry).not.toHaveBeenCalled();
    
    // Enter valid sets but empty reps
    fireEvent.changeText(getByDisplayValue('abc'), '4');
    fireEvent.changeText(getByDisplayValue('8-10'), '');
    
    // Try to save
    fireEvent.press(getByText('Save'));
    
    // Check error alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid Reps',
      'Please enter a valid reps range.'
    );
  });

  it('cancels edit mode and reverts changes', () => {
    const { getByText, getByDisplayValue } = render(
      React.createElement(ExerciseDetailScreen, {
        route: { params: { exercise: mockExercise } },
        navigation: mockNavigation
      })
    );

    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Change values
    fireEvent.changeText(getByDisplayValue('3'), '4');
    fireEvent.changeText(getByDisplayValue('8-10'), '6-8');
    
    // Cancel edit
    fireEvent.press(getByText('Cancel'));
    
    // Check if we're back to view mode with original values
    expect(getByText('3 × 8-10 reps')).toBeTruthy();
    
    // updateWorkoutEntry should not have been called
    expect(mockUpdateWorkoutEntry).not.toHaveBeenCalled();
  });
});
