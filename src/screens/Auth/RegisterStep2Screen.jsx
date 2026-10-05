// ============================================================
// CandyPay — Register Step 2
// Name, Mobile, Create Account
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
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
  SecondaryButton,
  AppTextInput,
  LoadingOverlay,
} from '../../components';

// ─────────────────────────────────────────
// STEP INDICATOR (reused from Step 1)
// ─────────────────────────────────────────
const StepIndicator = ({ currentStep = 2, totalSteps = 2 }) => (
  <View style={stepStyles.container}>
    {Array.from({ length: totalSteps }).map((_, index) => {
      const step = index + 1;
      const isActive = step === currentStep;
      const isCompleted = step < currentStep;

      return (
        <React.Fragment key={step}>
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
  stepWrapper: { alignItems: 'center' },
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
// REGISTER STEP 2 SCREEN
// ─────────────────────────────────────────
const RegisterStep2Screen = ({ navigation, route }) => {
  const { email, password, referral_code } = route.params ?? {};
  const { handleRegister, isRegisterLoading } = useAuth();

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
  } = useForm({
    defaultValues: {
      name: '',
      mobile: '',
    },
  });

  const mobileRef = useRef(null);

  const onSubmit = async (data) => {
    await handleRegister({
      email,
      password,
      referral_code,
      name: data.name,
      mobile: data.mobile,
    });
    // NO navigation.replace here
    // AuthContext handles navigation automatically
  };

  return (
    <ScreenWrapper scrollable keyboardAware>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          {/* ── Header ── */}
          <Animated.View
            style={[styles.header, { opacity: fadeAnim }]}>
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
              <Text style={styles.screenTitle}>Your Profile</Text>
              <Text style={styles.screenSubtitle}>
                Almost there!
              </Text>
            </View>
          </Animated.View>

          {/* ── Step Indicator ── */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <StepIndicator currentStep={2} totalSteps={2} />
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

            {/* Account Summary Card */}
            <GlassCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Icon
                  name="mail-outline"
                  size={16}
                  color={colors.accent}
                />
                <Text style={styles.summaryLabel}>Email</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {email}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Icon
                  name="people-outline"
                  size={16}
                  color={colors.cryptoGreen}
                />
                <Text style={styles.summaryLabel}>Referral</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.cryptoGreen },
                  ]}>
                  {referral_code}
                </Text>
              </View>
            </GlassCard>

            {/* Profile Form */}
            <GlassCard style={styles.formCard}>
              {/* Section Label */}
              <View style={styles.sectionLabelRow}>
                <LinearGradient
                  colors={gradients.secondary.colors}
                  start={gradients.secondary.start}
                  end={gradients.secondary.end}
                  style={styles.sectionIcon}>
                  <Icon
                    name="person-outline"
                    size={16}
                    color={colors.white}
                  />
                </LinearGradient>
                <Text style={styles.sectionLabel}>
                  Personal Information
                </Text>
              </View>

              <View style={styles.sectionDivider} />

              {/* Full Name */}
              <Controller
                control={control}
                name="name"
                rules={VALIDATION.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    leadingIcon="person-outline"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      mobileRef.current?.focus()
                    }
                  />
                )}
              />

              {/* Mobile */}
              <Controller
                control={control}
                name="mobile"
                rules={VALIDATION.mobile}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.mobile?.message}
                    leadingIcon="call-outline"
                    keyboardType="phone-pad"
                    maxLength={10}
                    returnKeyType="done"
                    inputRef={mobileRef}
                    onSubmitEditing={handleSubmit(onSubmit)}
                    helperText="Indian mobile number (starts with 6-9)"
                  />
                )}
              />

              {/* Signup Bonus Note */}
              <View style={styles.bonusNote}>
                <LinearGradient
                  colors={gradients.success.colors}
                  start={gradients.success.start}
                  end={gradients.success.end}
                  style={styles.bonusIconBox}>
                  <Icon
                    name="gift-outline"
                    size={16}
                    color={colors.white}
                  />
                </LinearGradient>
                <View style={styles.bonusText}>
                  <Text style={styles.bonusTitle}>
                    🎉 Welcome Bonus
                  </Text>
                  <Text style={styles.bonusDesc}>
                    You'll receive 1.00 USDT as signup bonus!
                  </Text>
                </View>
              </View>

              {/* Create Account */}
              <PrimaryButton
                label="Create Account"
                onPress={handleSubmit(onSubmit)}
                loading={isRegisterLoading}
                disabled={isRegisterLoading}
                icon="checkmark-circle-outline"
                iconPosition="right"
                style={styles.createBtn}
              />
            </GlassCard>

            {/* Back */}
            <SecondaryButton
              label="Back to Step 1"
              onPress={() => navigation.goBack()}
              icon="arrow-back-outline"
              style={styles.backBtn}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={isRegisterLoading}
        message="Creating your account..."
      />
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

  headerText: { flex: 1 },

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

  // Summary Card
  summaryCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },

  summaryLabel: {
    ...typography.styles.label,
    color: colors.textMuted,
    fontSize: 13,
    width: 70,
    marginLeft: spacing.xs,
  },

  summaryValue: {
    ...typography.styles.label,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },

  // Form Card
  formCard: {
    marginBottom: spacing.md,
  },

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

  // Bonus Note
  bonusNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,196,159,0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,196,159,0.2)',
    gap: spacing.md,
  },

  bonusIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bonusText: {
    flex: 1,
  },

  bonusTitle: {
    ...typography.styles.label,
    color: colors.cryptoGreen,
    marginBottom: 2,
  },

  bonusDesc: {
    ...typography.styles.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },

  // Buttons
  createBtn: {
    marginTop: spacing.xs,
  },

  backBtn: {
    marginBottom: spacing.md,
  },
});

export default RegisterStep2Screen;