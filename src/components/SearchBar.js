import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography, shadows } from '../utils/theme';

export const SearchBar = ({ value, onChangeText, placeholder = 'Search links...', onClear }) => {
  const { state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  return (
    // FIX: Updated styles for iOS
    <View style={[styles.container, { backgroundColor: state.isDarkMode ? '#2C2C2E' : '#EFEFF0' }]}>
      <View style={styles.searchIcon}>
        {/* FIX: Use Ionicons for iOS search icon */}
        <Ionicons name="search" size={18} color={colors.textSecondary} />
      </View>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {/* FIX: Use Ionicons for iOS clear icon */}
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md, // iOS search bar radius
    paddingHorizontal: spacing.sm,
    height: 36, // iOS search bar height
    // FIX: Removed Android elevation/shadow
  },
  searchIcon: {
    marginHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontSize: 17, // iOS search bar font size
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
    paddingRight: spacing.sm,
  },
});