import React from 'react';
// FIX: Removed BlurView and imported View
import { View, Text, Modal, TouchableOpacity, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { getThemeColors, spacing, borderRadius, typography } from '../utils/theme';

// A single button row in the action sheet
const ActionButton = ({ text, icon, onPress, isDestructive, colors }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.7}>
    <Text 
      style={[
        styles.actionText, 
        { color: isDestructive ? colors.error : colors.primary }
      ]}
    >
      {text}
    </Text>
    <Ionicons 
      name={icon} 
      size={22} 
      color={isDestructive ? colors.error : colors.primary} 
    />
  </TouchableOpacity>
);

export const ActionSheetModal = ({ visible, onClose, actions }) => {
  const { state } = useApp();
  const colors = getThemeColors(state.isDarkMode);
  
  // FIX: Removed blurType variable
  // const blurType = state.isDarkMode ? 'dark' : 'light';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop: Closes modal on press */}
      <Pressable style={styles.backdrop} onPress={onClose} />
      
      <SafeAreaView style={styles.container} pointerEvents="box-none">
        <View style={styles.sheetContainer}>
          {/* Main Action Group */}
          {/* FIX: Replaced BlurView with View and added inline backgroundColor */}
          <View style={[styles.buttonGroup, { backgroundColor: colors.card }]}>
            {actions.map((action, index) => (
              <React.Fragment key={action.title}>
                <ActionButton
                  text={action.title}
                  icon={action.icon}
                  onPress={() => {
                    onClose(); // Close modal first
                    action.onPress(); // Then run action
                  }}
                  isDestructive={action.isDestructive}
                  colors={colors}
                />
                {/* Add separator if not the last item */}
                {index < actions.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
          
          {/* Cancel Button Group */}
          {/* FIX: Replaced BlurView with View and added inline backgroundColor */}
          <View style={[styles.cancelGroup, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.actionButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={[styles.actionText, styles.cancelText, { color: colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    padding: spacing.sm,
  },
  buttonGroup: {
    borderRadius: borderRadius.lg, // iOS rounded corners for groups
    overflow: 'hidden',
    // backgroundColor is now applied inline
  },
  cancelGroup: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    // backgroundColor is now applied inline
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56, // iOS-style button height
    backgroundColor: 'transparent',
  },
  separator: {
    height: 0.5,
    marginLeft: spacing.md,
  },
  actionText: {
    ...typography.body,
    fontSize: 20,
    fontWeight: '400',
  },
  cancelText: {
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
});