/**
 * DailyWorkoutScreen component
 * Displays the workout entries for the current day
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useWorkout } from '../contexts/WorkoutContext';
import { colors, commonStyles } from '../styles/commonStyles';
import { getDayName, getWorkoutTypeForDate } from '../utils/dateTime';

const DailyWorkoutScreen = ({ navigation }) => {
  const {
    isLoading,
    currentDate,
    workoutEntries,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    toggleEntryCompletion,
    error,
  } = useWorkout();

  const renderHeader = () => {
    const dayName = getDayName(currentDate);
    const workoutType = getWorkoutTypeForDate(currentDate);
    
    return (
      <View style={styles.header}>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.workoutType}>{workoutType} Day</Text>
        
        <View style={styles.navigationControls}>
          <TouchableOpacity 
            style={[commonStyles.button, styles.navButton]} 
            onPress={goToPreviousDay}
          >
            <Text style={commonStyles.buttonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[commonStyles.button, styles.navButton, styles.todayButton]} 
            onPress={goToToday}
          >
            <Text style={commonStyles.buttonText}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[commonStyles.button, styles.navButton]} 
            onPress={goToNextDay}
          >
            <Text style={commonStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderExerciseItem = ({ item }) => {
    const isCompleted = item.isCompleted === 1;
    
    return (
      <TouchableOpacity
        style={[styles.exerciseCard, isCompleted && styles.completedCard]}
        onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
      >
        <View style={commonStyles.row}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseDetail}>
              {item.sets} × {item.reps} reps
              {item.restPeriod ? ` • Rest ${item.restPeriod}` : ''}
            </Text>
            <Text style={styles.exerciseType}>
              {item.isCompound ? 'Compound' : 'Isolation'} Exercise
            </Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[styles.checkbox, isCompleted && styles.checkedBox]}
            onPress={() => toggleEntryCompletion(item.id)}
          >
            {isCompleted && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={commonStyles.text}>Loading workout...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {renderHeader()}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={commonStyles.errorText}>{error}</Text>
        </View>
      )}
      
      {workoutEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No exercises for today.</Text>
          <Text style={styles.emptySubText}>
            Enjoy your rest day or add custom exercises!
          </Text>
        </View>
      ) : (
        <FlatList
          data={workoutEntries}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 4,
  },
  workoutType: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  todayButton: {
    backgroundColor: colors.accent,
  },
  listContent: {
    padding: 16,
  },
  exerciseCard: {
    ...commonStyles.card,
    marginBottom: 12,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.completed,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  exerciseDetail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  exerciseType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkedBox: {
    backgroundColor: colors.completed,
    borderColor: colors.completed,
  },
  checkmark: {
    color: colors.white,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default DailyWorkoutScreen;
