/**
 * Location utility functions for the PPL Workout App
 */

import Geolocation from '@react-native-community/geolocation';

/**
 * Get the current location coordinates
 * @returns {Promise<{latitude: number, longitude: number}>} Location coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
 * @param {Object} currentLocation - Current location {latitude, longitude}
 * @param {Object} targetLocation - Target location {latitude, longitude}
 * @param {number} radius - Radius in meters
 * @returns {boolean} True if current location is within radius of target
 */
export const isWithinRadius = (currentLocation, targetLocation, radius) => {
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
 * @param {Object} coordinates - Location coordinates {latitude, longitude}
 * @returns {string} Formatted coordinates string
 */
export const formatCoordinates = (coordinates) => {
  const { latitude, longitude } = coordinates;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};
