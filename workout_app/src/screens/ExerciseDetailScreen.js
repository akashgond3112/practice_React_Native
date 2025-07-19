/**
 * ExerciseDetailScreen component
 * Displays detailed information about a workout exercise
 * and allows the user to edit sets and reps
 */

import React, { useState } from 'react';
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

const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;
  const { updateWorkoutEntry, toggleEntryCompletion } = useWorkout();
  
  const [sets, setSets] = useState(exercise.sets.toString());
  const [reps, setReps] = useState(exercise.reps);
  const [isEditing, setIsEditing] = useState(false);
  
  const isCompleted = exercise.isCompleted === 1;

  const handleToggleCompletion = async () => {
    const success = await toggleEntryCompletion(exercise.id);
    
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
    
    if (!reps || reps.trim() === '') {
      Alert.alert('Invalid Reps', 'Please enter a valid reps range.');
      return;
    }
    
    const success = await updateWorkoutEntry(exercise.id, setsNumber, reps);
    
    if (success) {
      setIsEditing(false);
      Alert.alert('Changes Saved', 'Your changes have been saved successfully.');
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setSets(exercise.sets.toString());
    setReps(exercise.reps);
    setIsEditing(false);
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseType}>
          {exercise.isCompound ? 'Compound' : 'Isolation'} Exercise
        </Text>
      </View>
      
      <View style={commonStyles.content}>
        {exercise.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rest Period</Text>
          <Text style={styles.restPeriod}>{exercise.restPeriod || 'Not specified'}</Text>
        </View>
        
        <View style={styles.section}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <Text style={styles.sectionTitle}>Sets & Reps</Text>
            
            {!isEditing && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Sets:</Text>
                <TextInput
                  style={styles.input}
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Reps:</Text>
                <TextInput
                  style={styles.input}
                  value={reps}
                  onChangeText={setReps}
                  maxLength={10}
                />
              </View>
              
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={[commonStyles.button, styles.cancelButton]}
                  onPress={handleCancelEdit}
                >
                  <Text style={commonStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[commonStyles.button, styles.saveButton]}
                  onPress={handleSaveChanges}
                >
                  <Text style={commonStyles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.setsRepsContainer}>
              <Text style={styles.setsReps}>
                {exercise.sets} × {exercise.reps} reps
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isCompleted ? 'Completed' : 'Not completed'}
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.statusButton,
                isCompleted ? styles.incompleteButton : styles.completeButton
              ]}
              onPress={handleToggleCompletion}
            >
              <Text style={styles.statusButtonText}>
                Mark as {isCompleted ? 'Incomplete' : 'Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 24,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  exerciseType: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  restPeriod: {
    fontSize: 16,
    color: colors.text,
  },
  setsRepsContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  setsReps: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
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
  editForm: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    ...commonStyles.shadow,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text,
    width: 60,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  statusContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statusButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: colors.completed,
  },
  incompleteButton: {
    backgroundColor: colors.textSecondary,
  },
  statusButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseDetailScreen;
