#!/bin/bash

# Path to the sdkmanager executable
SDKMANAGER=$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager

# Check if sdkmanager exists
if [ ! -f "$SDKMANAGER" ]; then
  echo "Error: sdkmanager not found at $SDKMANAGER"
  exit 1
fi

# Accept all licenses
echo "Accepting Android SDK licenses..."
yes | $SDKMANAGER --licenses

echo "License acceptance completed."

# Verify that licenses are accepted
echo "Verifying license acceptance..."
$SDKMANAGER --list_installed

echo "Now try running your app again:"
echo "cd /space/personal/learning/practice_React_Native/PPLWorkoutApp"
echo "npx react-native run-android"
