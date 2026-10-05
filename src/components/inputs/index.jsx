// ============================================================
// CandyPay — Input Components
// TextInput, PasswordInput
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  animations,
} from '../../theme';

// ─────────────────────────────────────────
// 1. BASE TEXT INPUT
// Full-featured input with label,
// leading/trailing icons, error, helper
// ─────────────────────────────────────────
export const AppTextInput = ({
  label = null,
  placeholder = '',
  value,
  onChangeText,
  onBlur,
  error = null,
  helperText = null,
  leadingIcon = null,
  trailingIcon = null,
  onTrailingIconPress = null,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  maxLength = null,
  editable = true,
  style = {},
  inputStyle = {},
  returnKeyType = 'done',
  onSubmitEditing = null,
  inputRef = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: animations.duration.fast,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? colors.statusRejected : colors.border,
      error ? colors.statusRejected : colors.borderFocus,
    ],
  });

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <View style={[styles.inputContainer, style]}>
      {/* Label */}
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}

      {/* Input Box */}
      <Animated.View
        style={[
          styles.inputBox,
          multiline && styles.multilineBox,
          { borderColor },
          isFocused && styles.inputBoxFocused,
          !editable && styles.inputBoxDisabled,
        ]}>
        {/* Leading Icon */}
        {leadingIcon ? (
          <Icon
            name={leadingIcon}
            size={20}
            color={isFocused ? colors.accent : colors.textMuted}
            style={styles.leadingIcon}
          />
        ) : null}

        {/* Text Input */}
        <RNTextInput
          ref={inputRef}
          style={[
            styles.input,
            leadingIcon && styles.inputWithLeading,
            trailingIcon && styles.inputWithTrailing,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
        />

        {/* Trailing Icon */}
        {trailingIcon ? (
          <TouchableWithoutFeedback onPress={onTrailingIconPress}>
            <View style={styles.trailingIcon}>
              <Icon
                name={trailingIcon}
                size={20}
                color={isFocused ? colors.accent : colors.textMuted}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </Animated.View>

      {/* Error / Helper */}
      {error ? (
        <View style={styles.errorRow}>
          <Icon
            name="alert-circle-outline"
            size={13}
            color={colors.statusRejected}
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

// ─────────────────────────────────────────
// 2. PASSWORD INPUT
// AppTextInput with visibility toggle
// ─────────────────────────────────────────
export const PasswordInput = ({
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChangeText,
  onBlur,
  error = null,
  helperText = null,
  style = {},
  inputRef = null,
  returnKeyType = 'done',
  onSubmitEditing = null,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <AppTextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      leadingIcon="lock-closed-outline"
      trailingIcon={visible ? 'eye-off-outline' : 'eye-outline'}
      onTrailingIconPress={() => setVisible((v) => !v)}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      style={style}
      inputRef={inputRef}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
    />
  );
};

// ─────────────────────────────────────────
// 3. AMOUNT INPUT
// For USDT amount entry
// Shows unit label on right
// ─────────────────────────────────────────
export const AmountInput = ({
  label = 'Amount',
  placeholder = '0.00',
  value,
  onChangeText,
  onBlur,
  error = null,
  unit = 'USDT',
  style = {},
  inputRef = null,
  returnKeyType = 'done',
  onSubmitEditing = null,
}) => (
  <View style={[styles.inputContainer, style]}>
    {label ? <Text style={styles.inputLabel}>{label}</Text> : null}

    <View style={styles.amountBox}>
      <Icon
        name="logo-bitcoin"
        size={20}
        color={colors.cryptoGreen}
        style={styles.leadingIcon}
      />
      <RNTextInput
        ref={inputRef}
        style={styles.amountInput}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        keyboardType="decimal-pad"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        selectionColor={colors.accent}
        cursorColor={colors.accent}
      />
      <View style={styles.unitBadge}>
        <Text style={styles.unitText}>{unit}</Text>
      </View>
    </View>

    {error ? (
      <View style={styles.errorRow}>
        <Icon
          name="alert-circle-outline"
          size={13}
          color={colors.statusRejected}
          style={styles.errorIcon}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    ) : null}
  </View>
);

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: spacing.md,
  },

  inputLabel: {
    ...typography.styles.label,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: spacing.inputHeight,
    paddingHorizontal: spacing.md,
  },

  multilineBox: {
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    minHeight: 100,
  },

  inputBoxFocused: {
    backgroundColor: 'rgba(94,23,235,0.08)',
    ...shadows.inputFocus,
  },

  inputBoxDisabled: {
    opacity: 0.5,
  },

  input: {
    flex: 1,
    ...typography.styles.body,
    color: colors.textPrimary,
    paddingVertical: 0,
    minHeight: spacing.inputHeight,
  },

  inputWithLeading: {
    paddingLeft: spacing.sm,
  },

  inputWithTrailing: {
    paddingRight: spacing.sm,
  },

  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },

  leadingIcon: {
    marginRight: spacing.xs,
  },

  trailingIcon: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  errorIcon: {
    marginRight: spacing.xs / 2,
  },

  errorText: {
    ...typography.styles.caption,
    color: colors.statusRejected,
    flex: 1,
  },

  helperText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },

  // Amount Input
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: spacing.inputHeight,
    paddingHorizontal: spacing.md,
  },

  amountInput: {
    flex: 1,
    ...typography.styles.body,
    color: colors.cryptoGreen,
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-Bold',
    paddingVertical: 0,
    paddingLeft: spacing.sm,
  },

  unitBadge: {
    backgroundColor: 'rgba(94,23,235,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
    marginLeft: spacing.sm,
  },

  unitText: {
    ...typography.styles.label,
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});