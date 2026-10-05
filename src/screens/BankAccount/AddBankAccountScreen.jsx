// ============================================================
// CandyPay — Add / Edit Bank Account Screen
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';

import { VALIDATION } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
} from '../../theme';
import {
  useAddBankAccount,
  useUpdateBankAccount,
} from '../../hooks/useApp';

import {
  ScreenWrapper,
  AppHeader,
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  AppTextInput,
  LoadingOverlay,
} from '../../components';

// ─────────────────────────────────────────
// ADD / EDIT BANK ACCOUNT SCREEN
// ─────────────────────────────────────────
const AddBankAccountScreen = ({ navigation, route }) => {
  const isEdit = route.params?.isEdit ?? false;
  const existingAccount = route.params?.account ?? null;

  const { addBankAccount, isAdding } = useAddBankAccount();
  const { updateBankAccount, isUpdating } = useUpdateBankAccount();

  const isLoading = isAdding || isUpdating;

  // ─── Animation ───
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).default;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.duration.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── Form ───
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      account_holder_name: existingAccount?.account_holder_name ?? '',
      bank_name: existingAccount?.bank_name ?? '',
      account_number: existingAccount?.account_number ?? '',
      ifsc_code: existingAccount?.ifsc_code ?? '',
      upi_id: existingAccount?.upi_id ?? '',
    },
  });

  // ─── Refs for field chaining ───
  const bankNameRef = useRef(null);
  const accountNumberRef = useRef(null);
  const ifscRef = useRef(null);
  const upiRef = useRef(null);

  // ─── Submit ───
  const onSubmit = async (data) => {
    if (isEdit && existingAccount) {
      await updateBankAccount(
        existingAccount.id,
        data,
        () => navigation.goBack(),
      );
    } else {
      await addBankAccount(data, () => navigation.goBack());
    }
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <AppHeader
        title={isEdit ? 'Edit Bank Account' : 'Add Bank Account'}
        navigation={navigation}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <Animated.View style={{ opacity: fadeAnim }}>

            {/* ── Info Card ── */}
            <GlassCard style={styles.infoCard}>
              <View style={styles.infoRow}>
                <LinearGradient
                  colors={gradients.primary.colors}
                  start={gradients.primary.start}
                  end={gradients.primary.end}
                  style={styles.infoIcon}>
                  <Icon
                    name="shield-checkmark-outline"
                    size={18}
                    color={colors.white}
                  />
                </LinearGradient>
                <View style={styles.infoText}>
                  <Text style={styles.infoTitle}>
                    Bank Account Security
                  </Text>
                  <Text style={styles.infoDesc}>
                    Your bank details are securely stored and only
                    used for USDT withdrawals.
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* ── Form Card ── */}
            <GlassCard style={styles.formCard}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={gradients.primary.colors}
                  start={gradients.primary.start}
                  end={gradients.primary.end}
                  style={styles.sectionIcon}>
                  <Icon
                    name="business-outline"
                    size={16}
                    color={colors.white}
                  />
                </LinearGradient>
                <Text style={styles.sectionTitle}>
                  Bank Details
                </Text>
              </View>

              <View style={styles.sectionDivider} />

              {/* Account Holder Name */}
              <Controller
                control={control}
                name="account_holder_name"
                rules={VALIDATION.bankAccountHolder}
                render={({
                  field: { onChange, onBlur, value },
                }) => (
                  <AppTextInput
                    label="Account Holder Name"
                    placeholder="Name as per bank records"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.account_holder_name?.message}
                    leadingIcon="person-outline"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      bankNameRef.current?.focus()
                    }
                  />
                )}
              />

              {/* Bank Name */}
              <Controller
                control={control}
                name="bank_name"
                rules={VALIDATION.bankName}
                render={({
                  field: { onChange, onBlur, value },
                }) => (
                  <AppTextInput
                    label="Bank Name"
                    placeholder="e.g. State Bank of India"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.bank_name?.message}
                    leadingIcon="business-outline"
                    autoCapitalize="words"
                    inputRef={bankNameRef}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      accountNumberRef.current?.focus()
                    }
                  />
                )}
              />

              {/* Account Number */}
              <Controller
                control={control}
                name="account_number"
                rules={VALIDATION.accountNumber}
                render={({
                  field: { onChange, onBlur, value },
                }) => (
                  <AppTextInput
                    label="Account Number"
                    placeholder="Enter account number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.account_number?.message}
                    leadingIcon="card-outline"
                    keyboardType="number-pad"
                    inputRef={accountNumberRef}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      ifscRef.current?.focus()
                    }
                    helperText="9 to 18 digit account number"
                  />
                )}
              />

              {/* IFSC Code */}
              <Controller
                control={control}
                name="ifsc_code"
                rules={VALIDATION.ifscCode}
                render={({
                  field: { onChange, onBlur, value },
                }) => (
                  <AppTextInput
                    label="IFSC Code"
                    placeholder="e.g. SBIN0001234"
                    value={value}
                    onChangeText={(text) =>
                      onChange(text.toUpperCase())
                    }
                    onBlur={onBlur}
                    error={errors.ifsc_code?.message}
                    leadingIcon="code-outline"
                    autoCapitalize="characters"
                    maxLength={11}
                    inputRef={ifscRef}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      upiRef.current?.focus()
                    }
                    helperText="11 character IFSC code"
                  />
                )}
              />

              {/* UPI ID (Optional) */}
              <Controller
                control={control}
                name="upi_id"
                render={({
                  field: { onChange, onBlur, value },
                }) => (
                  <AppTextInput
                    label="UPI ID (Optional)"
                    placeholder="e.g. name@upi"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leadingIcon="phone-portrait-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    inputRef={upiRef}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    helperText="Optional — for faster transfers"
                  />
                )}
              />

              {/* Submit */}
              <PrimaryButton
                label={
                  isEdit
                    ? 'Update Bank Account'
                    : 'Save Bank Account'
                }
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
                icon={isEdit ? 'checkmark-circle-outline' : 'save-outline'}
                iconPosition="right"
                style={styles.submitBtn}
              />
            </GlassCard>

            {/* Cancel */}
            <SecondaryButton
              label="Cancel"
              onPress={() => navigation.goBack()}
              icon="close-outline"
              style={styles.cancelBtn}
            />
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={isLoading}
        message={
          isEdit
            ? 'Updating account...'
            : 'Saving account...'
        }
      />
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
  },

  // Info Card
  infoCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    flex: 1,
  },

  infoTitle: {
    ...typography.styles.label,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  infoDesc: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    lineHeight: 18,
  },

  // Form Card
  formCard: {
    marginBottom: spacing.md,
  },

  sectionHeader: {
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

  sectionTitle: {
    ...typography.styles.cardTitle,
    fontSize: 15,
    marginLeft: spacing.xs,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },

  submitBtn: {
    marginTop: spacing.xs,
  },

  cancelBtn: {
    marginBottom: spacing.md,
  },
});

export default AddBankAccountScreen;