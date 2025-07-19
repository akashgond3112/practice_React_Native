/**
 * Unit tests for location utility functions
 */
import { calculateDistance, isWithinRadius, formatCoordinates } from '../../src/utils/location';

// Mock Geolocation module
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));

describe('Location Utilities', () => {
  describe('calculateDistance', () => {
    it('calculates distance between two points correctly', () => {
      // San Francisco
      const lat1 = 37.7749;
      const lon1 = -122.4194;
      // Los Angeles
      const lat2 = 34.0522;
      const lon2 = -118.2437;
      
      // Expected distance approximately 559.12 km (559,120 meters)
      // Using a 1% margin of error for floating point calculations
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      expect(distance).toBeGreaterThan(550000);
      expect(distance).toBeLessThan(570000);
    });

    it('returns 0 for identical coordinates', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      
      const distance = calculateDistance(lat, lon, lat, lon);
      // Account for potential floating point imprecision
      expect(distance).toBeLessThan(0.1);
    });

    it('handles coordinate points at opposite sides of the world', () => {
      // New York
      const lat1 = 40.7128;
      const lon1 = -74.0060;
      // Approximate antipode near Australia
      const lat2 = -40.7128;
      const lon2 = 105.9940;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      // Approximate half circumference of Earth (~20,000 km)
      expect(distance).toBeGreaterThan(19000000);
    });
  });

  describe('isWithinRadius', () => {
    it('returns true when point is within radius', () => {
      const currentLocation = { latitude: 40.7128, longitude: -74.0060 }; // New York
      const targetLocation = { latitude: 40.7130, longitude: -74.0065 }; // Very close to New York
      const radius = 100; // 100 meters
      
      const result = isWithinRadius(currentLocation, targetLocation, radius);
      expect(result).toBe(true);
    });
    
    it('returns false when point is outside radius', () => {
      const currentLocation = { latitude: 40.7128, longitude: -74.0060 }; // New York
      const targetLocation = { latitude: 40.7500, longitude: -74.0500 }; // Further from New York
      const radius = 1000; // 1000 meters
      
      const result = isWithinRadius(currentLocation, targetLocation, radius);
      expect(result).toBe(false);
    });
    
    it('returns true when radius is exactly the distance', () => {
      const currentLocation = { latitude: 40.7128, longitude: -74.0060 };
      const targetLocation = { latitude: 40.7140, longitude: -74.0080 };
      
      // Calculate exact distance between the points
      const exactDistance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );
      
      const result = isWithinRadius(currentLocation, targetLocation, exactDistance);
      expect(result).toBe(true);
    });
  });

  describe('formatCoordinates', () => {
    it('formats coordinates with 6 decimal places', () => {
      const coordinates = { latitude: 40.7128, longitude: -74.0060 };
      
      const formatted = formatCoordinates(coordinates);
      expect(formatted).toBe('40.712800, -74.006000');
    });
    
    it('handles coordinates with more decimal places', () => {
      const coordinates = { latitude: 37.7749275, longitude: -122.4194155 };
      
      const formatted = formatCoordinates(coordinates);
      expect(formatted).toBe('37.774927, -122.419415');
    });
    
    it('handles coordinates with fewer decimal places', () => {
      const coordinates = { latitude: 51.5, longitude: -0.12 };
      
      const formatted = formatCoordinates(coordinates);
      expect(formatted).toBe('51.500000, -0.120000');
    });
  });
});
