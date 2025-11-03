import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography, shadows } from '../utils/theme';

export const SettingsScreen = ({ navigation }) => {
  const { state, updateSetting } = useApp();
  const colors = getThemeColors(state.isDarkMode);

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.background, 
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, colors]);


  const handleDarkModeChange = async (value) => {
    try {
      await updateSetting('darkMode', value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update dark mode setting');
    }
  };

  const renderSettingItem = (title, subtitle, rightElement, icon, iconColor, onPress) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: iconColor || colors.primary }]}>
        <Ionicons name={icon} size={18} color="white" />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {onPress && <Ionicons name="chevron-forward" size={18} color={colors.border} />}
      </View>
    </TouchableOpacity>
  );

  const renderDarkModeOptions = () => (
    <View style={styles.optionsContainer}>
      {[
        // FIX: Removed 'ios-' prefix
        { value: 'light', label: 'Light', icon: 'sunny' },
        { value: 'dark', label: 'Dark', icon: 'moon' },
        { value: 'system', label: 'System', icon: 'settings' } 
      ].map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            {
              backgroundColor: state.settings.darkMode === option.value ? colors.primary : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => handleDarkModeChange(option.value)}
        >
          <Ionicons 
            name={option.icon} 
            size={16} 
            color={state.settings.darkMode === option.value ? 'white' : colors.textSecondary} 
          />
          <Text
            style={[
              styles.optionText,
              {
                color: state.settings.darkMode === option.value ? 'white' : colors.text,
              },
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
        <View style={[styles.settingGroup, { borderColor: colors.border }]}>
          {renderSettingItem(
            'Theme', 
            `Current: ${state.settings.darkMode.charAt(0).toUpperCase() + state.settings.darkMode.slice(1)}`, 
            null, 
            'color-palette', // FIX: Removed 'ios-' prefix
            colors.primary
          )}
          <View style={[styles.settingItem, styles.bottomSettingItem, { backgroundColor: colors.card }]}>
             {renderDarkModeOptions()}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
        <View style={[styles.settingGroup, { borderColor: colors.border }]}>
          {renderSettingItem(
            'Version', 
            null, 
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>1.0.0</Text>, 
            'information-circle', // FIX: Removed 'ios-' prefix
            colors.secondary
          )}
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          {renderSettingItem(
            'About HyperHold', 
            null, 
            null, 
            'help-circle', // FIX: Removed 'ios-' prefix
            '#34C759', // iOS System Green
            () => {
              Alert.alert('HyperHold', 'A simple and elegant link manager for your favorite websites.', [{ text: 'OK' }]);
            }
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.lg,
  },
  settingGroup: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 0.5,
    overflow: 'hidden',
    borderColor: 'transparent', // Will be set inline
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 44,
    backgroundColor: 'transparent', // Will be set inline
  },
  bottomSettingItem: {
    paddingVertical: spacing.md,
  },
  separator: {
    height: 0.5,
    marginLeft: spacing.md + 30 + spacing.md, 
    backgroundColor: 'transparent', // Will be set inline
  },
  settingIconContainer: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    fontSize: 17,
  },
  settingSubtitle: {
    ...typography.caption,
    fontSize: 13,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    width: '100%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 0.5,
    minWidth: 80,
    justifyContent: 'center',
    gap: spacing.xs,
    ...shadows.small,
  },
  optionText: {
    ...typography.bodySmall,
    fontWeight: '500',
    fontSize: 14,
  },
  versionText: {
    ...typography.body,
    fontSize: 17,
  },
});