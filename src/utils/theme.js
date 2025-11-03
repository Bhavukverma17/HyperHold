import { Appearance } from 'react-native';

// FIX: iOS System Colors
export const colors = {
  light: {
    primary: '#007AFF', // iOS System Blue
    secondary: '#8E8E93', // iOS System Gray
    background: '#F2F2F7', // iOS System Grouped Background
    surface: '#FFFFFF', // iOS System Background (Plain)
    card: '#FFFFFF', // iOS List Item Background
    text: '#000000',
    textSecondary: '#6D6D72', // iOS Gray
    border: '#C6C6C8', // iOS Separator Color
    success: '#34C759', // iOS System Green
    warning: '#FF9500', // iOS System Orange
    error: '#FF3B30', // iOS System Red
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  dark: {
    primary: '#0A84FF', // iOS System Blue (Dark)
    secondary: '#8E8E93', // iOS System Gray (Dark)
    background: '#000000', // iOS System Background (Plain)
    surface: '#1C1C1E', // iOS System Grouped Background
    card: '#1C1C1E', // iOS List Item Background
    text: '#FFFFFF',
    textSecondary: '#8D8D93', // iOS Gray (Dark)
    border: '#38383A', // iOS Separator Color (Dark)
    success: '#30D158', // iOS System Green (Dark)
    warning: '#FF9F0A', // iOS System Orange (Dark)
    error: '#FF453A', // iOS System Red (Dark)
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
};

export const getThemeColors = (isDarkMode = null) => {
  // If isDarkMode is explicitly provided, use it
  if (isDarkMode !== null) {
    return isDarkMode ? colors.dark : colors.light;
  }
  
  // Otherwise, fall back to system appearance
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? colors.dark : colors.light;
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// FIX: Updated border radius for iOS HIG
export const borderRadius = {
  sm: 4,
  md: 10, // Standard iOS corner radius
  lg: 12,
  xl: 20,
  round: 50,
};

// FIX: Updated typography to feel like Apple's "San Francisco"
export const typography = {
  // iOS Large Title
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
    lineHeight: 41,
  },
  // iOS Title 1
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  // iOS Title 2
  h3: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  // iOS Body
  body: {
    fontSize: 17,
    fontWeight: 'normal',
    lineHeight: 22,
  },
  // iOS Callout
  bodySmall: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 21,
  },
  // iOS Caption 2
  caption: {
    fontSize: 11,
    fontWeight: 'normal',
    lineHeight: 13,
  },
};

// FIX: Updated shadows for iOS
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};