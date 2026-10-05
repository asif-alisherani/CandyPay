// ============================================================
// CandyPay — Button Components
// PrimaryButton, SecondaryButton, IconButton
// ============================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  gradients,
  spacing,
  radius,
  shadows,
  typography,
  animations,
} from '../../theme';

// ─────────────────────────────────────────
// 1. PRIMARY BUTTON
// Gradient filled — main CTA
// ─────────────────────────────────────────
export const PrimaryButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  style = {},
  labelStyle = {},
  gradient = gradients.primary,
  fullWidth = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: animations.press.scaleDown,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: animations.press.scaleUp,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
    if (!disabled && !loading) {
      onPress && onPress();
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}>
      <Animated.View
        style={[
          styles.primaryWrapper,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabledWrapper,
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <LinearGradient
          colors={
            isDisabled
              ? [colors.textDisabled, colors.textDisabled]
              : gradient.colors
          }
          start={gradient.start}
          end={gradient.end}
          style={styles.primaryGradient}>
          {/* Left Icon */}
          {icon && iconPosition === 'left' && !loading ? (
            <Icon
              name={icon}
              size={20}
              color={colors.white}
              style={styles.iconLeft}
            />
          ) : null}

          {/* Loading Spinner */}
          {loading ? (
            <ActivityIndicator
              size="small"
              color={colors.white}
              style={styles.spinner}
            />
          ) : (
            <Text
              style={[
                styles.primaryLabel,
                isDisabled && styles.disabledLabel,
                labelStyle,
              ]}>
              {label}
            </Text>
          )}

          {/* Right Icon */}
          {icon && iconPosition === 'right' && !loading ? (
            <Icon
              name={icon}
              size={20}
              color={colors.white}
              style={styles.iconRight}
            />
          ) : null}
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// ─────────────────────────────────────────
// 2. SECONDARY BUTTON
// Glass outline style
// ─────────────────────────────────────────
export const SecondaryButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  style = {},
  labelStyle = {},
  borderColor = colors.border,
  textColor = colors.textSecondary,
  fullWidth = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: animations.press.scaleDown,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: animations.press.scaleUp,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
    if (!disabled && !loading) {
      onPress && onPress();
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}>
      <Animated.View
        style={[
          styles.secondaryWrapper,
          fullWidth && styles.fullWidth,
          { borderColor: isDisabled ? colors.textDisabled : borderColor },
          isDisabled && styles.disabledWrapper,
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        {/* Left Icon */}
        {icon && iconPosition === 'left' && !loading ? (
          <Icon
            name={icon}
            size={20}
            color={isDisabled ? colors.textDisabled : textColor}
            style={styles.iconLeft}
          />
        ) : null}

        {/* Loading */}
        {loading ? (
          <ActivityIndicator
            size="small"
            color={textColor}
            style={styles.spinner}
          />
        ) : (
          <Text
            style={[
              styles.secondaryLabel,
              { color: isDisabled ? colors.textDisabled : textColor },
              labelStyle,
            ]}>
            {label}
          </Text>
        )}

        {/* Right Icon */}
        {icon && iconPosition === 'right' && !loading ? (
          <Icon
            name={icon}
            size={20}
            color={isDisabled ? colors.textDisabled : textColor}
            style={styles.iconRight}
          />
        ) : null}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// ─────────────────────────────────────────
// 3. DANGER BUTTON
// Red accent — for destructive actions
// ─────────────────────────────────────────
export const DangerButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon = null,
  style = {},
  fullWidth = true,
}) => (
  <PrimaryButton
    label={label}
    onPress={onPress}
    loading={loading}
    disabled={disabled}
    icon={icon}
    style={style}
    fullWidth={fullWidth}
    gradient={gradients.danger}
  />
);

// ─────────────────────────────────────────
// 4. ICON BUTTON
// Circle icon button
// ─────────────────────────────────────────
export const IconButton = ({
  icon,
  onPress,
  size = 44,
  iconSize = 22,
  color = colors.textPrimary,
  backgroundColor = colors.backgroundCard,
  borderColor = colors.border,
  gradient = null,
  style = {},
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
    if (!disabled) onPress && onPress();
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor,
    overflow: 'hidden',
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}>
      <Animated.View
        style={[
          containerStyle,
          { backgroundColor: gradient ? 'transparent' : backgroundColor },
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        {gradient ? (
          <LinearGradient
            colors={gradient.colors}
            start={gradient.start}
            end={gradient.end}
            style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
            <Icon name={icon} size={iconSize} color={color} />
          </LinearGradient>
        ) : (
          <Icon name={icon} size={iconSize} color={color} />
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// ─────────────────────────────────────────
// 5. TEXT BUTTON
// Transparent label only
// ─────────────────────────────────────────
export const TextButton = ({
  label,
  onPress,
  color = colors.primary,
  style = {},
  labelStyle = {},
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
    if (!disabled) onPress && onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}>
      <Animated.View
        style={[
          styles.textButtonWrapper,
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <Text
          style={[
            styles.textButtonLabel,
            { color: disabled ? colors.textDisabled : color },
            labelStyle,
          ]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  // Primary
  primaryWrapper: {
    borderRadius: radius.button,
    overflow: 'hidden',
    ...shadows.button,
  },
  fullWidth: {
    width: '100%',
  },
  primaryGradient: {
    height: spacing.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
  },
  primaryLabel: {
    ...typography.styles.buttonText,
  },

  // Secondary
  secondaryWrapper: {
    height: spacing.buttonHeight,
    borderRadius: radius.button,
    borderWidth: 1,
    backgroundColor: colors.backgroundCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  secondaryLabel: {
    ...typography.styles.buttonText,
    color: colors.textSecondary,
  },

  // Disabled
  disabledWrapper: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: colors.textDisabled,
  },

  // Icons
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  spinner: {
    marginHorizontal: spacing.sm,
  },

  // Text Button
  textButtonWrapper: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonLabel: {
    ...typography.styles.buttonText,
    fontSize: 14,
  },
});