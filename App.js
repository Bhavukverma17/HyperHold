import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
// <-- FIX: Removed AuthScreen and auth utils
// <-- FIX: Removed AppState

const AppContent = () => {
  const { state } = useApp();
  // <-- FIX: Removed all state and effects related to authentication
  // (isAuthenticated, showAuth, checkAuthenticationStatus, handleAppStateChange, etc.)

  // <-- FIX: Removed `if (showAuth)` check
  return (
    <>
      <AppNavigator />
      <StatusBar style={state.isDarkMode ? 'light' : 'dark'} />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}