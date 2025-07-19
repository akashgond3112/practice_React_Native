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
  ListRenderItemInfo,
} from 'react-native';
import { useWorkout, WorkoutEntry } from '../contexts/WorkoutContext';
import { colors, commonStyles } from '../styles/commonStyles';
import { getDayName, getWorkoutTypeForDate } from '../utils/dateTime';
import { DailyWorkoutScreenProps } from '../types/navigation';

const DailyWorkoutScreen: React.FC<DailyWorkoutScreenProps> = ({ navigation }) => {
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

  const renderEmptyState = () => {
    const workoutType = getWorkoutTypeForDate(currentDate);
    
    if (workoutType === 'Rest') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Rest Day</Text>
          <Text style={styles.emptyText}>
            Today is scheduled as a rest day. Take time to recover and prepare for your next workout.
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Workout Planned</Text>
        <Text style={styles.emptyText}>
          There are no exercises planned for today. Add some exercises or check another day.
        </Text>
      </View>
    );
  };

  const renderExerciseItem = ({ item }: ListRenderItemInfo<WorkoutEntry>) => {
    return (
      <TouchableOpacity
        style={[
          styles.exerciseItem,
          item.isCompleted ? styles.completedItem : undefined,
        ]}
        onPress={() => navigation.navigate('ExerciseDetail', { 
          entryId: item.id, 
          exerciseName: item.exerciseName || 'Exercise' 
        })}
      >
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{item.exerciseName || `Exercise ${item.exercise_id}`}</Text>
          {/* Compound badge is not available in the current interface */}
        </View>
        
        <View style={styles.exerciseDetails}>
          <Text style={styles.exerciseInfo}>
            {item.sets} sets × {item.reps} reps
          </Text>
          {/* Rest period is not available in the current interface */}
        </View>
        
        <View style={styles.exerciseActions}>
          <TouchableOpacity
            style={[
              commonStyles.button,
              item.isCompleted ? styles.completedButton : styles.pendingButton,
            ]}
            onPress={() => toggleEntryCompletion(item.id)}
          >
            <Text style={commonStyles.buttonText}>
              {item.isCompleted ? 'Completed' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={commonStyles.loadingContainer} testID="loading-indicator">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading workout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.loadingContainer}>
        <Text style={commonStyles.errorText}>Error loading workout: {error}</Text>
        <TouchableOpacity 
          style={commonStyles.button} 
          onPress={goToToday}
        >
          <Text style={commonStyles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {renderHeader()}
      
      <FlatList
        data={workoutEntries}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 16,
  },
  date: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 4,
  },
  dayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  workoutType: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 16,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: colors.primaryDark,
  },
  todayButton: {
    backgroundColor: colors.accent,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  exerciseItem: {
    ...commonStyles.card,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  completedItem: {
    borderLeftColor: colors.completed,
    opacity: 0.8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  compoundBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  compoundText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    marginBottom: 12,
  },
  exerciseInfo: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  restPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  completedButton: {
    backgroundColor: colors.completed,
  },
  pendingButton: {
    backgroundColor: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default DailyWorkoutScreen;
