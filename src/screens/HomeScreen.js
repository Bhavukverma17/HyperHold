import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinkCard } from '../components/LinkCard';
import { SearchBar } from '../components/SearchBar';
// <-- FIX: Removed FloatingActionButton
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, typography, borderRadius } from '../utils/theme';

export const HomeScreen = ({ navigation }) => {
  const { state, loadLinks, searchLinks, setSearchFilters } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = getThemeColors(state.isDarkMode);

  useFocusEffect(
    useCallback(() => {
      handleRefresh(); 
    }, [state.searchFilters.category])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (searchQuery) {
        await searchLinks(searchQuery);
      } else {
        await loadLinks(state.searchFilters.category);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh links');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSearchFilters({ ...state.searchFilters, query });
    if (query.trim()) {
      await searchLinks(query);
    } else {
      await loadLinks(state.searchFilters.category);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchFilters({ ...state.searchFilters, query: '' });
    loadLinks(state.searchFilters.category);
  };

  const handleEditLink = (link) => {
    navigation.navigate('AddLink', { link });
  };

  // <-- FIX: Removed handleAddLink (now in header)

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? 'No links found' : 'No links yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Tap the + button in the header to add' // <-- FIX: Updated text
        }
      </Text>
    </View>
  );

  const renderLink = ({ item }) => (
    <LinkCard link={item} onEdit={handleEditLink} />
  );

  return (
    // FIX: Use `colors.surface` for plain background
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['left', 'right']}>
      {/* <-- FIX: Header is now in AppNavigator, remove it from here --> */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClearSearch}
      />
      <FlatList
        data={state.links}
        renderItem={renderLink}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      {/* <-- FIX: Removed FloatingActionButton --> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // <-- FIX: Removed header styles
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Space for tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
});