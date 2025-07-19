#!/bin/bash

# This script runs your React Native app on an existing Android emulator
# It assumes you already have an emulator running

# First, check if adb is available in the system PATH
ADB_PATH=$(which adb)

if [ -n "$ADB_PATH" ]; then
  echo "Found adb at: $ADB_PATH"
  
  # Create symbolic link to system adb in expected location
  mkdir -p ~/android-sdk/platform-tools
  ln -sf $ADB_PATH ~/android-sdk/platform-tools/adb
  
  echo "Created symbolic link to system adb"
else
  echo "adb not found in PATH. Please ensure Android platform tools are installed."
  exit 1
fi

# Update the local.properties file with correct SDK path
# shellcheck disable=SC2046
ANDROID_SDK_PATH=$(dirname $(dirname $ADB_PATH))
echo "sdk.dir=$ANDROID_SDK_PATH" > android/local.properties
echo "Updated local.properties with SDK path: $ANDROID_SDK_PATH"

# List connected devices
echo "Connected devices:"
adb devices

# Run the app
echo "Running the app..."
npx react-native run-android
