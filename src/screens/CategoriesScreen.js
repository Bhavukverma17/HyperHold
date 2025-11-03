import React, { useState, useCallback, useEffect } from 'react'; // FIX: Import useEffect
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
  
  // FIX: Set header style
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.background, // iOS grouped background
        shadowOpacity: 0, // No shadow for iOS list headers
        borderBottomWidth: 0,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, colors]);

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category.id);
    setSearchFilters({ ...state.searchFilters, category: category.id });
    await loadLinks(category.id);
    navigation.navigate('Home');
  };

  const getLinkCount = (categoryId) => {
    if (categoryId === 'all') {
      return state.allLinks.length;
    }
    return state.allLinks.filter(link => link.category === categoryId).length;
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      // FIX: Moved dynamic colors inline
      style={[
        styles.categoryItem,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
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
                color: selectedCategory === item.id ? colors.primary : colors.text,
              },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.categoryCount,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {getLinkCount(item.id)} link{getLinkCount(item.id) !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      {selectedCategory === item.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark" size={22} color={colors.primary} />
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <FlatList
        data={state.categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        // FIX: Moved dynamic color inline
        contentContainerStyle={[styles.listContainer, { backgroundColor: colors.background }]}
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
  listContainer: {
    paddingBottom: spacing.xl,
    // FIX: Removed dynamic color from here
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 0.5,
    // FIX: Removed dynamic colors from here
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  categoryCount: {
    ...typography.bodySmall,
    fontSize: 15,
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