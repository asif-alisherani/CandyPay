// ============================================================
// CandyPay — Modal Components
// ConfirmationModal, SuccessModal, ErrorModal
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  shadows,
  animations,
} from '../../theme';
import { PrimaryButton, SecondaryButton, DangerButton } from '../buttons';

// ─────────────────────────────────────────
// BASE MODAL
// Shared modal wrapper
// ─────────────────────────────────────────
const BaseModal = ({ visible, onClose, children }) => {
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: animations.duration.normal,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          ...animations.spring.gentle,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          ...animations.spring.gentle,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: animations.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 60,
          duration: animations.duration.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      <View style={styles.modalWrapper} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.modalCard,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}>
          {/* Glass overlay */}
          <LinearGradient
            colors={gradients.glassCard.colors}
            start={gradients.glassCard.start}
            end={gradients.glassCard.end}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─────────────────────────────────────────
// 1. CONFIRMATION MODAL
// For destructive or important actions
// ─────────────────────────────────────────
export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  isLoading = false,
  icon = 'help-circle-outline',
  iconColor = colors.accent,
}) => (
  <BaseModal visible={visible} onClose={onClose}>
    <View style={styles.iconCircle}>
      <LinearGradient
        colors={
          isDanger
            ? gradients.danger.colors
            : gradients.primary.colors
        }
        start={gradients.primary.start}
        end={gradients.primary.end}
        style={styles.iconGradient}>
        <Icon name={icon} size={32} color={colors.white} />
      </LinearGradient>
    </View>

    <Text style={styles.modalTitle}>{title}</Text>
    {message ? (
      <Text style={styles.modalMessage}>{message}</Text>
    ) : null}

    <View style={styles.modalActions}>
      <SecondaryButton
        label={cancelLabel}
        onPress={onClose}
        style={styles.actionBtn}
        fullWidth={false}
      />
      {isDanger ? (
        <DangerButton
          label={confirmLabel}
          onPress={onConfirm}
          loading={isLoading}
          style={styles.actionBtn}
          fullWidth={false}
        />
      ) : (
        <PrimaryButton
          label={confirmLabel}
          onPress={onConfirm}
          loading={isLoading}
          style={styles.actionBtn}
          fullWidth={false}
        />
      )}
    </View>
  </BaseModal>
);

// ─────────────────────────────────────────
// 2. SUCCESS MODAL
// Shown after successful actions
// ─────────────────────────────────────────
export const SuccessModal = ({
  visible,
  onClose,
  title = 'Success!',
  message = '',
  actionLabel = 'Done',
  onAction = null,
}) => {
  const checkAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.spring(checkAnim, {
            toValue: 1,
            useNativeDriver: true,
            ...animations.spring.bouncy,
          }),
          Animated.timing(ringAnim, {
            toValue: 1,
            duration: animations.duration.slow,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      checkAnim.setValue(0);
      ringAnim.setValue(0);
    }
  }, [visible]);

  return (
    <BaseModal visible={visible} onClose={onClose}>
      {/* Animated checkmark */}
      <Animated.View
        style={[
          styles.successIconContainer,
          {
            transform: [{ scale: checkAnim }],
            opacity: ringAnim,
          },
        ]}>
        <LinearGradient
          colors={gradients.success.colors}
          start={gradients.success.start}
          end={gradients.success.end}
          style={styles.successIconGradient}>
          <Icon
            name="checkmark"
            size={40}
            color={colors.white}
          />
        </LinearGradient>
      </Animated.View>

      <Text style={styles.modalTitle}>{title}</Text>
      {message ? (
        <Text style={styles.modalMessage}>{message}</Text>
      ) : null}

      <PrimaryButton
        label={actionLabel}
        onPress={onAction ?? onClose}
        style={styles.singleAction}
        gradient={gradients.success}
      />
    </BaseModal>
  );
};

// ─────────────────────────────────────────
// 3. ERROR MODAL
// Shown on unexpected errors
// ─────────────────────────────────────────
export const ErrorModal = ({
  visible,
  onClose,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  actionLabel = 'Try Again',
  onAction = null,
}) => (
  <BaseModal visible={visible} onClose={onClose}>
    <View style={styles.iconCircle}>
      <LinearGradient
        colors={gradients.danger.colors}
        start={gradients.danger.start}
        end={gradients.danger.end}
        style={styles.iconGradient}>
        <Icon name="close" size={32} color={colors.white} />
      </LinearGradient>
    </View>

    <Text style={styles.modalTitle}>{title}</Text>
    {message ? (
      <Text style={styles.modalMessage}>{message}</Text>
    ) : null}

    <PrimaryButton
      label={actionLabel}
      onPress={onAction ?? onClose}
      style={styles.singleAction}
      gradient={gradients.danger}
    />
  </BaseModal>
);

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },

  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  modalCard: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.modal,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: spacing.xl,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.modal,
  },

  // Icon
  iconCircle: {
    marginBottom: spacing.lg,
  },

  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Success
  successIconContainer: {
    marginBottom: spacing.lg,
  },

  successIconGradient: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  modalTitle: {
    ...typography.styles.cardTitle,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  modalMessage: {
    ...typography.styles.bodyMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  // Actions
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    width: '100%',
  },

  actionBtn: {
    flex: 1,
  },

  singleAction: {
    width: '100%',
    marginTop: spacing.sm,
  },
});