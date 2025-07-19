/**
 * Mock for @react-native-community/geolocation
 */
const Geolocation = {
  getCurrentPosition: jest.fn((successCallback, errorCallback, options) => {
    successCallback({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 0,
        accuracy: 5,
        altitudeAccuracy: 5,
        heading: 0,
        speed: 0,
      },
      timestamp: 1598376889000,
    });
  }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
};

export default Geolocation;
