import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthScreen } from './src/screens/AuthScreen';
import { isAuthRequired, markAuthRequired } from './src/utils/auth';
import { AppState } from 'react-native';

const AppContent = () => {
  const { state } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    checkAuthenticationStatus();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const checkAuthenticationStatus = async () => {
    const authRequired = await isAuthRequired();
    setShowAuth(authRequired);
    if (!authRequired) {
      setIsAuthenticated(true);
    }
  };

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active' && state.settings.appLock) {
      markAuthRequired();
      setShowAuth(true);
      setIsAuthenticated(false);
    }
  };

  const handleAuthenticated = () => {
    setShowAuth(false);
    setIsAuthenticated(true);
  };

  if (showAuth) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

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
