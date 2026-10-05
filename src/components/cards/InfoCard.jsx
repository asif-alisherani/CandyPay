// ============================================================
// CandyPay — Info Card
// Generic info row card
// Used for Support, About, Profile details
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
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

// ─────────────────────────────────────────
// INFO ROW
// Single row inside a card
// ─────────────────────────────────────────
export const InfoRow = ({
  icon,
  iconColor = colors.accent,
  label,
  value,
  onPress = null,
  showChevron = false,
  valueColor = colors.textSecondary,
  isLast = false,
  rightComponent = null,
}) => (
  <TouchableWithoutFeedback onPress={onPress} disabled={!onPress}>
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      {/* Icon */}
      <View
        style={[
          styles.infoIconBox,
          { backgroundColor: `${iconColor}18` },
        ]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>

      {/* Label */}
      <Text style={styles.infoLabel}>{label}</Text>

      {/* Right */}
      <View style={styles.infoRight}>
        {rightComponent ? (
          rightComponent
        ) : (
          <Text
            style={[styles.infoValue, { color: valueColor }]}
            numberOfLines={1}>
            {value}
          </Text>
        )}
        {showChevron || onPress ? (
          <Icon
            name="chevron-forward"
            size={16}
            color={colors.textDisabled}
            style={styles.chevron}
          />
        ) : null}
      </View>
    </View>
  </TouchableWithoutFeedback>
);

// ─────────────────────────────────────────
// MENU ITEM
// Used in Profile screen menu
// ─────────────────────────────────────────
export const MenuItem = ({
  icon,
  iconColor = colors.accent,
  label,
  onPress,
  showChevron = true,
  rightBadge = null,
  isDanger = false,
  isLast = false,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.menuItem, !isLast && styles.menuItemBorder]}>
      {/* Icon */}
      <View
        style={[
          styles.menuIconBox,
          {
            backgroundColor: isDanger
              ? 'rgba(255,76,76,0.12)'
              : `${iconColor}18`,
          },
        ]}>
        <Icon
          name={icon}
          size={20}
          color={isDanger ? colors.statusRejected : iconColor}
        />
      </View>

      {/* Label */}
      <Text
        style={[
          styles.menuLabel,
          isDanger && { color: colors.statusRejected },
        ]}>
        {label}
      </Text>

      {/* Right */}
      <View style={styles.menuRight}>
        {rightBadge ? (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{rightBadge}</Text>
          </View>
        ) : null}
        {showChevron && (
          <Icon
            name="chevron-forward"
            size={18}
            color={
              isDanger ? colors.statusRejected : colors.textDisabled
            }
          />
        )}
      </View>
    </View>
  </TouchableWithoutFeedback>
);

// ─────────────────────────────────────────
// RATE CARD
// Shows current USDT rate
// ─────────────────────────────────────────
export const RateCard = ({
  rate,
  style = {},
}) => (
  <View style={[styles.rateCard, style]}>
    <LinearGradient
      colors={['rgba(0,196,159,0.12)', 'rgba(0,196,159,0.04)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.rateGradient}>
      <View style={styles.rateLeft}>
        <View style={styles.rateIconBox}>
          <Icon
            name="trending-up-outline"
            size={20}
            color={colors.cryptoGreen}
          />
        </View>
        <View>
          <Text style={styles.rateLabelText}>Current Rate</Text>
          <Text style={styles.rateLiveText}>Live</Text>
        </View>
      </View>
      <Text style={styles.rateValueText}>
        1 USDT = ₹{parseFloat(rate ?? 0).toFixed(2)}
      </Text>
    </LinearGradient>
  </View>
);

// ─────────────────────────────────────────
// PENDING REQUESTS CARD
// Shows pending deposit/withdraw summary
// ─────────────────────────────────────────
export const PendingCard = ({
  pendingDeposits = 0,
  pendingWithdrawals = 0,
  onDepositPress = null,
  onWithdrawPress = null,
  style = {},
}) => {
  if (pendingDeposits === 0 && pendingWithdrawals === 0) return null;

  return (
    <View style={[styles.pendingCard, style]}>
      <View style={styles.pendingHeader}>
        <Icon
          name="time-outline"
          size={16}
          color={colors.statusPending}
        />
        <Text style={styles.pendingTitle}>Pending Requests</Text>
      </View>

      <View style={styles.pendingItems}>
        {pendingDeposits > 0 && (
          <TouchableWithoutFeedback onPress={onDepositPress}>
            <View style={styles.pendingItem}>
              <View style={styles.pendingItemLeft}>
                <Icon
                  name="arrow-down-circle-outline"
                  size={16}
                  color={colors.cryptoGreen}
                />
                <Text style={styles.pendingItemLabel}>
                  Deposits
                </Text>
              </View>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {pendingDeposits}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}

        {pendingDeposits > 0 && pendingWithdrawals > 0 && (
          <View style={styles.pendingDivider} />
        )}

        {pendingWithdrawals > 0 && (
          <TouchableWithoutFeedback onPress={onWithdrawPress}>
            <View style={styles.pendingItem}>
              <View style={styles.pendingItemLeft}>
                <Icon
                  name="arrow-up-circle-outline"
                  size={16}
                  color={colors.statusRejected}
                />
                <Text style={styles.pendingItemLabel}>
                  Withdrawals
                </Text>
              </View>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {pendingWithdrawals}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  // InfoRow
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.cardPadding,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  infoLabel: {
    ...typography.styles.label,
    flex: 1,
  },

  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoValue: {
    ...typography.styles.caption,
    maxWidth: 150,
    textAlign: 'right',
  },

  chevron: {
    marginLeft: spacing.xs,
  },

  // MenuItem
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.cardPadding,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  menuLabel: {
    ...typography.styles.body,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 15,
  },

  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  menuBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.badge,
    marginRight: spacing.xs,
  },

  menuBadgeText: {
    ...typography.styles.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },

  // Rate Card
  rateCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.cryptoGreen}25`,
  },

  rateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },

  rateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  rateIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: `${colors.cryptoGreen}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  rateLabelText: {
    ...typography.styles.label,
    color: colors.textSecondary,
    fontSize: 13,
  },

  rateLiveText: {
    ...typography.styles.caption,
    color: colors.cryptoGreen,
    fontSize: 10,
    fontWeight: '600',
  },

  rateValueText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: colors.cryptoGreen,
    letterSpacing: 0.3,
  },

  // Pending Card
  pendingCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: `${colors.statusPending}30`,
    overflow: 'hidden',
  },

  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  pendingTitle: {
    ...typography.styles.label,
    color: colors.statusPending,
    marginLeft: 4,
  },

  pendingItems: {
    paddingBottom: spacing.sm,
  },

  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  pendingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  pendingItemLabel: {
    ...typography.styles.body,
    fontSize: 14,
    marginLeft: spacing.xs,
  },

  pendingBadge: {
    backgroundColor: `${colors.statusPending}25`,
    borderWidth: 1,
    borderColor: `${colors.statusPending}40`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.badge,
  },

  pendingBadgeText: {
    ...typography.styles.caption,
    color: colors.statusPending,
    fontWeight: '700',
  },

  pendingDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
});