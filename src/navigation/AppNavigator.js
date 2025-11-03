import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { HomeScreen } from '../screens/HomeScreen';
import { AddLinkScreen } from '../screens/AddLinkScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { getThemeColors, spacing } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  const { state } = useApp();
  const colors = getThemeColors(state.isDarkMode);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'HyperHold',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddLink')}
              style={{ marginRight: spacing.md }}
            >
              <Ionicons name="add-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddLink"
        component={AddLinkScreen}
        options={({ route }) => ({
          title: route.params?.link ? 'Edit Link' : 'Add Link',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
        })}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const { state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            // FIX: Removed 'ios-' prefix
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            // FIX: Removed 'ios-' prefix
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Settings') {
            // FIX: Removed 'ios-' prefix
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            // FIX: Removed 'ios-' prefix
            iconName = 'help';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginBottom: -3,
        },
        tabBarStyle: {
          backgroundColor: state.isDarkMode ? 'rgba(28, 28, 30, 0.85)' : 'rgba(249, 249, 249, 0.85)',
          position: 'absolute',
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          elevation: 0,
          height: 84,
          paddingBottom: 30,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Links',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Categories',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};