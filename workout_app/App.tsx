/**
 * PPL Workout App
 * An offline-first workout tracker with location-based reminders
 * 
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, SafeAreaView, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkoutProvider } from './src/contexts/WorkoutContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { initNotifications } from './src/utils/notifications';
// Temporarily comment out background tasks to resolve build issues
// import { setupBackgroundTasks } from './src/utils/backgroundTasks';

// Screens
import DailyWorkoutScreen from './src/screens/DailyWorkoutScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
]);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigator for the Workout tab
const WorkoutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DailyWorkout" 
        component={DailyWorkoutScreen} 
        options={{ title: 'Today\'s Workout' }} 
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen} 
        options={{ title: 'Exercise Details' }} 
      />
    </Stack.Navigator>
  );
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Initialize notifications and background tasks
  useEffect(() => {
    initNotifications();
    // Temporarily disabled to resolve build issues
    // setupBackgroundTasks();
    console.log('App initialized - background tasks temporarily disabled');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WorkoutProvider>
        <LocationProvider>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen 
                name="Workout" 
                component={WorkoutStack} 
                options={{ headerShown: false }}
              />
              <Tab.Screen 
                name="Calendar" 
                component={CalendarScreen} 
              />
              <Tab.Screen 
                name="Settings" 
                component={SettingsScreen} 
              />
            </Tab.Navigator>
          </NavigationContainer>
        </LocationProvider>
      </WorkoutProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
