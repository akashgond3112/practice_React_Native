#!/bin/bash

# Create Android SDK directory
mkdir -p ~/android-sdk
# shellcheck disable=SC2164
cd ~/android-sdk

# Download platform tools
if [ ! -d "platform-tools" ]; then
  echo "Downloading platform tools..."
  wget https://dl.google.com/android/repository/platform-tools-latest-linux.zip
  unzip -q platform-tools-latest-linux.zip
  rm platform-tools-latest-linux.zip
fi

# Download command line tools
if [ ! -d "cmdline-tools/latest" ]; then
  echo "Downloading command line tools..."
  mkdir -p cmdline-tools/latest
  wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
  unzip -q commandlinetools-linux-9477386_latest.zip
  mv cmdline-tools/* cmdline-tools/latest/
  rm commandlinetools-linux-9477386_latest.zip
fi

# Set environment variables
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "Android SDK set up at $ANDROID_HOME"
echo "Platform tools version:"
$ANDROID_HOME/platform-tools/adb --version

# Install SDK packages
echo "Installing Android SDK packages..."
yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "platforms;android-35" "build-tools;35.0.0" "system-images;android-35;google_apis;x86_64"

# Create an AVD (Android Virtual Device)
echo "Creating an Android Virtual Device..."
echo "no" | $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd -n test_device -k "system-images;android-35;google_apis;x86_64" --force

echo "Android SDK setup complete"
