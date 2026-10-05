// ============================================================
// CandyPay — Register Step 1
// Email, Password, Referral Code
// ============================================================

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';

import { ROUTES, VALIDATION } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
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

// ─────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────
const StepIndicator = ({ currentStep = 1, totalSteps = 2 }) => (
  <View style={stepStyles.container}>
    {Array.from({ length: totalSteps }).map((_, index) => {
      const step = index + 1;
      const isActive = step === currentStep;
      const isCompleted = step < currentStep;

      return (
        <React.Fragment key={step}>
          {/* Step Circle */}
          <View style={stepStyles.stepWrapper}>
            {isActive || isCompleted ? (
              <LinearGradient
                colors={gradients.primary.colors}
                start={gradients.primary.start}
                end={gradients.primary.end}
                style={stepStyles.stepCircle}>
                {isCompleted ? (
                  <Icon name="checkmark" size={14} color={colors.white} />
                ) : (
                  <Text style={stepStyles.stepNumber}>{step}</Text>
                )}
              </LinearGradient>
            ) : (
              <View style={stepStyles.stepCircleInactive}>
                <Text style={stepStyles.stepNumberInactive}>{step}</Text>
              </View>
            )}
            <Text
              style={[
                stepStyles.stepLabel,
                isActive && stepStyles.stepLabelActive,
              ]}>
              {step === 1 ? 'Account' : 'Profile'}
            </Text>
          </View>

          {/* Connector */}
          {index < totalSteps - 1 && (
            <View style={stepStyles.connector}>
              <View
                style={[
                  stepStyles.connectorLine,
                  isCompleted && stepStyles.connectorLineActive,
                ]}
              />
            </View>
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  stepWrapper: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepCircleInactive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  stepNumber: {
    ...typography.styles.label,
    color: colors.white,
    fontWeight: '700',
  },
  stepNumberInactive: {
    ...typography.styles.label,
    color: colors.textMuted,
    fontWeight: '700',
  },
  stepLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  stepLabelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  connector: {
    flex: 1,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  connectorLine: {
    height: 1,
    backgroundColor: colors.border,
  },
  connectorLineActive: {
    backgroundColor: colors.primary,
  },
});

// ─────────────────────────────────────────
// REGISTER STEP 1 SCREEN
// ─────────────────────────────────────────
const RegisterStep1Screen = ({ navigation }) => {
  const { handleValidateReferral, isReferralLoading } = useAuth();

  // ─── Animations ───
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.duration.slow,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        ...animations.spring.gentle,
      }),
    ]).start();
  }, []);

  // ─── Form ───
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      referral_code: 'ASIF7X9K',
    },
  });

  const passwordRef = useRef(null);
  const referralRef = useRef(null);

  const onNext = async (data) => {
    // Validate referral code
    const result = await handleValidateReferral(data.referral_code);

    if (result.success) {
      navigation.navigate(ROUTES.REGISTER_STEP2, {
        email: data.email,
        password: data.password,
        referral_code: data.referral_code.trim().toUpperCase(),
      });
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAware>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* ── Header ── */}
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim },
            ]}>
            {/* Back */}
            <TouchableWithoutFeedback
              onPress={() => navigation.goBack()}>
              <View style={styles.backButton}>
                <Icon
                  name="arrow-back"
                  size={22}
                  color={colors.textPrimary}
                />
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.headerText}>
              <Text style={styles.screenTitle}>Create Account</Text>
              <Text style={styles.screenSubtitle}>
                Join CandyPay today
              </Text>
            </View>
          </Animated.View>

          {/* ── Step Indicator ── */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <StepIndicator currentStep={1} totalSteps={2} />
          </Animated.View>

          {/* ── Form ── */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            <GlassCard style={styles.formCard}>
              {/* Section Label */}
              <View style={styles.sectionLabelRow}>
                <LinearGradient
                  colors={gradients.primary.colors}
                  start={gradients.primary.start}
                  end={gradients.primary.end}
                  style={styles.sectionIcon}>
                  <Icon
                    name="shield-checkmark-outline"
                    size={16}
                    color={colors.white}
                  />
                </LinearGradient>
                <Text style={styles.sectionLabel}>
                  Account Credentials
                </Text>
              </View>

              <View style={styles.sectionDivider} />

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
                    placeholder="Min. 6 characters"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    inputRef={passwordRef}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      referralRef.current?.focus()
                    }
                  />
                )}
              />

              {/* Referral Code */}
              <Controller
                control={control}
                name="referral_code"
                rules={VALIDATION.referralCode}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Referral Code"
                    placeholder="Enter referral code"
                    value={value}
                    onChangeText={(text) =>
                      onChange(text.toUpperCase())
                    }
                    onBlur={onBlur}
                    error={errors.referral_code?.message}
                    leadingIcon="people-outline"
                    autoCapitalize="characters"
                    returnKeyType="done"
                    inputRef={referralRef}
                    onSubmitEditing={handleSubmit(onNext)}
                    helperText="Ask your referrer for their code"
                  />
                )}
              />

              {/* Referral note */}
              <View style={styles.referralNote}>
                <Icon
                  name="gift-outline"
                  size={14}
                  color={colors.cryptoGreen}
                />
                <Text style={styles.referralNoteText}>
                  Use code{' '}
                  <Text style={styles.referralCode}>ASIF7X9K</Text>
                  {' '}to get started
                </Text>
              </View>

              {/* Next Button */}
              <PrimaryButton
                label="Next Step"
                onPress={handleSubmit(onNext)}
                loading={isReferralLoading}
                disabled={isReferralLoading}
                icon="arrow-forward-outline"
                iconPosition="right"
                style={styles.nextBtn}
              />
            </GlassCard>

            {/* Login Link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>
                Already have an account?
              </Text>
              <TextButton
                label="Login"
                onPress={() => navigation.navigate(ROUTES.LOGIN)}
                color={colors.accent}
              />
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
  },

  screenTitle: {
    ...typography.styles.screenTitle,
    fontSize: 22,
  },

  screenSubtitle: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    marginTop: 2,
  },

  // Form
  formContainer: {
    paddingHorizontal: spacing.screenHorizontal,
  },

  formCard: {
    marginBottom: spacing.md,
  },

  // Section label
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionLabel: {
    ...typography.styles.label,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },

  // Referral note
  referralNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,196,159,0.08)',
    borderRadius: radius.xs,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0,196,159,0.2)',
  },

  referralNoteText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    flex: 1,
    marginLeft: spacing.xs,
  },

  referralCode: {
    color: colors.cryptoGreen,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk-Bold',
  },

  nextBtn: {
    marginTop: spacing.xs,
  },

  // Login row
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },

  loginText: {
    ...typography.styles.bodyMuted,
    fontSize: 14,
  },
});

export default RegisterStep1Screen;