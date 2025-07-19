/**
 * Location utility functions for the PPL Workout App
 */

import Geolocation from '@react-native-community/geolocation';

/**
 * Location coordinates interface
 */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Geolocation error interface
 */
export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * Get the current location coordinates
 * @returns Location coordinates
 */
export const getCurrentLocation = (): Promise<GeoCoordinates> => {
  return new Promise<GeoCoordinates>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error: GeolocationError) => {
        reject(new Error(`Geolocation error: ${error.code} - ${error.message}`));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = 
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Check if the current location is within a specified radius of a target location
 * @param currentLocation - Current location {latitude, longitude}
 * @param targetLocation - Target location {latitude, longitude}
 * @param radius - Radius in meters
 * @returns True if current location is within radius of target
 */
export const isWithinRadius = (
  currentLocation: GeoCoordinates, 
  targetLocation: GeoCoordinates, 
  radius: number
): boolean => {
  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude
  );
  return distance <= radius;
};

/**
 * Format coordinates for display
 * @param coordinates - Location coordinates {latitude, longitude}
 * @returns Formatted coordinates string
 */
export const formatCoordinates = (coordinates: GeoCoordinates): string => {
  const { latitude, longitude } = coordinates;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};
