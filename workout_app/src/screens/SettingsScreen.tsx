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
import { useLocation, GymLocation } from '../contexts/LocationContext';
import { colors, commonStyles } from '../styles/commonStyles';
import { cancelAllNotifications } from '../utils/notifications';
import { performDataCleanup } from '../utils/backgroundTasks';
import { SettingsScreenProps } from '../types/navigation';

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
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
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [newLocationName, setNewLocationName] = useState('');

  const handleToggleTracking = async (): Promise<void> => {
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
    
    await toggleLocationTracking();
  };

  const handleAddCurrentLocation = async (): Promise<void> => {
    const result = await addGymLocation();
    
    if (result) {
      Alert.alert(
        'Location Added',
        'Your current location has been added as a gym location.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRemoveLocation = (locationId: string): void => {
    Alert.alert(
      'Remove Location',
      'Are you sure you want to remove this gym location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeGymLocation(locationId);
          },
        },
      ]
    );
  };

  const startEditingLocationName = (location: GymLocation): void => {
    setEditingLocationId(location.id);
    setNewLocationName(location.name);
  };

  const saveLocationName = (locationId: string): void => {
    if (newLocationName.trim()) {
      updateGymLocationName(locationId, newLocationName.trim());
    }
    setEditingLocationId(null);
    setNewLocationName('');
  };

  const handleSaveTimeWindow = (): void => {
    // Basic time format validation
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert(
        'Invalid Time Format',
        'Please enter times in 24-hour format (HH:MM)',
        [{ text: 'OK' }]
      );
      return;
    }
    
    updateWorkoutTimeWindow(startTime, endTime);
    setIsEditingTime(false);
  };

  const handleResetNotifications = (): void => {
    Alert.alert(
      'Reset Notifications',
      'This will clear all scheduled notifications. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            cancelAllNotifications();
            Alert.alert('Notifications Reset', 'All notifications have been cleared.');
          },
        },
      ]
    );
  };

  const handleDataCleanup = async (): Promise<void> => {
    Alert.alert(
      'Clean Up Old Data',
      'This will remove workout entries older than 30 days. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clean Up',
          onPress: () => {
            performDataCleanup()
              .then(() => {
                Alert.alert('Data Cleaned', 'Old workout data has been removed.');
              })
              .catch(() => {
                Alert.alert('Error', 'Failed to clean up data. Please try again.');
              });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={commonStyles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Settings</Text>
        
        <View style={[styles.settingRow, commonStyles.card]}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Location-Based Reminders</Text>
            <Text style={styles.settingDescription}>
              Receive workout reminders when you arrive at your gym
            </Text>
          </View>
          <Switch
            value={isTrackingEnabled}
            onValueChange={handleToggleTracking}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isTrackingEnabled ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        {isTrackingEnabled && (
          <>
            <View style={commonStyles.card}>
              <Text style={styles.settingTitle}>Workout Time Window</Text>
              <Text style={styles.settingDescription}>
                Only receive reminders during this time window
              </Text>
              
              {isEditingTime ? (
                <View style={styles.timeEditContainer}>
                  <View style={styles.timeInputContainer}>
                    <Text style={styles.timeLabel}>Start:</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={startTime}
                      onChangeText={setStartTime}
                      placeholder="09:00"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                  
                  <View style={styles.timeInputContainer}>
                    <Text style={styles.timeLabel}>End:</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={endTime}
                      onChangeText={setEndTime}
                      placeholder="21:00"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                  
                  <View style={styles.timeButtonsContainer}>
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
                      style={commonStyles.button}
                      onPress={handleSaveTimeWindow}
                    >
                      <Text style={commonStyles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.timeDisplayContainer}>
                  <Text style={styles.timeDisplayText}>
                    {workoutTimeWindow.start} - {workoutTimeWindow.end}
                  </Text>
                  <TouchableOpacity
                    style={[commonStyles.button, styles.editButton]}
                    onPress={() => setIsEditingTime(true)}
                  >
                    <Text style={commonStyles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={commonStyles.card}>
              <Text style={styles.settingTitle}>Gym Locations</Text>
              <Text style={styles.settingDescription}>
                Add your gym locations to receive reminders when you arrive
              </Text>
              
              {gymLocations.length === 0 ? (
                <View style={styles.emptyLocationsContainer}>
                  <Text style={styles.emptyText}>
                    No gym locations added yet
                  </Text>
                </View>
              ) : (
                gymLocations.map((location) => (
                  <View key={location.id} style={styles.locationItem}>
                    {editingLocationId === location.id ? (
                      <View style={styles.locationEditContainer}>
                        <TextInput
                          style={styles.locationNameInput}
                          value={newLocationName}
                          onChangeText={setNewLocationName}
                          placeholder="Gym name"
                          autoFocus
                        />
                        <TouchableOpacity
                          style={[commonStyles.button, styles.saveButton]}
                          onPress={() => saveLocationName(location.id)}
                        >
                          <Text style={commonStyles.buttonText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.locationInfoContainer}>
                        <View>
                          <Text style={styles.locationName}>{location.name}</Text>
                          <Text style={styles.locationCoords}>
                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                          </Text>
                        </View>
                        <View style={styles.locationButtons}>
                          <TouchableOpacity
                            style={[commonStyles.button, styles.editButton]}
                            onPress={() => startEditingLocationName(location)}
                          >
                            <Text style={commonStyles.buttonText}>Edit</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={[commonStyles.button, styles.removeButton]}
                            onPress={() => handleRemoveLocation(location.id)}
                          >
                            <Text style={commonStyles.buttonText}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                ))
              )}
              
              <TouchableOpacity
                style={[commonStyles.button, styles.addLocationButton]}
                onPress={handleAddCurrentLocation}
              >
                <Text style={commonStyles.buttonText}>
                  Add Current Location
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maintenance</Text>
        
        <View style={commonStyles.card}>
          <TouchableOpacity 
            style={styles.maintenanceButton} 
            onPress={handleResetNotifications}
          >
            <Text style={styles.maintenanceButtonText}>
              Reset All Notifications
            </Text>
          </TouchableOpacity>
          
          <View style={commonStyles.divider} />
          
          <TouchableOpacity 
            style={styles.maintenanceButton}
            onPress={handleDataCleanup}
          >
            <Text style={styles.maintenanceButtonText}>
              Clean Up Old Data
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={commonStyles.card}>
          <Text style={styles.aboutTitle}>PPL Workout App</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            An offline-first workout tracker with location-based reminders
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  dismissText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  timeEditContainer: {
    marginTop: 12,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    width: 50,
    fontSize: 16,
    color: colors.text,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  timeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeDisplayText: {
    fontSize: 18,
    color: colors.text,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: colors.primaryDark,
  },
  emptyLocationsContainer: {
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  locationItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  locationEditContainer: {
    flexDirection: 'row',
  },
  locationNameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.completed,
  },
  locationInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  locationCoords: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  locationButtons: {
    flexDirection: 'row',
  },
  removeButton: {
    backgroundColor: colors.error,
    marginLeft: 8,
  },
  addLocationButton: {
    marginTop: 16,
  },
  maintenanceButton: {
    paddingVertical: 12,
  },
  maintenanceButtonText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  aboutVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  aboutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
