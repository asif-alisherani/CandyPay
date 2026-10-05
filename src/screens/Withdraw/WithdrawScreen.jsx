// ============================================================
// CandyPay — Withdraw Screen
// Balance, rate, amount input, bank selector, submit
// ============================================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';

import { ROUTES } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
} from '../../theme';
import { useWalletContext } from '../../context';
import {
  useWithdrawRequests,
  useSubmitWithdraw,
  useINRCalculator,
} from '../../hooks/useWallet';
import { useBankAccounts } from '../../hooks/useApp';
import { useSettings } from '../../hooks/useApp';
import {
  formatUSDT,
  formatINR,
  formatRate,
  maskAccountNumber,
  safeParseFloat,
} from '../../utils';

import {
  ScreenWrapper,
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  AmountInput,
  WithdrawCard,
  EmptyState,
  ListSkeleton,
  FadeInView,
  SuccessModal,
  SectionHeader,
  BankAccountCard,
  ConfirmationModal,
  WalletCardSkeleton,
} from '../../components';

// ─────────────────────────────────────────
// BALANCE MINI CARD
// ─────────────────────────────────────────
const BalanceMiniCard = ({ balance, rate }) => (
  <FadeInView style={balStyles.container}>
    <LinearGradient
      colors={gradients.walletCard.colors}
      start={gradients.walletCard.start}
      end={gradients.walletCard.end}
      style={balStyles.card}>
      <View style={balStyles.circle1} />
      <View style={balStyles.circle2} />

      <View style={balStyles.row}>
        <View style={balStyles.left}>
          <Text style={balStyles.label}>Available Balance</Text>
          <Text style={balStyles.amount}>
            {formatUSDT(balance, false)}
          </Text>
          <Text style={balStyles.currency}>USDT</Text>
        </View>
        <View style={balStyles.right}>
          <View style={balStyles.rateBadge}>
            <Icon
              name="trending-up-outline"
              size={12}
              color={colors.seafoam}
            />
            <Text style={balStyles.rateText}>
              {formatRate(rate)}
            </Text>
          </View>
          <Text style={balStyles.inrValue}>
            ≈ {formatINR(safeParseFloat(balance) * safeParseFloat(rate))}
          </Text>
        </View>
      </View>
    </LinearGradient>
  </FadeInView>
);

const balStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  card: {
    padding: spacing.cardPadding,
    overflow: 'hidden',
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -30,
    left: -20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {},
  right: {
    alignItems: 'flex-end',
  },
  label: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  amount: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 30,
    color: colors.white,
    letterSpacing: 0.3,
  },
  currency: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.badge,
    gap: 4,
    marginBottom: spacing.xs,
  },
  rateText: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    fontSize: 11,
  },
  inrValue: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 14,
    color: colors.seafoam,
  },
});

// ─────────────────────────────────────────
// BANK SELECTOR
// ─────────────────────────────────────────
const BankSelector = ({
  bankAccounts,
  selectedBank,
  onSelect,
  onAddNew,
  isLoading,
  navigation,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <View style={bankSelStyles.container}>
        <Text style={bankSelStyles.label}>Select Bank Account</Text>
        <View style={bankSelStyles.skeleton} />
      </View>
    );
  }

  if (bankAccounts.length === 0) {
    return (
      <View style={bankSelStyles.container}>
        <Text style={bankSelStyles.label}>Bank Account</Text>
        <GlassCard style={bankSelStyles.emptyCard}>
          <Icon
            name="business-outline"
            size={24}
            color={colors.textMuted}
          />
          <Text style={bankSelStyles.emptyText}>
            No bank accounts saved.
          </Text>
          <PrimaryButton
            label="Add Bank Account"
            onPress={onAddNew}
            icon="add-circle-outline"
            style={bankSelStyles.addBtn}
            fullWidth={false}
          />
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={bankSelStyles.container}>
      <View style={bankSelStyles.labelRow}>
        <Text style={bankSelStyles.label}>Bank Account</Text>
        <TouchableWithoutFeedback onPress={onAddNew}>
          <View style={bankSelStyles.addNewBtn}>
            <Icon name="add" size={14} color={colors.accent} />
            <Text style={bankSelStyles.addNewText}>Add New</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Selected Bank Display */}
      {selectedBank ? (
        <TouchableWithoutFeedback
          onPress={() => setExpanded(!expanded)}>
          <View style={bankSelStyles.selectedCard}>
            <LinearGradient
              colors={[
                'rgba(94,23,235,0.12)',
                'rgba(94,23,235,0.04)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={bankSelStyles.selectedGradient}>
              <View style={bankSelStyles.selectedInfo}>
                <View style={bankSelStyles.bankIconBox}>
                  <Icon
                    name="business-outline"
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <View style={bankSelStyles.bankTextBox}>
                  <Text style={bankSelStyles.bankName}>
                    {selectedBank.bank_name}
                  </Text>
                  <Text style={bankSelStyles.bankAccount}>
                    {maskAccountNumber(
                      selectedBank.account_number,
                    )}
                  </Text>
                </View>
              </View>
              <Icon
                name={
                  expanded
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={18}
                color={colors.accent}
              />
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => setExpanded(true)}>
          <View style={bankSelStyles.placeholder}>
            <Icon
              name="business-outline"
              size={18}
              color={colors.textMuted}
            />
            <Text style={bankSelStyles.placeholderText}>
              Choose a bank account
            </Text>
            <Icon
              name="chevron-down"
              size={18}
              color={colors.textMuted}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Expanded List */}
      {expanded && (
        <View style={bankSelStyles.bankList}>
          {bankAccounts.map((account) => (
            <BankAccountCard
              key={account.uuid}
              account={account}
              isSelected={selectedBank?.id === account.id}
              selectable
              onPress={(acc) => {
                onSelect(acc);
                setExpanded(false);
              }}
              style={bankSelStyles.bankCard}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const bankSelStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  label: {
    ...typography.styles.label,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addNewText: {
    ...typography.styles.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  skeleton: {
    height: 60,
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.styles.bodyMuted,
    fontSize: 14,
  },
  addBtn: {
    marginTop: spacing.xs,
  },
  selectedCard: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  selectedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  bankIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: `${colors.accent}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankTextBox: {},
  bankName: {
    ...typography.styles.label,
    color: colors.textPrimary,
    fontSize: 14,
  },
  bankAccount: {
    ...typography.styles.caption,
    color: colors.textMuted,
    fontFamily: 'SpaceGrotesk-Medium',
    letterSpacing: 1,
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  placeholderText: {
    ...typography.styles.body,
    color: colors.textDisabled,
    flex: 1,
    marginLeft: spacing.xs,
  },
  bankList: {
    marginTop: spacing.sm,
  },
  bankCard: {
    marginHorizontal: 0,
  },
});

// ─────────────────────────────────────────
// INR CALCULATOR DISPLAY
// ─────────────────────────────────────────
const INRCalculatorDisplay = ({ usdtAmount, rate }) => {
  const { inrAmount, isValid } = useINRCalculator(usdtAmount, rate);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isValid) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [inrAmount]);

  return (
    <Animated.View
      style={[
        calcStyles.container,
        { transform: [{ scale: scaleAnim }] },
      ]}>
      <LinearGradient
        colors={
          isValid
            ? ['rgba(0,196,159,0.12)', 'rgba(0,196,159,0.04)']
            : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={calcStyles.gradient}>
        <View style={calcStyles.left}>
          <Icon
            name="logo-usd"
            size={20}
            color={isValid ? colors.cryptoGreen : colors.textMuted}
          />
          <Text style={calcStyles.label}>You Receive</Text>
        </View>
        <View style={calcStyles.right}>
          <Text
            style={[
              calcStyles.amount,
              { color: isValid ? colors.cryptoGreen : colors.textMuted },
            ]}>
            {isValid ? formatINR(inrAmount) : '₹0.00'}
          </Text>
          <Text style={calcStyles.rateHint}>
            @ ₹{safeParseFloat(rate).toFixed(2)}/USDT
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const calcStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.cryptoGreen}20`,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.styles.label,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    letterSpacing: 0.3,
  },
  rateHint: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});

// ─────────────────────────────────────────
// WITHDRAW SCREEN
// ─────────────────────────────────────────
const WithdrawScreen = ({ navigation }) => {
  const { balance, isBalanceLoading, refreshBalance } = useWalletContext();
  const { usdtRate, minWithdraw, maxWithdraw } = useSettings();
  const { submitWithdraw, isSubmitting } = useSubmitWithdraw();
  const { bankAccounts, isLoading: banksLoading } = useBankAccounts();

  const [selectedBank, setSelectedBank] = useState(null);
  const [bankError, setBankError] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [usdtValue, setUsdtValue] = useState('');

  const {
    withdrawals,
    isLoading: withdrawLoading,
    refetch,
  } = useWithdrawRequests('all');

  // ─── Pull to Refresh ───
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshBalance(), refetch()]);
    setRefreshing(false);
  }, []);

  // ─── Form ───
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { withdraw_usdt: '' },
  });

  const watchedAmount = watch('withdraw_usdt');

  // ─── Submit Handler ───
  const onSubmit = (data) => {
    // Validate bank
    if (!selectedBank) {
      setBankError('Please select a bank account.');
      return;
    }
    setBankError(null);

    setPendingData({
      withdraw_usdt: parseFloat(data.withdraw_usdt),
      bank_account_id: selectedBank.id,
      withdraw_rate: usdtRate,
    });
    setConfirmVisible(true);
  };

  const onConfirm = async () => {
    setConfirmVisible(false);
    const result = await submitWithdraw(pendingData, () => {
      reset();
      setSelectedBank(null);
      setUsdtValue('');
      setSuccessVisible(true);
    });
  };

  const goToDetail = (withdrawal) =>
    navigation.navigate(ROUTES.WITHDRAW_DETAIL, {
      uuid: withdrawal.uuid,
    });

  const goToAddBank = () =>
    navigation.navigate(ROUTES.ADD_BANK_ACCOUNT);

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.backgroundSecondary}
          />
        }>

        {/* ── Title ── */}
        <FadeInView style={styles.titleRow}>
          <Text style={styles.screenTitle}>Withdraw</Text>
          <View style={styles.titleBadge}>
            <Icon
              name="arrow-up-circle-outline"
              size={14}
              color={colors.statusRejected}
            />
            <Text style={styles.titleBadgeText}>Send</Text>
          </View>
        </FadeInView>

        {/* ── Balance Card ── */}
        <FadeInView delay={80}>
          {isBalanceLoading ? (
            <WalletCardSkeleton />
          ) : (
            <BalanceMiniCard
              balance={balance}
              rate={usdtRate}
            />
          )}
        </FadeInView>

        {/* ── Withdraw Form Card ── */}
        <FadeInView delay={130}>
          <GlassCard
            style={[
              styles.formCard,
              { marginHorizontal: spacing.screenHorizontal },
            ]}>
            {/* Header */}
            <View style={styles.formHeader}>
              <LinearGradient
                colors={gradients.danger.colors}
                start={gradients.danger.start}
                end={gradients.danger.end}
                style={styles.formHeaderIcon}>
                <Icon
                  name="arrow-up-circle-outline"
                  size={18}
                  color={colors.white}
                />
              </LinearGradient>
              <Text style={styles.formTitle}>
                Withdraw USDT
              </Text>
            </View>

            <View style={styles.formDivider} />

            {/* USDT Amount */}
            <Controller
              control={control}
              name="withdraw_usdt"
              rules={{
                required: 'Amount is required.',
                validate: (val) => {
                  const num = parseFloat(val);
                  if (isNaN(num)) return 'Enter a valid amount.';
                  if (num < minWithdraw)
                    return `Minimum withdrawal is ${minWithdraw} USDT.`;
                  if (num > maxWithdraw)
                    return `Maximum withdrawal is ${maxWithdraw} USDT.`;
                  if (num > parseFloat(balance))
                    return 'Insufficient balance.';
                  return true;
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AmountInput
                  label="USDT Amount"
                  placeholder="Enter amount to withdraw"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setUsdtValue(text);
                  }}
                  onBlur={onBlur}
                  error={errors.withdraw_usdt?.message}
                  helperText={`Min: ${minWithdraw} — Max: ${maxWithdraw} USDT`}
                />
              )}
            />

            {/* INR Calculator */}
            <INRCalculatorDisplay
              usdtAmount={watchedAmount}
              rate={usdtRate}
            />

            {/* Bank Selector */}
            <BankSelector
              bankAccounts={bankAccounts}
              selectedBank={selectedBank}
              onSelect={(bank) => {
                setSelectedBank(bank);
                setBankError(null);
              }}
              onAddNew={goToAddBank}
              isLoading={banksLoading}
              navigation={navigation}
            />

            {/* Bank Error */}
            {bankError ? (
              <View style={styles.bankErrorRow}>
                <Icon
                  name="alert-circle-outline"
                  size={13}
                  color={colors.statusRejected}
                />
                <Text style={styles.bankErrorText}>{bankError}</Text>
              </View>
            ) : null}

            {/* Submit */}
            <PrimaryButton
              label="Request Withdrawal"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              icon="arrow-up-circle-outline"
              iconPosition="right"
              gradient={gradients.danger}
              style={styles.submitBtn}
            />

            {/* Note */}
            <View style={styles.noteRow}>
              <Icon
                name="information-circle-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={styles.noteText}>
                INR will be transferred to your bank account
                within 24 hours of admin approval.
              </Text>
            </View>
          </GlassCard>
        </FadeInView>

        {/* ── Recent Withdrawals ── */}
        <FadeInView delay={200}>
          <SectionHeader
            title="Recent Withdrawals"
            style={styles.sectionHeader}
          />

          {withdrawLoading ? (
            <ListSkeleton count={3} />
          ) : withdrawals.length === 0 ? (
            <EmptyState
              title="No Withdrawals Yet"
              description="Your withdrawal requests will appear here."
              style={styles.emptyState}
            />
          ) : (
            withdrawals.map((w) => (
              <WithdrawCard
                key={w.uuid}
                withdrawal={w}
                onPress={goToDetail}
              />
            ))
          )}
        </FadeInView>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={onConfirm}
        title="Confirm Withdrawal"
        message={
          pendingData
            ? `Withdraw ${formatUSDT(pendingData.withdraw_usdt)} and receive approximately ${formatINR(
                pendingData.withdraw_usdt * pendingData.withdraw_rate,
              )} to your bank account?`
            : ''
        }
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        isLoading={isSubmitting}
        icon="arrow-up-circle-outline"
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        title="Withdrawal Submitted!"
        message="Your withdrawal request has been submitted. Admin will transfer INR to your bank account shortly."
        actionLabel="Done"
        onAction={() => {
          setSuccessVisible(false);
          refetch();
        }}
      />
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
    paddingTop: spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  screenTitle: {
    ...typography.styles.screenTitle,
  },

  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.statusRejected}15`,
    borderWidth: 1,
    borderColor: `${colors.statusRejected}30`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
    gap: spacing.xs,
  },

  titleBadgeText: {
    ...typography.styles.caption,
    color: colors.statusRejected,
    fontWeight: '600',
    marginLeft: 3,
  },

  formCard: {
    marginBottom: spacing.md,
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  formHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  formTitle: {
    ...typography.styles.cardTitle,
    fontSize: 16,
    marginLeft: spacing.xs,
  },

  formDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },

  bankErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    gap: 4,
  },

  bankErrorText: {
    ...typography.styles.caption,
    color: colors.statusRejected,
    flex: 1,
    marginLeft: 2,
  },

  submitBtn: {
    marginBottom: spacing.md,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },

  noteText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 16,
    marginLeft: 4,
  },

  sectionHeader: {
    marginTop: spacing.sm,
  },

  emptyState: {
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.screenHorizontal,
  },
});

export default WithdrawScreen;