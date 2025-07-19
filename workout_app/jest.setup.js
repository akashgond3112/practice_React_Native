// This file is executed before running tests

// Mock the entire react-native module
jest.mock('react-native', () => {
  return {
    Alert: {
      alert: jest.fn((title, message, buttons = [{ text: 'OK' }]) => {
        // Simulate pressing the first button if there are buttons
        if (buttons && buttons.length > 0 && buttons[0].onPress) {
          buttons[0].onPress();
        }
      }),
    },
    StyleSheet: {
      create: jest.fn(styles => styles),
      flatten: jest.fn(style => style),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    LogBox: {
      ignoreLogs: jest.fn(),
      ignoreAllLogs: jest.fn(),
    },
    // Mock useColorScheme hook
    useColorScheme: jest.fn(() => 'light'),
    // Add other RN components/APIs as needed
    Text: 'Text',
    View: 'View',
    TouchableOpacity: 'TouchableOpacity',
    FlatList: 'FlatList',
    ScrollView: 'ScrollView',
    TextInput: 'TextInput',
    Image: 'Image',
    ActivityIndicator: 'ActivityIndicator',
    SafeAreaView: 'SafeAreaView',
    StatusBar: 'StatusBar',
    Animated: {
      View: 'Animated.View',
      timing: jest.fn(() => ({ start: jest.fn() })),
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
        setValue: jest.fn(),
      })),
      createAnimatedComponent: jest.fn(component => component),
    },
  };
});

// Mock native modules
jest.mock('react-native-sqlite-storage', () => require('./__mocks__/sqliteMock.js'));
jest.mock('@react-native-community/geolocation', () => require('./__mocks__/geolocationMock.js'));
jest.mock('react-native-background-timer', () => require('./__mocks__/backgroundTimerMock.js'));
jest.mock('react-native-push-notification', () => require('./__mocks__/pushNotificationMock.js'));
jest.mock('@react-native-community/push-notification-ios', () => require('./__mocks__/pushNotificationIosMock.js'));

// Mock the react-native-background-actions module
jest.mock('react-native-background-actions', () => ({
  BackgroundService: {
    start: jest.fn(() => Promise.resolve()),
    stop: jest.fn(() => Promise.resolve()),
    updateNotification: jest.fn(() => Promise.resolve()),
  },
}));

// Mock the react-native-background-fetch module
jest.mock('react-native-background-fetch', () => ({
  configure: jest.fn((config) => Promise.resolve(0)),
  scheduleTask: jest.fn((taskConfig) => Promise.resolve()),
  finish: jest.fn((taskId) => {}),
  status: {
    RESTRICTED: 0,
    DENIED: 1,
    AVAILABLE: 2,
    FETCH_RESULT_NEW_DATA: 0,
    FETCH_RESULT_NO_DATA: 1,
    FETCH_RESULT_FAILED: 2,
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Create a basic fileMock for assets
jest.mock('./__mocks__/fileMock.js', () => '', { virtual: true });

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: { exerciseId: 1 },
    }),
    createNavigatorFactory: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

// Mock @react-navigation/stack
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn().mockReturnValue({
    Navigator: 'MockNavigator',
    Screen: 'MockScreen',
  }),
}));

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn().mockReturnValue({
    Navigator: 'MockTabNavigator',
    Screen: 'MockTabScreen',
  }),
}));

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn().mockReturnValue({
    Navigator: 'MockNativeStackNavigator',
    Screen: 'MockNativeStackScreen',
  }),
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));
