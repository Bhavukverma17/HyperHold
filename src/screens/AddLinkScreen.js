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
          <Text style={[styles.headerButtonText, { color: colors.primary }]}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      ),
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
          borderColor: colors.border,
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
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>URL *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={url}
            onChangeText={setUrl}
            placeholder="https://example.com"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="next"
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Title</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Link title (optional)"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="next"
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description (optional)"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
          <View style={styles.categoriesContainer}>
            {state.categories.map(renderCategoryOption)}
          </View>
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
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  textArea: {
    ...typography.body,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minHeight: 80,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
}); 