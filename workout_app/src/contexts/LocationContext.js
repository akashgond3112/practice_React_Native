/**
 * Location Context for the PPL Workout App
 * Provides global state management for location data and geofencing
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';
import { getCurrentLocation, isWithinRadius } from '../utils/location';
import { isTimeInWindow } from '../utils/dateTime';
import { scheduleWorkoutReminder } from '../utils/notifications';

// Create the context
const LocationContext = createContext();

// Custom hook to use the location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

// Context provider component
export const LocationProvider = ({ children }) => {
  const [gymLocations, setGymLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [isAtGym, setIsAtGym] = useState(false);
  const [error, setError] = useState(null);
  const [workoutTimeWindow, setWorkoutTimeWindow] = useState({
    start: '17:00', // 5:00 PM
    end: '20:00',   // 8:00 PM
  });

  // Request location permissions
  const requestLocationPermissions = async () => {
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('always');
        const isGranted = status === 'granted';
        setLocationPermissionGranted(isGranted);
        return isGranted;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'PPL Workout App needs access to your location for gym reminders.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setLocationPermissionGranted(isGranted);
        return isGranted;
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      setError('Failed to request location permissions.');
      return false;
    }
  };

  // Initialize location tracking
  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermissions();
      
      if (hasPermission) {
        try {
          const location = await getCurrentLocation();
          setCurrentLocation(location);
        } catch (error) {
          console.error('Error getting current location:', error);
          setError('Failed to get current location.');
        }
      }
    };

    initializeLocation();
  }, []);

  // Start tracking location when enabled
  useEffect(() => {
    let locationTimer = null;
    
    if (isTrackingEnabled && locationPermissionGranted) {
      // Check location every minute
      locationTimer = BackgroundTimer.setInterval(async () => {
        try {
          const location = await getCurrentLocation();
          setCurrentLocation(location);
          
          // Check if user is at the gym during workout hours
          checkIfAtGym(location);
        } catch (error) {
          console.error('Error updating location:', error);
        }
      }, 60000); // Every minute
    }
    
    return () => {
      if (locationTimer) {
        BackgroundTimer.clearInterval(locationTimer);
      }
    };
  }, [isTrackingEnabled, locationPermissionGranted, gymLocations, workoutTimeWindow]);

  // Check if user is at any of the gym locations
  const checkIfAtGym = (location) => {
    if (!location || gymLocations.length === 0) {
      setIsAtGym(false);
      return;
    }
    
    // Check if the current time is within the workout time window
    const isWorkoutTime = isTimeInWindow(workoutTimeWindow.start, workoutTimeWindow.end);
    
    if (!isWorkoutTime) {
      setIsAtGym(false);
      return;
    }
    
    // Check if the user is near any of the gym locations
    const GYM_RADIUS = 100; // 100 meters
    
    for (const gym of gymLocations) {
      if (isWithinRadius(location, gym, GYM_RADIUS)) {
        // User is at the gym during workout hours
        setIsAtGym(true);
        
        // Send a workout reminder notification
        const today = new Date().toISOString().split('T')[0];
        scheduleWorkoutReminder(today);
        
        return;
      }
    }
    
    setIsAtGym(false);
  };

  // Add a new gym location
  const addGymLocation = async () => {
    try {
      if (!locationPermissionGranted) {
        const granted = await requestLocationPermissions();
        if (!granted) {
          throw new Error('Location permission is required to add a gym location.');
        }
      }
      
      const location = await getCurrentLocation();
      
      // Check if this location is already saved
      const isDuplicate = gymLocations.some(gym => 
        isWithinRadius(location, gym, 50) // Within 50 meters is considered the same gym
      );
      
      if (isDuplicate) {
        setError('This gym location is already saved.');
        return false;
      }
      
      // Add the new gym location
      const newGym = {
        id: Date.now().toString(),
        name: `Gym Location ${gymLocations.length + 1}`,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      
      const updatedLocations = [...gymLocations, newGym];
      setGymLocations(updatedLocations);
      
      return true;
    } catch (error) {
      console.error('Error adding gym location:', error);
      setError('Failed to add gym location.');
      return false;
    }
  };

  // Remove a gym location
  const removeGymLocation = (locationId) => {
    setGymLocations(gymLocations.filter(gym => gym.id !== locationId));
  };

  // Update gym location name
  const updateGymLocationName = (locationId, newName) => {
    setGymLocations(gymLocations.map(gym => 
      gym.id === locationId ? { ...gym, name: newName } : gym
    ));
  };

  // Toggle location tracking
  const toggleLocationTracking = async () => {
    try {
      if (!isTrackingEnabled && !locationPermissionGranted) {
        const granted = await requestLocationPermissions();
        if (!granted) {
          throw new Error('Location permission is required for tracking.');
        }
      }
      
      setIsTrackingEnabled(!isTrackingEnabled);
      return true;
    } catch (error) {
      console.error('Error toggling location tracking:', error);
      setError('Failed to toggle location tracking.');
      return false;
    }
  };

  // Update workout time window
  const updateWorkoutTimeWindow = (startTime, endTime) => {
    setWorkoutTimeWindow({
      start: startTime,
      end: endTime,
    });
  };

  // Clear any error messages
  const clearError = () => {
    setError(null);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    gymLocations,
    currentLocation,
    isTrackingEnabled,
    locationPermissionGranted,
    isAtGym,
    error,
    workoutTimeWindow,
    requestLocationPermissions,
    addGymLocation,
    removeGymLocation,
    updateGymLocationName,
    toggleLocationTracking,
    updateWorkoutTimeWindow,
    clearError,
  }), [
    gymLocations,
    currentLocation,
    isTrackingEnabled,
    locationPermissionGranted,
    isAtGym,
    error,
    workoutTimeWindow,
  ]);

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};
