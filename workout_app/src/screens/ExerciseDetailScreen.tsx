/**
 * ExerciseDetailScreen component
 * Displays detailed information about a workout exercise
 * and allows the user to edit sets and reps
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useWorkout } from '../contexts/WorkoutContext';
import { colors, commonStyles } from '../styles/commonStyles';
import { ExerciseDetailScreenProps } from '../types/navigation';

const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({ route, navigation }) => {
  const { entryId, exerciseName } = route.params;
  const { workoutEntries, updateWorkoutEntry, toggleEntryCompletion } = useWorkout();
  
  // Find the exercise entry based on the entryId
  const entry = workoutEntries.find(entry => entry.id === entryId);
  
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize state from entry when it's available
  useEffect(() => {
    if (entry) {
      setSets(entry.sets.toString());
      setReps(entry.reps.toString());
    }
  }, [entry]);
  
  // If entry is not found, show an error message
  if (!entry) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.errorText}>Exercise not found</Text>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const isCompleted = entry.isCompleted;

  const handleToggleCompletion = async () => {
    const success = await toggleEntryCompletion(entry.id);
    
    if (success) {
      // Show feedback
      Alert.alert(
        isCompleted ? 'Exercise Incomplete' : 'Exercise Completed',
        isCompleted 
          ? 'The exercise has been marked as incomplete.' 
          : 'Great job! The exercise has been marked as complete.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSaveChanges = async () => {
    // Validate input
    const setsNumber = parseInt(sets, 10);
    
    if (isNaN(setsNumber) || setsNumber <= 0) {
      Alert.alert('Invalid Sets', 'Please enter a valid number of sets.');
      return;
    }
    
    // Save changes
    const success = await updateWorkoutEntry(entry.id, setsNumber, reps);
    
    if (success) {
      setIsEditing(false);
      Alert.alert('Changes Saved', 'Your workout has been updated.');
    } else {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exerciseName}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={commonStyles.card}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <Text style={styles.sectionTitle}>Current Workout</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {isCompleted ? 'Completed' : 'Pending'}
              </Text>
            </View>
          </View>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Sets:</Text>
                <TextInput
                  style={styles.input}
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="number-pad"
                  autoFocus
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Reps:</Text>
                <TextInput
                  style={styles.input}
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[commonStyles.button, styles.cancelButton]}
                  onPress={() => {
                    setSets(entry.sets.toString());
                    setReps(entry.reps);
                    setIsEditing(false);
                  }}
                >
                  <Text style={commonStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={commonStyles.button}
                  onPress={handleSaveChanges}
                >
                  <Text style={commonStyles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sets:</Text>
                <Text style={styles.infoValue}>{entry.sets}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reps:</Text>
                <Text style={styles.infoValue}>{entry.reps}</Text>
              </View>
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[commonStyles.button, styles.editButton]}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={commonStyles.buttonText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    commonStyles.button,
                    isCompleted ? styles.incompleteButton : styles.completeButton,
                  ]}
                  onPress={handleToggleCompletion}
                >
                  <Text style={commonStyles.buttonText}>
                    {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        {/* This would typically fetch and show additional exercise details */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Exercise Information</Text>
          
          <Text style={styles.exerciseDescription}>
            This would typically contain detailed exercise information, form tips, and potentially video links.
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
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: colors.primaryDark,
  },
  completeButton: {
    flex: 2,
    backgroundColor: colors.completed,
  },
  incompleteButton: {
    flex: 2,
    backgroundColor: colors.accent,
  },
  editForm: {
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: colors.textSecondary,
  },
  exerciseDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});

export default ExerciseDetailScreen;
