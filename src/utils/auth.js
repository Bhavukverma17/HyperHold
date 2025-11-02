import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEYS = {
  APP_LOCK_ENABLED: 'hyperhold_app_lock_enabled',
  BIOMETRIC_ENABLED: 'hyperhold_biometric_enabled',
  AUTH_REQUIRED: 'hyperhold_auth_required',
};

export const checkBiometricAvailability = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
};

export const authenticateUser = async (reason = 'Please authenticate to access the app') => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      fallbackLabel: 'Use passcode',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    
    return result.success;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

export const isAppLockEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem(AUTH_KEYS.APP_LOCK_ENABLED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking app lock status:', error);
    return false;
  }
};

export const isBiometricEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem(AUTH_KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking biometric status:', error);
    return false;
  }
};

export const setAppLockEnabled = async (enabled) => {
  try {
    await AsyncStorage.setItem(AUTH_KEYS.APP_LOCK_ENABLED, enabled.toString());
  } catch (error) {
    console.error('Error setting app lock:', error);
    throw error;
  }
};

export const setBiometricEnabled = async (enabled) => {
  try {
    await AsyncStorage.setItem(AUTH_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  } catch (error) {
    console.error('Error setting biometric auth:', error);
    throw error;
  }
};

export const requireAuthentication = async () => {
  try {
    const appLockEnabled = await isAppLockEnabled();
    const biometricEnabled = await isBiometricEnabled();
    
    if (!appLockEnabled) {
      return true; // No authentication required
    }
    
    if (biometricEnabled) {
      const isAvailable = await checkBiometricAvailability();
      if (isAvailable) {
        return await authenticateUser('Please authenticate to access HyperHold');
      }
    }
    
    // Fallback to device passcode if biometric is not available
    return await authenticateUser('Please enter your passcode to access HyperHold');
  } catch (error) {
    console.error('Error requiring authentication:', error);
    return false;
  }
};

export const markAuthRequired = async () => {
  try {
    await AsyncStorage.setItem(AUTH_KEYS.AUTH_REQUIRED, 'true');
  } catch (error) {
    console.error('Error marking auth required:', error);
  }
};

export const clearAuthRequired = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_KEYS.AUTH_REQUIRED);
  } catch (error) {
    console.error('Error clearing auth required:', error);
  }
};

export const isAuthRequired = async () => {
  try {
    const value = await AsyncStorage.getItem(AUTH_KEYS.AUTH_REQUIRED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking auth required:', error);
    return false;
  }
}; 