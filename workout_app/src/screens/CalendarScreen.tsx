/**
 * CalendarScreen component
 * Displays a calendar view with workout history
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { useWorkout } from '../contexts/WorkoutContext';
import { colors, commonStyles } from '../styles/commonStyles';
import { getWorkoutTypeForDate } from '../utils/dateTime';
import { CalendarScreenProps } from '../types/navigation';

// Calendar date entry interface
interface CalendarDateItem {
  date: Date;
  isCurrentMonth: boolean;
  formatted: string;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const {
    isLoading,
    currentDate,
    workoutEntries,
    loadWorkoutForDate,
    error,
  } = useWorkout();

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Generate dates for the current month
  const getDaysInMonth = (year: number, month: number): CalendarDateItem[] => {
    const date = new Date(year, month, 1);
    const days: CalendarDateItem[] = [];
    
    // Get days from the previous month to fill the first week
    const firstDay = new Date(year, month, 1).getDay();
    const prevMonthDays = firstDay === 0 ? 0 : firstDay;
    
    for (let i = prevMonthDays; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        formatted: prevDate.toISOString().split('T')[0],
      });
    }
    
    // Get all days in the current month
    while (date.getMonth() === month) {
      days.push({
        date: new Date(date),
        isCurrentMonth: true,
        formatted: date.toISOString().split('T')[0],
      });
      date.setDate(date.getDate() + 1);
    }
    
    // Get days from the next month to fill the last week
    const lastDay = new Date(year, month + 1, 0).getDay();
    const nextMonthDays = lastDay === 6 ? 0 : 6 - lastDay;
    
    for (let i = 1; i <= nextMonthDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        formatted: nextDate.toISOString().split('T')[0],
      });
    }
    
    return days;
  };

  const daysInMonth = getDaysInMonth(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth()
  );

  const goToPreviousMonth = () => {
    const prevMonth = new Date(selectedMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedMonth(nextMonth);
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const handleDayPress = async (dateString: string) => {
    await loadWorkoutForDate(dateString);
  };

  const renderDayItem = ({ item }: ListRenderItemInfo<CalendarDateItem>) => {
    const isToday = 
      new Date().toISOString().split('T')[0] === item.formatted;
    
    const isSelectedDate = currentDate === item.formatted;
    
    const workoutType = getWorkoutTypeForDate(item.date);
    
    // Calculate workout completion for the day
    const completedCount = workoutEntries.filter(entry => 
      entry.isCompleted && currentDate === item.formatted
    ).length;
    const totalCount = workoutEntries.length;
    
    let progressPercentage = 0;
    if (totalCount > 0 && currentDate === item.formatted) {
      progressPercentage = Math.round((completedCount / totalCount) * 100);
    }
    
    return (
      <TouchableOpacity
        style={[
          styles.dayItem,
          !item.isCurrentMonth && styles.otherMonthDay,
          isToday && styles.todayItem,
          isSelectedDate && styles.selectedDayItem,
        ]}
        onPress={() => handleDayPress(item.formatted)}
      >
        <Text
          style={[
            styles.dayText,
            !item.isCurrentMonth && styles.otherMonthDayText,
            isToday && styles.todayText,
            isSelectedDate && styles.selectedDayText,
          ]}
        >
          {item.date.getDate()}
        </Text>
        
        {workoutType && item.isCurrentMonth && (
          <View
            style={[
              styles.workoutTypeBadge,
              workoutType === 'Rest' ? styles.restDayBadge : null,
            ]}
          >
            <Text style={styles.workoutTypeText}>
              {workoutType === 'Rest' ? 'R' : workoutType[0]}
            </Text>
          </View>
        )}
        
        {isSelectedDate && progressPercentage > 0 && (
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progressPercentage}%` },
                progressPercentage === 100 && styles.completeProgressBar,
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderMonthHeader = () => {
    const monthName = selectedMonth.toLocaleString('default', { month: 'long' });
    const year = selectedMonth.getFullYear();
    
    return (
      <View style={styles.monthHeader}>
        <TouchableOpacity 
          style={styles.monthNavButton} 
          onPress={goToPreviousMonth}
        >
          <Text style={styles.monthNavButtonText}>◀</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.monthTitle}
          onPress={goToCurrentMonth}
        >
          <Text style={styles.monthTitleText}>{monthName} {year}</Text>
          {!isCurrentMonth(selectedMonth) && (
            <Text style={styles.currentMonthText}>(Tap to go to current month)</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.monthNavButton} 
          onPress={goToNextMonth}
        >
          <Text style={styles.monthNavButtonText}>▶</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.weekDaysContainer}>
        {weekDays.map(day => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const isCurrentMonth = (date: Date) => {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() && 
      date.getMonth() === now.getMonth()
    );
  };

  if (error) {
    return (
      <View style={commonStyles.loadingContainer}>
        <Text style={commonStyles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {renderMonthHeader()}
      {renderWeekDays()}
      
      <FlatList
        data={daysInMonth}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.formatted}
        numColumns={7}
        contentContainerStyle={styles.calendarGrid}
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  monthTitle: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  currentMonthText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  calendarGrid: {
    padding: 8,
  },
  dayItem: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  otherMonthDay: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  todayItem: {
    backgroundColor: colors.primaryLight,
  },
  selectedDayItem: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  otherMonthDayText: {
    color: colors.textSecondary,
  },
  todayText: {
    color: colors.white,
  },
  selectedDayText: {
    color: colors.white,
  },
  workoutTypeBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restDayBadge: {
    backgroundColor: colors.textSecondary,
  },
  workoutTypeText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  completeProgressBar: {
    backgroundColor: colors.completed,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CalendarScreen;
