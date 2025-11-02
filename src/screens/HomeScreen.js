import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinkCard } from '../components/LinkCard';
import { SearchBar } from '../components/SearchBar';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, typography, borderRadius } from '../utils/theme';

export const HomeScreen = ({ navigation }) => {
  const { state, loadLinks, searchLinks, setSearchFilters } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = getThemeColors(state.isDarkMode);

  useFocusEffect(
    useCallback(() => {
      if (searchQuery) {
        searchLinks(searchQuery);
      } else {
        loadLinks(state.searchFilters.category);
      }
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

  const handleAddLink = () => {
    navigation.navigate('AddLink');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? 'No links found' : 'No links yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Tap the + button to add your first link'
        }
      </Text>
    </View>
  );

  const renderLink = ({ item }) => (
    <LinkCard link={item} onEdit={handleEditLink} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.appName, { color: colors.text }]}>HyperHold</Text>
            <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>Your Personal Link Vault</Text>
          </View>
          <View style={[styles.linkCountBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.linkCountText, { color: colors.textSecondary }]}>
              {state.links.length} link{state.links.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
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
      <FloatingActionButton onPress={handleAddLink} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    ...typography.h1,
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  appSubtitle: {
    ...typography.body,
    opacity: 0.8,
  },
  linkCountBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
  },
  linkCountText: {
    ...typography.bodySmall,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Space for FAB
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