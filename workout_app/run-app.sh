#!/bin/bash

# Add Android platform-tools to PATH
export PATH=$PATH:/home/agond/android-sdk/platform-tools

# Display PATH for debugging
echo "PATH: $PATH"

# Display Android SDK location
echo "ANDROID_HOME: $ANDROID_HOME"

# Display connected devices
echo "Connected devices:"
adb devices

# Run the React Native app
# shellcheck disable=SC2164
cd /space/personal/learning/practice_React_Native/PPLWorkoutApp
echo "Starting Metro server..."
npx react-native start &
sleep 5
echo "Installing and running app on emulator..."
npx react-native run-android
