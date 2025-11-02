import { Appearance } from 'react-native';

export const colors = {
  light: {
    primary: '#6750A4',
    secondary: '#625B71',
    background: '#FFFBFE',
    surface: '#FFF7FF',
    card: '#FFFFFF',
    text: '#1C1B1F',
    textSecondary: '#49454F',
    border: '#CAC4D0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#BA1A1A',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    background: '#1C1B1F',
    surface: '#1C1B1F',
    card: '#2B2930',
    text: '#E6E1E5',
    textSecondary: '#CAC4D0',
    border: '#49454F',
    success: '#81C784',
    warning: '#FFB74D',
    error: '#F44336',
    overlay: 'rgba(0, 0, 0, 0.7)',
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

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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