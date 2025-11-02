import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, shadows } from '../utils/theme';

export const FloatingActionButton = ({ onPress, icon = 'add' }) => {
  const { state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.primary },
        shadows.large,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name={icon} size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 