// ============================================================
// CandyPay — Deposit Detail Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
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
import { formatUSDT, formatDateTime, truncateHash } from '../../utils';
import { useDepositDetail } from '../../hooks/useWallet';
import { useClipboard } from '../../hooks/useApp';

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
// DEPOSIT DETAIL SCREEN
// ─────────────────────────────────────────
const DepositDetailScreen = ({ navigation, route }) => {
  const { uuid } = route.params ?? {};
  const { deposit, isLoading } = useDepositDetail(uuid);
  const { copy } = useClipboard();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Deposit Detail" navigation={navigation} />
        <CardSkeleton height={200} style={{ margin: spacing.md }} />
        <CardSkeleton height={300} style={{ margin: spacing.md }} />
      </ScreenWrapper>
    );
  }

  if (!deposit) {
    return (
      <ScreenWrapper>
        <AppHeader title="Deposit Detail" navigation={navigation} />
        <View style={styles.errorContainer}>
          <Icon
            name="alert-circle-outline"
            size={48}
            color={colors.textMuted}
          />
          <Text style={styles.errorText}>Deposit not found.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const {
    requested_usdt,
    transaction_hash,
    payment_image,
    status,
    admin_remark,
    created_at,
    updated_at,
    uuid: depositUUID,
  } = deposit;

  // Status config
  const statusConfig = {
    pending: {
      icon: 'time-outline',
      color: colors.statusPending,
      message: 'Your deposit is pending admin review.',
      gradient: ['rgba(255,184,48,0.15)', 'rgba(255,184,48,0.05)'],
    },
    approved: {
      icon: 'checkmark-circle-outline',
      color: colors.statusApproved,
      message: 'Your deposit has been approved and credited.',
      gradient: ['rgba(0,196,159,0.15)', 'rgba(0,196,159,0.05)'],
    },
    rejected: {
      icon: 'close-circle-outline',
      color: colors.statusRejected,
      message: 'Your deposit was rejected. See admin remark below.',
      gradient: ['rgba(255,76,76,0.15)', 'rgba(255,76,76,0.05)'],
    },
  };

  const sc = statusConfig[status] ?? statusConfig.pending;

  return (
    <ScreenWrapper scrollable>
      <AppHeader title="Deposit Detail" navigation={navigation} />

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

            {/* Icon */}
            <View
              style={[
                styles.statusIconBox,
                { backgroundColor: `${sc.color}20` },
              ]}>
              <Icon name={sc.icon} size={40} color={sc.color} />
            </View>

            {/* Amount */}
            <Text style={styles.heroLabel}>Deposit Amount</Text>
            <Text
              style={[styles.heroAmount, { color: colors.cryptoGreen }]}>
              +{formatUSDT(requested_usdt, false)}
            </Text>
            <Text style={styles.heroCurrency}>USDT</Text>

            {/* Status Badge */}
            <StatusBadge status={status} size="large" style={styles.heroBadge} />
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
                style={[styles.messageText, { color: sc.color }]}>
                {sc.message}
              </Text>
            </View>

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

        {/* ── Transaction Details ── */}
        <FadeInView delay={120}>
          <GlassCard style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>
              Transaction Details
            </Text>

            {/* Reference ID */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference ID</Text>
              <View style={styles.detailValueRow}>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {truncateHash(depositUUID)}
                </Text>
                <TouchableWithoutFeedback
                  onPress={() => copy(depositUUID, 'Reference ID')}>
                  <View style={styles.copyBtn}>
                    <Icon
                      name="copy-outline"
                      size={14}
                      color={colors.accent}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={styles.detailDivider} />

            {/* Transaction Hash */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Transaction Hash
              </Text>
              <View style={styles.detailValueRow}>
                <Text
                  style={styles.detailValue}
                  numberOfLines={1}
                  ellipsizeMode="middle">
                  {truncateHash(transaction_hash)}
                </Text>
                <TouchableWithoutFeedback
                  onPress={() =>
                    copy(transaction_hash, 'Transaction Hash')
                  }>
                  <View style={styles.copyBtn}>
                    <Icon
                      name="copy-outline"
                      size={14}
                      color={colors.accent}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={styles.detailDivider} />

            {/* Status */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <StatusBadge status={status} size="medium" />
            </View>

            <View style={styles.detailDivider} />

            {/* Submitted */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(created_at)}
              </Text>
            </View>

            {/* Updated */}
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

        {/* ── Payment Screenshot ── */}
        {payment_image ? (
          <FadeInView delay={160}>
            <GlassCard style={styles.screenshotCard}>
              <Text style={styles.screenshotTitle}>
                Payment Screenshot
              </Text>
              <View style={styles.screenshotWrapper}>
                <Image
                  source={{ uri: payment_image }}
                  style={styles.screenshotImage}
                  resizeMode="cover"
                />
              </View>
            </GlassCard>
          </FadeInView>
        ) : null}

        {/* Back button */}
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

  // Status Hero
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
    marginBottom: spacing.md,
  },

  heroBadge: {
    marginTop: spacing.xs,
  },

  // Message Card
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

  // Detail Card
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
    flex: 1,
    justifyContent: 'flex-end',
  },

  detailValue: {
    ...typography.styles.body,
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'right',
    flex: 1,
  },

  detailDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },

  copyBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: `${colors.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Screenshot
  screenshotCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  screenshotTitle: {
    ...typography.styles.sectionTitle,
    marginBottom: spacing.md,
  },

  screenshotWrapper: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  screenshotImage: {
    width: '100%',
    height: 280,
  },

  // Back button
  backBtnContainer: {
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: spacing.sm,
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

export default DepositDetailScreen;