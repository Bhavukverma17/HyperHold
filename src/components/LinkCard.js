import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Linking, Share, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { formatDate, truncateText } from '../utils/helpers';

export const LinkCard = ({ link, onEdit }) => {
  const { deleteLink, state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Link',
      'Are you sure you want to delete this link?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteLink(link.id),
        },
      ]
    );
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setString(link.url);
      Alert.alert('Success', 'Link copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link to clipboard');
    }
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `${link.title}\n${link.url}`,
        title: link.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share link');
    }
  };

  const handleEditLink = () => {
    onEdit?.(link);
  };

  const handleOpenLink = () => {
    Linking.openURL(link.url).catch(() => {
      Alert.alert('Error', 'Could not open the link');
    });
  };

  const handleOptionsPress = () => {
    Alert.alert(
      'Link Options',
      'Choose an action',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Link', onPress: handleOpenLink },
        { text: 'Edit', onPress: handleEditLink },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, shadows.small]}>
      <TouchableOpacity
        style={styles.content}
        onPress={handleOpenLink}
        activeOpacity={0.9}
      >
        <View style={styles.faviconContainer}>
          {!imageError && link.favicon ? (
            <Image
              source={{ uri: link.favicon }}
              style={styles.favicon}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.faviconPlaceholder, { backgroundColor: colors.primary }]}>
              <Ionicons name="globe" size={16} color="white" />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {link.title}
          </Text>
          <Text style={[styles.domain, { color: colors.textSecondary }]} numberOfLines={1}>
            {link.domain}
          </Text>
          {link.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
              {truncateText(link.description, 80)}
            </Text>
          )}
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDate(link.updatedAt)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.openButton}
          onPress={handleOpenLink}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="open-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
      
      {/* Action buttons - Android style */}
      <View style={styles.actionButtonsContainer }>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={handleCopyLink}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="content-copy" size={20} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Copy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={handleEditLink}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="edit" size={20} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={handleShareLink}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="share" size={20} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="delete" size={20} color={colors.error} />
          <Text style={[styles.actionButtonText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  faviconContainer: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  favicon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
  },
  faviconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontSize: 16,
  },
  domain: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
    fontSize: 14,
    opacity: 0.8,
  },
  description: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    ...typography.caption,
    fontSize: 12,
    opacity: 0.6,
  },
  openButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
  },
  actionButtonText: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    fontWeight: '500',
    fontSize: 12,
  },
}); 