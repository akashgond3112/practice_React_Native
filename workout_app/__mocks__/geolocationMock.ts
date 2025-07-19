/**
 * Mock for @react-native-community/geolocation
 */

// Since we're mocking the module itself, we need to use the same types
// Define the types here to match those in the declaration file
interface GeolocationError {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
}

interface GeolocationResponse {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

const getCurrentPosition = jest.fn(
  (
    successCallback: (position: GeolocationResponse) => void,
    errorCallback?: (error: GeolocationError) => void,
    options?: {
      timeout?: number;
      maximumAge?: number;
      enableHighAccuracy?: boolean;
      distanceFilter?: number;
      useSignificantChanges?: boolean;
    }
  ) => {
    // Mock a successful response with default location
    successCallback({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: null,
        accuracy: 5,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
  }
);

const watchPosition = jest.fn(
  (
    successCallback: (position: GeolocationResponse) => void,
    errorCallback?: (error: GeolocationError) => void,
    options?: {
      timeout?: number;
      maximumAge?: number;
      enableHighAccuracy?: boolean;
      distanceFilter?: number;
      useSignificantChanges?: boolean;
    }
  ) => {
    // Return a watch ID
    return 1;
  }
);

const clearWatch = jest.fn((watchID: number) => {});

const requestAuthorization = jest.fn((callback: (error: GeolocationError) => void, type?: 'always' | 'whenInUse') => {
  // Mock successful authorization
  callback({
    code: 0,
    message: 'Authorization granted',
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  });
});

const stopObserving = jest.fn(() => {});

const setRNConfiguration = jest.fn((config: { skipPermissionRequests: boolean }) => {});

const Geolocation = {
  getCurrentPosition,
  watchPosition,
  clearWatch,
  requestAuthorization,
  stopObserving,
  setRNConfiguration,
};

export default Geolocation;
