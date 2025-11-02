import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { checkBiometricAvailability, setAppLockEnabled, setBiometricEnabled } from '../utils/auth';

export const SettingsScreen = ({ navigation }) => {
  const { state, updateSetting } = useApp();
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const colors = getThemeColors(state.isDarkMode);

  const checkBiometricAvailabilityLocal = async () => {
    const isAvailable = await checkBiometricAvailability();
    setIsBiometricAvailable(isAvailable);
  };

  React.useEffect(() => {
    checkBiometricAvailabilityLocal();
  }, []);

  const handleDarkModeChange = async (value) => {
    try {
      await updateSetting('darkMode', value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update dark mode setting');
    }
  };

  const handleAppLockChange = async (value) => {
    try {
      await setAppLockEnabled(value);
      await updateSetting('appLock', value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update app lock setting');
    }
  };

  const handleBiometricAuthChange = async (value) => {
    if (value && !isBiometricAvailable) {
      Alert.alert(
        'Biometric Authentication',
        'Biometric authentication is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }
    try {
      await setBiometricEnabled(value);
      await updateSetting('biometricAuth', value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update biometric authentication setting');
    }
  };

  const renderSettingCard = (title, subtitle, rightElement, icon, bottomElement) => (
    <View style={[styles.settingCard, { backgroundColor: colors.card }, shadows.small]}>
      <View style={styles.settingContent}>
        {icon && (
          <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
            <MaterialIcons name={icon} size={20} color={colors.primary} />
          </View>
        )}
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
        {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
      </View>
      {bottomElement && (
        <View style={[styles.settingBottom, { borderTopColor: colors.border }]}>
          {bottomElement}
        </View>
      )}
    </View>
  );

  const renderDarkModeOptions = () => (
    <View style={styles.optionsContainer}>
      {[
        { value: 'light', label: 'Light', icon: 'light-mode' },
        { value: 'dark', label: 'Dark', icon: 'dark-mode' },
      ].map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            {
              backgroundColor: state.settings.darkMode === option.value ? colors.primary : colors.surface,
              borderColor: state.settings.darkMode === option.value ? colors.primary : colors.border,
            },
            shadows.small,
          ]}
          onPress={() => handleDarkModeChange(option.value)}
        >
          <MaterialIcons 
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Customize your experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={styles.cardContainer}>
            {renderSettingCard('Theme', 'Choose your preferred theme', null, 'palette', renderDarkModeOptions())}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
          <View style={styles.cardContainer}>
            {renderSettingCard(
              'App Lock',
              'Require authentication to open the app',
              <Switch
                value={Boolean(state.settings.appLock)}
                onValueChange={handleAppLockChange}
                trackColor={{ false: colors.border, true: colors.primary + '40' }}
                thumbColor={Boolean(state.settings.appLock) ? colors.primary : colors.textSecondary}
              />,
              'lock'
            )}
            {renderSettingCard(
              'Biometric Authentication',
              'Use fingerprint or face ID',
              <Switch
                value={Boolean(state.settings.biometricAuth)}
                onValueChange={handleBiometricAuthChange}
                trackColor={{ false: colors.border, true: colors.primary + '40' }}
                thumbColor={Boolean(state.settings.biometricAuth) ? colors.primary : colors.textSecondary}
                disabled={!isBiometricAvailable}
              />,
              'fingerprint'
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <View style={styles.cardContainer}>
            {renderSettingCard('Version', 'Current app version', <Text style={[styles.versionText, { color: colors.textSecondary }]}>1.0.0</Text>, 'info')}
            <TouchableOpacity
              style={[styles.settingCard, { backgroundColor: colors.card }, shadows.small]}
              onPress={() => {
                Alert.alert('HyperHold', 'A simple and elegant link manager for your favorite websites.', [{ text: 'OK' }]);
              }}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                  <MaterialIcons name="help" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>About HyperHold</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Learn more about the app</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...typography.body,
    opacity: 0.8,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
  cardContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  settingCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    elevation: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontSize: 16,
  },
  settingSubtitle: {
    ...typography.bodySmall,
    fontSize: 14,
    opacity: 0.8,
  },
  settingRight: {
    marginLeft: spacing.md,
  },
  settingBottom: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minWidth: 80,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  optionText: {
    ...typography.bodySmall,
    fontWeight: '500',
    fontSize: 14,
  },
  versionText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
}); 