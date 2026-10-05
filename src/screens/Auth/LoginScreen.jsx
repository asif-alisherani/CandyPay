// ============================================================
// CandyPay — Login Screen
// ============================================================

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';

import { ROUTES, VALIDATION, ASSETS } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
  shadows,
} from '../../theme';
import useAuth from '../../hooks/useAuth';
import {
  ScreenWrapper,
  GlassCard,
  PrimaryButton,
  TextButton,
  AppTextInput,
  PasswordInput,
} from '../../components';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────
const LoginScreen = ({ navigation }) => {
  const { handleLogin, isLoginLoading } = useAuth();

  // ─── Animations ───
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: animations.duration.slow,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(formAnim, {
          toValue: 1,
          duration: animations.duration.slow,
          useNativeDriver: true,
        }),
        Animated.spring(formSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          ...animations.spring.gentle,
        }),
      ]),
    ]).start();
  }, []);

  // ─── Form ───
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'asif@candypay.in',
      password: 'password123',
    },
  });

  const passwordRef = useRef(null);

  const onSubmit = async (data) => {
    await handleLogin(data);
  };

  return (
    <ScreenWrapper scrollable keyboardAware>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            {/* ── Logo Section ── */}
            <Animated.View
              style={[
                styles.logoSection,
                { opacity: logoAnim },
              ]}>
              {/* Glow behind logo */}
              <View style={styles.logoGlow} />

              {/* Logo Container */}
              <LinearGradient
                colors={gradients.primary.colors}
                start={gradients.primary.start}
                end={gradients.primary.end}
                style={styles.logoContainer}>
                <Icon
                  name="logo-bitcoin"
                  size={44}
                  color={colors.white}
                />
              </LinearGradient>

              <Text style={styles.appName}>CandyPay</Text>
              <Text style={styles.tagline}>
                Your USDT Wallet, Simplified
              </Text>
            </Animated.View>

            {/* ── Form Section ── */}
            <Animated.View
              style={[
                styles.formSection,
                {
                  opacity: formAnim,
                  transform: [{ translateY: formSlideAnim }],
                },
              ]}>
              <GlassCard style={styles.formCard}>
                {/* Header */}
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>
                  Login to your CandyPay account
                </Text>

                {/* Divider */}
                <View style={styles.titleDivider} />

                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  rules={VALIDATION.email}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      label="Email Address"
                      placeholder="you@example.com"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      leadingIcon="mail-outline"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        passwordRef.current?.focus()
                      }
                    />
                  )}
                />

                {/* Password */}
                <Controller
                  control={control}
                  name="password"
                  rules={VALIDATION.password}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      inputRef={passwordRef}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                />

                {/* Forgot Password — future */}
                <View style={styles.forgotRow}>
                  <TextButton
                    label="Forgot Password?"
                    onPress={() => {}}
                    color={colors.accent}
                    style={styles.forgotBtn}
                  />
                </View>

                {/* Login Button */}
                <PrimaryButton
                  label="Login"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoginLoading}
                  disabled={isLoginLoading}
                  icon="log-in-outline"
                  iconPosition="right"
                  style={styles.loginBtn}
                />
              </GlassCard>

              {/* Register Link */}
              <View style={styles.registerRow}>
                <Text style={styles.registerText}>
                  Don't have an account?
                </Text>
                <TextButton
                  label="Register"
                  onPress={() =>
                    navigation.navigate(ROUTES.REGISTER_STEP1)
                  }
                  color={colors.accent}
                />
              </View>

              {/* Test Credentials hint */}
              <GlassCard style={styles.hintCard}>
                <View style={styles.hintRow}>
                  <Icon
                    name="information-circle-outline"
                    size={16}
                    color={colors.accent}
                  />
                  <Text style={styles.hintText}>
                    Test: asif@candypay.in / password123
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xl,
  },

  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.glowPurple,
    top: spacing.xxl,
    alignSelf: 'center',
  },

  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.walletCard,
  },

  appName: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },

  tagline: {
    ...typography.styles.bodyMuted,
    fontSize: 14,
    textAlign: 'center',
  },

  // Form Section
  formSection: {
    paddingHorizontal: spacing.screenHorizontal,
  },

  formCard: {
    marginBottom: spacing.md,
  },

  formTitle: {
    ...typography.styles.screenTitle,
    fontSize: 22,
    marginBottom: spacing.xs,
  },

  formSubtitle: {
    ...typography.styles.bodyMuted,
    marginBottom: spacing.md,
  },

  titleDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },

  // Forgot
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
  },

  forgotBtn: {
    paddingVertical: spacing.xs,
  },

  // Login Button
  loginBtn: {
    marginTop: spacing.xs,
  },

  // Register Row
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  registerText: {
    ...typography.styles.bodyMuted,
    fontSize: 14,
  },

  // Hint card
  hintCard: {
    padding: spacing.md,
    borderColor: `${colors.accent}30`,
  },

  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  hintText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    flex: 1,
    marginLeft: spacing.xs,
  },
});

export default LoginScreen;