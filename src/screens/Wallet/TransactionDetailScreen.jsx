// ============================================================
// CandyPay — Transaction Detail Screen
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
  shadows,
} from '../../theme';
import { TRANSACTION_CONFIG, ICONS } from '../../constants';
import {
  formatUSDT,
  formatINR,
  formatDateTime,
  truncateHash,
} from '../../utils';
import { useTransactionDetail } from '../../hooks/useWallet';
import { useClipboard } from '../../hooks/useApp';

import {
  ScreenWrapper,
  AppHeader,
  GlassCard,
  StatusBadge,
  FadeInView,
  CardSkeleton,
} from '../../components';

// ─────────────────────────────────────────
// DETAIL ROW
// ─────────────────────────────────────────
const DetailRow = ({
  label,
  value,
  valueColor = colors.textSecondary,
  copyable = false,
  onCopy,
  isLast = false,
}) => (
  <View style={[detailStyles.row, !isLast && detailStyles.rowBorder]}>
    <Text style={detailStyles.label}>{label}</Text>
    <View style={detailStyles.valueRow}>
      <Text
        style={[detailStyles.value, { color: valueColor }]}
        numberOfLines={copyable ? 1 : undefined}
        selectable>
        {value}
      </Text>
      {copyable && onCopy ? (
        <TouchableWithoutFeedback onPress={onCopy}>
          <View style={detailStyles.copyBtn}>
            <Icon
              name="copy-outline"
              size={14}
              color={colors.accent}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  </View>
);

const detailStyles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  label: {
    ...typography.styles.caption,
    color: colors.textMuted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  value: {
    ...typography.styles.body,
    flex: 1,
  },
  copyBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});

// ─────────────────────────────────────────
// TRANSACTION DETAIL SCREEN
// ─────────────────────────────────────────
const TransactionDetailScreen = ({ navigation, route }) => {
  const { uuid } = route.params ?? {};
  const { transaction, isLoading } = useTransactionDetail(uuid);
  const { copy } = useClipboard();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Transaction Detail"
          navigation={navigation}
        />
        <CardSkeleton height={300} style={{ margin: spacing.md }} />
        <CardSkeleton height={200} style={{ margin: spacing.md }} />
      </ScreenWrapper>
    );
  }

  if (!transaction) {
    return (
      <ScreenWrapper>
        <AppHeader
          title="Transaction Detail"
          navigation={navigation}
        />
        <View style={styles.errorContainer}>
          <Icon
            name="alert-circle-outline"
            size={48}
            color={colors.textMuted}
          />
          <Text style={styles.errorText}>
            Transaction not found.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  const {
    transaction_type,
    amount_usdt,
    amount_inr,
    reference_id,
    created_at,
    uuid: txnUUID,
  } = transaction;

  const config = TRANSACTION_CONFIG[transaction_type] ?? {
    label: transaction_type,
    icon: 'swap-horizontal-outline',
    color: colors.textMuted,
    sign: '',
  };

  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <AppHeader
        title="Transaction Detail"
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Amount Card ── */}
        <FadeInView style={styles.heroCard}>
          <LinearGradient
            colors={[`${config.color}20`, `${config.color}08`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}>

            {/* Icon */}
            <View
              style={[
                styles.heroIcon,
                { backgroundColor: `${config.color}25` },
              ]}>
              <Icon
                name={config.icon}
                size={36}
                color={config.color}
              />
            </View>

            {/* Type */}
            <Text style={styles.heroType}>{config.label}</Text>

            {/* Amount */}
            <Text
              style={[
                styles.heroAmount,
                { color: config.color },
              ]}>
              {config.sign}
              {formatUSDT(Math.abs(amount_usdt), false)}
            </Text>
            <Text style={styles.heroCurrency}>USDT</Text>

            {/* INR equivalent */}
            {amount_inr ? (
              <View style={styles.inrBadge}>
                <Text style={styles.inrBadgeText}>
                  ≈ {formatINR(amount_inr)}
                </Text>
              </View>
            ) : null}
          </LinearGradient>
        </FadeInView>

        {/* ── Details Card ── */}
        <FadeInView delay={100}>
          <GlassCard style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>
              Transaction Details
            </Text>

            <DetailRow
              label="Transaction ID"
              value={truncateHash(txnUUID)}
              copyable
              onCopy={() => copy(txnUUID, 'Transaction ID')}
            />

            <DetailRow
              label="Type"
              value={config.label}
              valueColor={config.color}
            />

            <DetailRow
              label="Amount"
              value={formatUSDT(Math.abs(amount_usdt))}
              valueColor={config.color}
            />

            {amount_inr ? (
              <DetailRow
                label="INR Value"
                value={formatINR(amount_inr)}
                valueColor={colors.textSecondary}
              />
            ) : null}

            {reference_id ? (
              <DetailRow
                label="Reference ID"
                value={`#${reference_id}`}
                valueColor={colors.accent}
              />
            ) : null}

            <DetailRow
              label="Date & Time"
              value={formatDateTime(created_at)}
              isLast
            />
          </GlassCard>
        </FadeInView>

        {/* ── Status Note ── */}
        <FadeInView delay={180}>
          <GlassCard style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Icon
                name="checkmark-circle"
                size={20}
                color={colors.cryptoGreen}
              />
              <Text style={styles.statusText}>
                This transaction has been recorded in your wallet.
              </Text>
            </View>
          </GlassCard>
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

  // Hero
  heroCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderCard,
  },

  heroGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },

  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  heroType: {
    ...typography.styles.label,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
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
    marginBottom: spacing.md,
  },

  inrBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
  },

  inrBadgeText: {
    ...typography.styles.label,
    color: colors.textSecondary,
    fontSize: 13,
  },

  // Detail card
  detailCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  detailCardTitle: {
    ...typography.styles.sectionTitle,
    marginBottom: spacing.xs,
  },

  // Status card
  statusCard: {
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.md,
    borderColor: `${colors.cryptoGreen}25`,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  statusText: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    marginLeft: spacing.xs,
  },

  // Error
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

export default TransactionDetailScreen;