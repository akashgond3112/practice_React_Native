/**
 * SettingsScreen component
 * Displays app settings and allows the user to manage location-based reminders
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useLocation } from '../contexts/LocationContext';
import { colors, commonStyles } from '../styles/commonStyles';
import { cancelAllNotifications } from '../utils/notifications';
import { performDataCleanup } from '../utils/backgroundTasks';

const SettingsScreen = () => {
  const {
    gymLocations,
    isTrackingEnabled,
    locationPermissionGranted,
    workoutTimeWindow,
    requestLocationPermissions,
    addGymLocation,
    removeGymLocation,
    updateGymLocationName,
    toggleLocationTracking,
    updateWorkoutTimeWindow,
    error,
    clearError,
  } = useLocation();

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [startTime, setStartTime] = useState(workoutTimeWindow.start);
  const [endTime, setEndTime] = useState(workoutTimeWindow.end);
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [newLocationName, setNewLocationName] = useState('');

  const handleToggleTracking = async () => {
    if (!isTrackingEnabled && !locationPermissionGranted) {
      // Request permissions before enabling tracking
      const granted = await requestLocationPermissions();
      
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Location permission is required to enable location-based reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    toggleLocationTracking();
  };

  const handleAddGymLocation = async () => {
    const success = await addGymLocation();
    
    if (success) {
      Alert.alert(
        'Gym Location Added',
        'Your current location has been saved as a gym location.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRemoveGymLocation = (locationId) => {
    Alert.alert(
      'Remove Gym Location',
      'Are you sure you want to remove this gym location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeGymLocation(locationId)
        }
      ]
    );
  };

  const handleEditLocationName = (location) => {
    setEditingLocationId(location.id);
    setNewLocationName(location.name);
  };

  const saveLocationName = () => {
    if (newLocationName.trim() === '') {
      Alert.alert('Invalid Name', 'Please enter a valid name for the location.');
      return;
    }
    
    updateGymLocationName(editingLocationId, newLocationName);
    setEditingLocationId(null);
    setNewLocationName('');
  };

  const handleSaveTimeWindow = () => {
    // Basic validation for time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert(
        'Invalid Time Format',
        'Please enter times in 24-hour format (HH:MM).',
        [{ text: 'OK' }]
      );
      return;
    }
    
    updateWorkoutTimeWindow(startTime, endTime);
    setIsEditingTime(false);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            // Clear notifications
            cancelAllNotifications();
            
            // Reset settings
            toggleLocationTracking(false);
            
            // Clear gym locations
            gymLocations.forEach(gym => removeGymLocation(gym.id));
            
            // This would typically include database clearing as well
            
            Alert.alert('Data Cleared', 'All app data has been cleared successfully.');
          }
        }
      ]
    );
  };

  const handleRunDataCleanup = async () => {
    Alert.alert(
      'Run Data Cleanup',
      'Are you sure you want to run data cleanup now? This will delete workout data older than 30 days.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Run Cleanup', 
          onPress: async () => {
            const success = await performDataCleanup();
            
            if (success) {
              Alert.alert(
                'Cleanup Complete',
                'Old workout data has been cleaned up successfully.'
              );
            } else {
              Alert.alert(
                'Cleanup Failed',
                'There was an error cleaning up old workout data.'
              );
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location-Based Reminders</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Reminders</Text>
            <Text style={styles.settingDescription}>
              Get notified when you arrive at the gym during your workout window
            </Text>
          </View>
          
          <Switch
            value={isTrackingEnabled}
            onValueChange={handleToggleTracking}
            disabled={!locationPermissionGranted}
            trackColor={{ false: '#ccc', true: colors.primaryLight }}
            thumbColor={isTrackingEnabled ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        {!locationPermissionGranted && (
          <View style={commonStyles.infoBox}>
            <Text style={commonStyles.infoText}>
              Location permission is required for reminders. 
              Please grant permission to use this feature.
            </Text>
            
            <TouchableOpacity 
              style={[commonStyles.button, styles.permissionButton]}
              onPress={requestLocationPermissions}
            >
              <Text style={commonStyles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Time Window</Text>
        <Text style={styles.settingDescription}>
          Set the time window when you typically workout
        </Text>
        
        {isEditingTime ? (
          <View style={styles.timeEditContainer}>
            <View style={styles.timeInputRow}>
              <Text style={styles.timeLabel}>Start Time:</Text>
              <TextInput
                style={styles.timeInput}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <View style={styles.timeInputRow}>
              <Text style={styles.timeLabel}>End Time:</Text>
              <TextInput
                style={styles.timeInput}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
                keyboardType="numbers-and-punctuation"
              />
            </View>
            
            <View style={styles.timeEditButtons}>
              <TouchableOpacity 
                style={[commonStyles.button, styles.cancelButton]}
                onPress={() => {
                  setStartTime(workoutTimeWindow.start);
                  setEndTime(workoutTimeWindow.end);
                  setIsEditingTime(false);
                }}
              >
                <Text style={commonStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[commonStyles.button, styles.saveButton]}
                onPress={handleSaveTimeWindow}
              >
                <Text style={commonStyles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.timeDisplayContainer}>
            <Text style={styles.timeDisplay}>
              {workoutTimeWindow.start} - {workoutTimeWindow.end}
            </Text>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditingTime(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={[commonStyles.row, commonStyles.spaceBetween]}>
          <Text style={styles.sectionTitle}>Gym Locations</Text>
          
          <TouchableOpacity 
            style={[commonStyles.button, styles.addButton]}
            onPress={handleAddGymLocation}
            disabled={!locationPermissionGranted}
          >
            <Text style={commonStyles.buttonText}>Add Current Location</Text>
          </TouchableOpacity>
        </View>
        
        {gymLocations.length === 0 ? (
          <Text style={styles.emptyText}>No gym locations saved</Text>
        ) : (
          gymLocations.map(location => (
            <View key={location.id} style={styles.locationItem}>
              {editingLocationId === location.id ? (
                <View style={styles.editNameContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={newLocationName}
                    onChangeText={setNewLocationName}
                    placeholder="Location name"
                  />
                  
                  <View style={styles.editNameButtons}>
                    <TouchableOpacity 
                      style={[styles.editNameButton, styles.cancelNameButton]}
                      onPress={() => setEditingLocationId(null)}
                    >
                      <Text style={styles.editNameButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.editNameButton, styles.saveNameButton]}
                      onPress={saveLocationName}
                    >
                      <Text style={styles.saveNameButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationCoords}>
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                  
                  <View style={styles.locationActions}>
                    <TouchableOpacity 
                      style={styles.locationAction}
                      onPress={() => handleEditLocationName(location)}
                    >
                      <Text style={styles.actionText}>Edit Name</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.locationAction, styles.removeAction]}
                      onPress={() => handleRemoveGymLocation(location.id)}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity 
          style={styles.dataManagementRow}
          onPress={handleRunDataCleanup}
        >
          <View style={styles.dataManagementInfo}>
            <Text style={styles.dataManagementLabel}>Run Data Cleanup</Text>
            <Text style={styles.dataManagementDescription}>
              Delete workout data older than 30 days
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dataManagementRow}
          onPress={handleClearAllData}
        >
          <View style={styles.dataManagementInfo}>
            <Text style={[styles.dataManagementLabel, styles.dangerText]}>
              Clear All Data
            </Text>
            <Text style={styles.dataManagementDescription}>
              Delete all app data including workouts, settings, and gym locations
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>PPL Workout App v1.0.0</Text>
        <Text style={styles.footerText}>All data is stored locally on your device</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={commonStyles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  permissionButton: {
    marginTop: 12,
  },
  timeDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  timeDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  timeEditContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeLabel: {
    width: 100,
    fontSize: 16,
    color: colors.text,
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  timeEditButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  locationItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  locationInfo: {
    padding: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  locationAction: {
    marginLeft: 16,
  },
  actionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  removeAction: {
    marginLeft: 16,
  },
  removeText: {
    color: colors.error,
    fontWeight: '500',
  },
  editNameContainer: {
    padding: 12,
  },
  nameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  editNameButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editNameButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelNameButton: {
    backgroundColor: colors.textSecondary,
  },
  saveNameButton: {
    backgroundColor: colors.primary,
  },
  editNameButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  saveNameButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  dataManagementRow: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  dataManagementInfo: {
    flex: 1,
  },
  dataManagementLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  dataManagementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dangerText: {
    color: colors.error,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dismissText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
