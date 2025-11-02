import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography } from '../utils/theme';

export const CategoriesScreen = ({ navigation }) => {
  const { state, setSearchFilters, loadLinks } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const colors = getThemeColors(state.isDarkMode);

  useFocusEffect(
    useCallback(() => {
      setSelectedCategory(state.searchFilters.category);
    }, [state.searchFilters.category])
  );

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category.id);
    setSearchFilters({ ...state.searchFilters, category: category.id });
    await loadLinks(category.id);
    navigation.navigate('Home');
  };

  const getLinkCount = (categoryId) => {
    if (categoryId === 'all') {
      return state.allLinks.length; // <-- FIX: Read from allLinks
    }
    return state.allLinks.filter(link => link.category === categoryId).length; // <-- FIX: Read from allLinks
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor: selectedCategory === item.id ? colors.primary : colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
        <View style={styles.categoryInfo}>
          <Text
            style={[
              styles.categoryName,
              {
                color: selectedCategory === item.id ? 'white' : colors.text,
              },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.categoryCount,
              {
                color: selectedCategory === item.id ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
              },
            ]}
          >
            {getLinkCount(item.id)} link{getLinkCount(item.id) !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      {selectedCategory === item.id && (
        <View style={styles.selectedIndicator}>
          <MaterialIcons name="check" size={20} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No categories found
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Categories will appear here once created
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Categories</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Filter your links by category</Text>
      </View>
      <FlatList
        data={state.categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySmall,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  categoryCount: {
    ...typography.caption,
  },
  selectedIndicator: {
    marginLeft: spacing.sm,
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