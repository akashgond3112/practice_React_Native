declare module '@react-native-community/geolocation' {
  export interface GeolocationError {
    code: number;
    message: string;
    PERMISSION_DENIED: number;
    POSITION_UNAVAILABLE: number;
    TIMEOUT: number;
  }

  export interface GeolocationOptions {
    timeout?: number;
    maximumAge?: number;
    enableHighAccuracy?: boolean;
    distanceFilter?: number;
    useSignificantChanges?: boolean;
  }

  export interface GeolocationResponse {
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

  const Geolocation: {
    requestAuthorization: (callback: (error: GeolocationError) => void, type?: 'always' | 'whenInUse') => void;
    getCurrentPosition: (
      success: (position: GeolocationResponse) => void,
      error?: (error: GeolocationError) => void,
      options?: GeolocationOptions
    ) => void;
    watchPosition: (
      success: (position: GeolocationResponse) => void,
      error?: (error: GeolocationError) => void,
      options?: GeolocationOptions
    ) => number;
    clearWatch: (watchID: number) => void;
    stopObserving: () => void;
    setRNConfiguration: (config: { skipPermissionRequests: boolean; }) => void;
  };

  export default Geolocation;
}
