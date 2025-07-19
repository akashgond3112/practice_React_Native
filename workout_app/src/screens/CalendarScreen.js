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
} from 'react-native';
import { useWorkout } from '../contexts/WorkoutContext';
import { colors, commonStyles } from '../styles/commonStyles';
import { getDayName, getWorkoutTypeForDate } from '../utils/dateTime';

const CalendarScreen = ({ navigation }) => {
  const {
    isLoading,
    currentDate,
    workoutEntries,
    loadWorkoutForDate,
    error,
  } = useWorkout();

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Generate dates for the current month
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    
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
    
    // Get days from the next month to complete the last week
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

  const days = getDaysInMonth(
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

  const handleDatePress = (date) => {
    loadWorkoutForDate(date);
    navigation.navigate('Workout');
  };

  const renderCalendarHeader = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return (
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.navButton}>{'< Prev'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.navButton}>{'Next >'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.daysRow}>
        {dayNames.map((day) => (
          <View style={styles.dayNameCell} key={day}>
            <Text style={styles.dayNameText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCalendarDay = ({ item }) => {
    const isToday = item.formatted === new Date().toISOString().split('T')[0];
    const isSelected = item.formatted === currentDate;
    const workoutType = getWorkoutTypeForDate(item.date);
    
    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          !item.isCurrentMonth && styles.otherMonthDay,
          isToday && styles.todayCell,
          isSelected && styles.selectedCell,
        ]}
        onPress={() => handleDatePress(item.formatted)}
      >
        <Text
          style={[
            styles.dayText,
            !item.isCurrentMonth && styles.otherMonthText,
            isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {item.date.getDate()}
        </Text>
        
        {workoutType !== 'Rest' && (
          <View 
            style={[
              styles.workoutBadge,
              workoutType === 'Push' && styles.pushBadge,
              workoutType === 'Pull' && styles.pullBadge,
              workoutType === 'Legs' && styles.legsBadge,
            ]}
          >
            <Text style={styles.workoutBadgeText}>
              {workoutType.charAt(0)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={commonStyles.text}>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {renderCalendarHeader()}
      {renderDayNames()}
      
      <FlatList
        data={days}
        renderItem={renderCalendarDay}
        keyExtractor={(item) => item.formatted}
        numColumns={7}
        scrollEnabled={false}
      />
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendBadge, styles.pushBadge]}>
            <Text style={styles.legendBadgeText}>P</Text>
          </View>
          <Text style={styles.legendText}>Push</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendBadge, styles.pullBadge]}>
            <Text style={styles.legendBadgeText}>P</Text>
          </View>
          <Text style={styles.legendText}>Pull</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendBadge, styles.legsBadge]}>
            <Text style={styles.legendBadgeText}>L</Text>
          </View>
          <Text style={styles.legendText}>Legs</Text>
        </View>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={commonStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  navButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  daysRow: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
  },
  dayNameCell: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNameText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  otherMonthDay: {
    backgroundColor: '#f9f9f9',
  },
  todayCell: {
    backgroundColor: '#e3f2fd',
  },
  selectedCell: {
    backgroundColor: colors.primaryLight,
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
  },
  otherMonthText: {
    color: colors.textSecondary,
    opacity: 0.5,
  },
  todayText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  selectedText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  workoutBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  pushBadge: {
    backgroundColor: '#f44336', // Red
  },
  pullBadge: {
    backgroundColor: '#2196f3', // Blue
  },
  legsBadge: {
    backgroundColor: '#4caf50', // Green
  },
  legend: {
    padding: 16,
    backgroundColor: colors.white,
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  legendBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    margin: 16,
  },
});

export default CalendarScreen;
