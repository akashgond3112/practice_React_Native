/**
 * Simplified component test
 */

// Import the main component to validate it loads
import ExerciseDetailScreen from '../../src/screens/ExerciseDetailScreen';

describe('ExerciseDetailScreen Component', () => {
  it('should be defined', () => {
    expect(ExerciseDetailScreen).toBeDefined();
  });
  
  it('should be a function', () => {
    expect(typeof ExerciseDetailScreen).toBe('function');
  });
});
