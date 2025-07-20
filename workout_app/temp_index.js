/**
 * Temporary index.js file to test if the app can run
 */

import React from 'react';
import { AppRegistry, SafeAreaView, Text, View } from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello, React Native!</Text>
        <Text>This is a temporary app for testing.</Text>
      </View>
    </SafeAreaView>
  );
};

// Register the app
AppRegistry.registerComponent('WorkoutApp', () => App);
