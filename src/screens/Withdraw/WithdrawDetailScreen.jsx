// ============================================================
// CandyPay — Withdraw Detail Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
} from '../../theme';
import {
  formatUSDT,
  formatINR,
  formatDateTime,
  maskAccountNumber,
} from '../../utils';
import { useWithdrawDetail } from '../../hooks/useWallet';
import { useClipboard } from '../../hooks/useApp';
import { bankService } from '../../services';

import {
  ScreenWrapper,
  AppHeader,
  GlassCard,
  StatusBadge,
  FadeInView,
  CardSkeleton,
  PrimaryButton,
} from '../../components';

// ─────────────────────────────────────────
// WITHDRAW DETAIL SCREEN
// ─────────────────────────────────────────
const WithdrawDetailScreen = ({ navigation, route }) => {
  const { uuid } = route.params ?? {};
  const { withdrawal, isLoading } = useWithdrawDetail(uuid);
  const { copy } = useClipboard();

  const [bankAccount, setBankAccount] = React.useState(null);

  React.useEffect(() => {
    if (withdrawal?.bank_account_id) {
      bankService
        .getBankAccountById(withdrawal.bank_account_id)
        .then((res) => {
          if (res.success) setBankAccount(res.data);
        });
    }
  }, [withdrawal]);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Withdraw Detail" navigation={navigation} />
        <CardSkeleton height={200} style={{ margin: spacing.md }} />
        <CardSkeleton height={300} style={{ margin: spacing.md }} />
      </ScreenWrapper>
    );
  }

  if (!withdrawal) {
    return (
      <ScreenWrapper>
        <AppHeader title="Withdraw Detail" navigation={navigation} />
        <View style={styles.errorContainer}>
          <Icon
            name="alert-circle-outline"
            size={48}
            color={colors.textMuted}
          />
          <Text style={styles.errorText}>
            Withdrawal not found.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  const {
    withdraw_usdt,
    withdraw_rate,
    withdraw_inr,
    status,
    admin_remark,
    transaction_reference,
    created_at,
    updated_at,
    uuid: withdrawUUID,
  } = withdrawal;

  const statusConfig = {
    pending: {
      icon: 'time-outline',
      color: colors.statusPending,
      message: 'Your withdrawal request is pending admin review.',
      gradient: ['rgba(255,184,48,0.15)', 'rgba(255,184,48,0.05)'],
    },
    approved: {
      icon: 'checkmark-circle-outline',
      color: colors.statusApproved,
      message: 'Your withdrawal has been processed successfully.',
      gradient: ['rgba(0,196,159,0.15)', 'rgba(0,196,159,0.05)'],
    },
    rejected: {
      icon: 'close-circle-outline',
      color: colors.statusRejected,
      message: 'Your withdrawal was rejected. See admin remark.',
      gradient: ['rgba(255,76,76,0.15)', 'rgba(255,76,76,0.05)'],
    },
  };

  const sc = statusConfig[status] ?? statusConfig.pending;

  return (
    <ScreenWrapper scrollable>
      <AppHeader title="Withdraw Detail" navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Status Hero ── */}
        <FadeInView>
          <LinearGradient
            colors={sc.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusHero}>

            <View
              style={[
                styles.statusIconBox,
                { backgroundColor: `${sc.color}20` },
              ]}>
              <Icon name={sc.icon} size={40} color={sc.color} />
            </View>

            <Text style={styles.heroLabel}>Withdrawal Amount</Text>

            <Text
              style={[
                styles.heroAmount,
                { color: colors.statusRejected },
              ]}>
              -{formatUSDT(withdraw_usdt, false)}
            </Text>
            <Text style={styles.heroCurrency}>USDT</Text>

            {/* INR */}
            <View style={styles.inrRow}>
              <Icon
                name="trending-up-outline"
                size={14}
                color={colors.seafoam}
              />
              <Text style={styles.inrText}>
                {formatINR(withdraw_inr)} @ ₹
                {parseFloat(withdraw_rate).toFixed(2)}/USDT
              </Text>
            </View>

            <StatusBadge
              status={status}
              size="large"
              style={styles.heroBadge}
            />
          </LinearGradient>
        </FadeInView>

        {/* ── Status Message ── */}
        <FadeInView delay={80}>
          <GlassCard
            style={[
              styles.messageCard,
              { borderColor: `${sc.color}25` },
            ]}>
            <View style={styles.messageRow}>
              <Icon name={sc.icon} size={18} color={sc.color} />
              <Text
                style={[
                  styles.messageText,
                  { color: sc.color },
                ]}>
                {sc.message}
              </Text>
            </View>

            {/* Transaction Reference (approved) */}
            {status === 'approved' && transaction_reference ? (
              <View style={styles.refBox}>
                <Text style={styles.refLabel}>
                  Transaction Reference:
                </Text>
                <TouchableWithoutFeedback
                  onPress={() =>
                    copy(
                      transaction_reference,
                      'Transaction Reference',
                    )
                  }>
                  <View style={styles.refValueRow}>
                    <Text style={styles.refValue}>
                      {transaction_reference}
                    </Text>
                    <Icon
                      name="copy-outline"
                      size={14}
                      color={colors.accent}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : null}

            {/* Admin Remark */}
            {admin_remark ? (
              <View style={styles.remarkBox}>
                <Text style={styles.remarkLabel}>
                  Admin Remark:
                </Text>
                <Text style={styles.remarkText}>
                  {admin_remark}
                </Text>
              </View>
            ) : null}
          </GlassCard>
        </FadeInView>

        {/* ── Withdrawal Details ── */}
        <FadeInView delay={120}>
          <GlassCard style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>
              Withdrawal Details
            </Text>

            {/* Reference */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference ID</Text>
              <View style={styles.detailValueRow}>
                <Text style={styles.detailValue} numberOfLines={1}>
                  #{withdrawal.id}
                </Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            {/* USDT */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>USDT Amount</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: colors.statusRejected },
                ]}>
                -{formatUSDT(withdraw_usdt)}
              </Text>
            </View>

            <View style={styles.detailDivider} />

            {/* Rate */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rate Applied</Text>
              <Text style={styles.detailValue}>
                ₹{parseFloat(withdraw_rate).toFixed(2)}/USDT
              </Text>
            </View>

            <View style={styles.detailDivider} />

            {/* INR */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>INR Amount</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: colors.cryptoGreen },
                ]}>
                {formatINR(withdraw_inr)}
              </Text>
            </View>

            <View style={styles.detailDivider} />

            {/* Status */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <StatusBadge status={status} size="medium" />
            </View>

            <View style={styles.detailDivider} />

            {/* Date */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(created_at)}
              </Text>
            </View>

            {updated_at !== created_at && (
              <>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Last Updated
                  </Text>
                  <Text style={styles.detailValue}>
                    {formatDateTime(updated_at)}
                  </Text>
                </View>
              </>
            )}
          </GlassCard>
        </FadeInView>

        {/* ── Bank Account ── */}
        {bankAccount ? (
          <FadeInView delay={160}>
            <GlassCard style={styles.bankCard}>
              <Text style={styles.detailCardTitle}>
                Bank Account
              </Text>

              <View style={styles.bankRow}>
                <View style={styles.bankIconBox}>
                  <Icon
                    name="business-outline"
                    size={22}
                    color={colors.accent}
                  />
                </View>
                <View style={styles.bankInfo}>
                  <Text style={styles.bankName}>
                    {bankAccount.bank_name}
                  </Text>
                  <Text style={styles.bankHolder}>
                    {bankAccount.account_holder_name}
                  </Text>
                  <Text style={styles.bankAccount}>
                    {maskAccountNumber(bankAccount.account_number)}
                  </Text>
                  <Text style={styles.bankIfsc}>
                    IFSC: {bankAccount.ifsc_code}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </FadeInView>
        ) : null}

        {/* Back Button */}
        <FadeInView delay={200} style={styles.backBtnContainer}>
          <PrimaryButton
            label="Go Back"
            onPress={() => navigation.goBack()}
            icon="arrow-back-outline"
          />
        </FadeInView>
      </ScrollView>
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  statusHero: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderCard,
  },

  statusIconBox: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  heroLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },

  heroAmount: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 40,
    letterSpacing: 0.5,
    lineHeight: 48,
  },

  heroCurrency: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  inrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  inrText: {
    ...typography.styles.caption,
    color: colors.seafoam,
    marginLeft: 4,
  },

  heroBadge: {
    marginTop: spacing.xs,
  },

  messageCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    padding: spacing.md,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },

  messageText: {
    ...typography.styles.body,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
    marginLeft: spacing.xs,
  },

  refBox: {
    marginTop: spacing.md,
    backgroundColor: colors.backgroundInput,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.statusApproved,
  },

  refLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  refValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  refValue: {
    ...typography.styles.body,
    color: colors.statusApproved,
    fontFamily: 'SpaceGrotesk-Medium',
  },

  remarkBox: {
    marginTop: spacing.md,
    backgroundColor: colors.backgroundInput,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.statusRejected,
  },

  remarkLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  remarkText: {
    ...typography.styles.body,
    fontSize: 14,
    color: colors.textSecondary,
  },

  detailCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  detailCardTitle: {
    ...typography.styles.sectionTitle,
    marginBottom: spacing.md,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },

  detailLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.3,
    flex: 1,
  },

  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  detailValue: {
    ...typography.styles.body,
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'right',
  },

  detailDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },

  // Bank Card
  bankCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  bankIconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bankInfo: {
    flex: 1,
  },

  bankName: {
    ...typography.styles.label,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 2,
  },

  bankHolder: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    marginBottom: 3,
  },

  bankAccount: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },

  bankIfsc: {
    ...typography.styles.caption,
    color: colors.textDisabled,
    fontSize: 11,
  },

  backBtnContainer: {
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: spacing.sm,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },

  errorText: {
    ...typography.styles.bodyMuted,
    textAlign: 'center',
  },
});

export default WithdrawDetailScreen;