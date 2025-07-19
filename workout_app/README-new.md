# PPL Workout App

An offline-first React Native application for tracking Push-Pull-Legs workouts with location-based reminders and notifications.

## Features

- Track daily workouts following the PPL (Push-Pull-Legs) routine
- Store workout data offline using SQLite
- Receive location-based reminders when near your gym
- Get push notifications for scheduled workouts
- View workout history and progress in a calendar view
- Customize settings and workout preferences

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [React Native development environment](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)
- [Android SDK](https://developer.android.com/about/versions/12/setup-sdk) (for Android development)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PPLWorkoutApp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Android SDK (if not already done):
   - Make sure ANDROID_HOME environment variable is set to your Android SDK path
   - Ensure that platform-tools are installed

4. Accept Android SDK licenses:
   ```bash
   # Run the provided script
   ./accept-licenses.sh
   
   # Or manually accept licenses
   $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
   ```

## Running the App

### Start the Metro server

```bash
npm start
# or
yarn start
```

### Run on Android

Ensure you have an Android emulator running or a physical device connected.

```bash
npm run android
# or
yarn android
```

### Run on iOS (macOS only)

```bash
# Install CocoaPods dependencies (first time only)
bundle install
bundle exec pod install --project-directory=ios

# Run the app
npm run ios
# or
yarn ios
```

## Troubleshooting

### Android Emulator Issues

If you encounter issues with the Android emulator:

1. Make sure your emulator is running:
   ```bash
   $ANDROID_HOME/platform-tools/adb devices
   ```

2. If the app fails to start with license issues:
   ```bash
   ./accept-licenses.sh
   ```

3. For dependency conflicts:
   - Ensure AndroidX compatibility is enabled in gradle.properties
   - Run Jetifier to convert dependencies:
     ```bash
     npx jetify
     ```

4. Check that local.properties has the correct SDK path:
   ```
   sdk.dir=/path/to/your/android/sdk
   ```

### iOS Issues

1. For CocoaPods issues:
   ```bash
   cd ios
   bundle exec pod install
   ```

2. Make sure you're using the correct Xcode version:
   ```bash
   sudo xcode-select -s /Applications/Xcode.app
   ```

## Project Structure

```
PPLWorkoutApp/
├── android/                  # Android native code
├── ios/                      # iOS native code
├── src/
│   ├── components/           # Reusable UI components
│   ├── contexts/             # React Context providers
│   ├── database/             # SQLite database management
│   ├── screens/              # App screens
│   ├── utils/                # Utility functions
│   └── styles/               # Shared styles
├── __tests__/                # Test files
├── App.tsx                   # Main app component
└── index.js                  # Entry point
```

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

## License

[MIT License](LICENSE)
