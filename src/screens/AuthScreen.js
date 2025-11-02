import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { requireAuthentication, clearAuthRequired } from '../utils/auth';

export const AuthScreen = ({ onAuthenticated }) => {
  const { state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    handleAuthentication();
  }, []);

  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    try {
      const success = await requireAuthentication();
      if (success) {
        await clearAuthRequired();
        onAuthenticated();
      } else {
        Alert.alert(
          'Authentication Failed',
          'Please try again to access the app.',
          [{ text: 'OK', onPress: handleAuthentication }]
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Authentication Error',
        'An error occurred during authentication. Please try again.',
        [{ text: 'OK', onPress: handleAuthentication }]
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.medium]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="lock-closed" size={48} color={colors.primary} />
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>App Locked</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Please authenticate to access HyperHold
        </Text>
        
        <TouchableOpacity
          style={[styles.authButton, { backgroundColor: colors.primary }]}
          onPress={handleAuthentication}
          disabled={isAuthenticating}
        >
          <Ionicons name="finger-print" size={24} color="white" />
          <Text style={styles.authButtonText}>
            {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  authButtonText: {
    ...typography.body,
    color: 'white',
    fontWeight: '600',
  },
}); 