/**
 * Test utilities for React Native testing
 */

import { DailyWorkoutScreenNavigationProp } from '../types/navigation';

/**
 * Create a mock navigation object for testing
 * @returns A navigation mock compatible with React Navigation typing
 */
export const createNavigationMock = (): DailyWorkoutScreenNavigationProp => {
  return {
    navigate: jest.fn(),
    push: jest.fn(),
    goBack: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    setOptions: jest.fn(),
    setParams: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
    getState: jest.fn(() => ({ index: 0, routes: [] })),
    getParent: jest.fn(() => null),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
    replace: jest.fn(),
    navigateDeprecated: jest.fn(),
    preload: jest.fn(),
    getId: jest.fn(() => 'test-id'),
  } as unknown as DailyWorkoutScreenNavigationProp;
};
