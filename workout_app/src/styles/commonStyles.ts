/**
 * Common styles for the PPL Workout App
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Define color palette
export const colors: {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  background: string;
  white: string;
  text: string;
  textSecondary: string;
  border: string;
  completed: string;
  error: string;
} = {
  primary: '#4a5bd9',
  primaryDark: '#3949ab',
  primaryLight: '#7986cb',
  accent: '#ff5722',
  background: '#f5f5f5',
  white: '#ffffff',
  text: '#212121',
  textSecondary: '#757575',
  border: '#e0e0e0',
  completed: '#4caf50',
  error: '#f44336',
};

// Define style props interface
interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  card: ViewStyle;
  row: ViewStyle;
  spaceBetween: ViewStyle;
  center: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  text: TextStyle;
  textSecondary: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  buttonOutline: ViewStyle;
  buttonOutlineText: TextStyle;
  buttonSecondary: ViewStyle;
  errorText: TextStyle;
  loadingContainer: ViewStyle;
  divider: ViewStyle;
  icon: ViewStyle;
  badgeContainer: ViewStyle;
  badgeText: TextStyle;
  shadow: ViewStyle;
  infoBox: ViewStyle;
  infoText: TextStyle;
  completedText: TextStyle;
}

export const commonStyles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  buttonOutlineText: {
    color: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.accent,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#1976d2',
    fontSize: 14,
  },
  completedText: {
    color: colors.completed,
    fontWeight: 'bold',
  },
});
