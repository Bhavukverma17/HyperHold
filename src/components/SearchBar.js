import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography } from '../utils/theme';

export const SearchBar = ({ value, onChangeText, placeholder = 'Search links...', onClear }) => {
  const { state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderRadius: 25, paddingHorizontal: spacing.md }]}> 
      <View style={styles.searchIcon}>
        <MaterialIcons name="search" size={20} color={colors.textSecondary} />
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
          <MaterialIcons name="close" size={20} color={colors.textSecondary} />
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
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
}); 