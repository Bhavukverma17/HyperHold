import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography } from '../utils/theme';
import { validateUrl, extractDomain } from '../utils/helpers';

export const AddLinkScreen = ({ navigation, route }) => {
  const { addLink, updateLink, state } = useApp();
  const editingLink = route.params?.link;
  const colors = getThemeColors(state.isDarkMode);
  const [url, setUrl] = useState(editingLink?.url || '');
  const [title, setTitle] = useState(editingLink?.title || '');
  const [description, setDescription] = useState(editingLink?.description || '');
  const [category, setCategory] = useState(editingLink?.category || 'all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: editingLink ? 'Edit Link' : 'Add Link',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleSave} disabled={isLoading}>
          <Text style={[styles.headerButtonText, { color: isLoading ? colors.secondary : colors.primary }]}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
    });
  }, [url, title, description, category, isLoading, editingLink]);

  const handleSave = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }
    if (!validateUrl(url)) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }
    setIsLoading(true);
    try {
      if (editingLink) {
        const updatedLink = {
          ...editingLink,
          url: url.trim(),
          title: title.trim() || extractDomain(url),
          description: description.trim(),
          category,
          updatedAt: Date.now(),
        };
        await updateLink(updatedLink);
        Alert.alert('Success', 'Link updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addLink(url.trim(), title.trim(), description.trim(), category);
        Alert.alert('Success', 'Link added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save link');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryOption = (cat) => (
    <TouchableOpacity
      key={cat.id}
      style={[
        styles.categoryOption,
        {
          backgroundColor: category === cat.id ? colors.primary : colors.surface,
          borderColor: category === cat.id ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setCategory(cat.id)}
    >
      <View style={[styles.categoryColor, { backgroundColor: cat.color }]} />
      <Text
        style={[
          styles.categoryText,
          {
            color: category === cat.id ? 'white' : colors.text,
          },
        ]}
      >
        {cat.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Link Details</Text>
        {/* FIX: Moved dynamic colors inline */}
        <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={url}
            onChangeText={setUrl}
            placeholder="URL (required)"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="next"
          />
          {/* FIX: Moved dynamic color inline */}
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Title (optional)"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="next"
          />
          {/* FIX: Moved dynamic color inline */}
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { color: colors.text }
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Category</Text>
        <View style={styles.categoriesContainer}>
          {state.categories.map(renderCategoryOption)}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  headerButton: {
    marginRight: spacing.md,
  },
  headerButtonText: {
    ...typography.body,
    fontSize: 17,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  inputGroup: {
    borderRadius: borderRadius.md,
    borderWidth: 0.5,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    // FIX: Removed dynamic colors
  },
  input: {
    ...typography.body,
    padding: spacing.md,
    minHeight: 44,
  },
  separator: {
    height: 0.5,
    marginLeft: spacing.md,
    // FIX: Removed dynamic color
  },
  textArea: {
    minHeight: 100,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
  },
  categoryColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  categoryText: {
    ...typography.bodySmall,
    fontSize: 15,
    fontWeight: '500',
  },
});