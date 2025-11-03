import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Linking, Share, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { formatDate, truncateText } from '../utils/helpers';
import { ActionSheetModal } from './ActionSheetModal'; // <-- FIX: Import the new modal

export const LinkCard = ({ link, onEdit }) => {
  const { deleteLink, state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  const [imageError, setImageError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // <-- FIX: Add state for modal

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

  // FIX: This function now just opens the modal
  const handleOptionsPress = () => {
    setIsModalVisible(true);
  };
  
  // FIX: Define the list of actions for the modal
  const cardActions = [
    { 
      title: 'Open in Browser', 
      icon: 'open-outline', 
      onPress: handleOpenLink 
    },
    { 
      title: 'Copy Link', 
      icon: 'copy-outline', 
      onPress: handleCopyLink 
    },
    { 
      title: 'Share Link', 
      icon: 'share-outline', 
      onPress: handleShareLink 
    },
    { 
      title: 'Edit', 
      icon: 'pencil-outline', 
      onPress: handleEditLink 
    },
    { 
      title: 'Delete', 
      icon: 'trash-outline', 
      onPress: handleDelete, 
      isDestructive: true 
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        onPress={handleOpenLink}
        onLongPress={handleOptionsPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.faviconContainer}>
            {!imageError && link.favicon ? (
              <Image
                source={{ uri: link.favicon }}
                style={styles.favicon}
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={[styles.faviconPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="globe-outline" size={18} color={colors.primary} />
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {link.title}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
              {link.domain}
              {link.description ? ` - ${truncateText(link.description, 70)}` : ''}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatDate(link.updatedAt)}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={handleOptionsPress}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.border} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* FIX: Add the modal to the component's render */}
      <ActionSheetModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        actions={cardActions}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    padding: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faviconContainer: {
    marginRight: spacing.md,
  },
  favicon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
  },
  faviconPlaceholder: {
    width: 44,
    height: 44,
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
  },
  domain: {
    // no-op
  },
  description: {
    ...typography.bodySmall,
    fontSize: 15,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  date: {
    ...typography.caption,
    fontSize: 12,
    opacity: 0.8,
  },
  optionsButton: {
    padding: spacing.xs,
  },
});