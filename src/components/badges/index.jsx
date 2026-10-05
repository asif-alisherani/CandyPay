// ============================================================
// CandyPay — Badge Components
// StatusBadge
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { STATUS_CONFIG } from '../../constants';
import { colors, radius, typography, spacing } from '../../theme';

// ─────────────────────────────────────────
// STATUS BADGE
// pending / approved / rejected
// ─────────────────────────────────────────
export const StatusBadge = ({
  status,
  showIcon = true,
  size = 'medium',
  style = {},
}) => {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    color: colors.textMuted,
    background: 'rgba(255,255,255,0.08)',
  };

  const iconMap = {
    pending: 'time-outline',
    approved: 'checkmark-circle-outline',
    rejected: 'close-circle-outline',
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      fontSize: 10,
      iconSize: 10,
    },
    medium: {
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 4,
      fontSize: 12,
      iconSize: 12,
    },
    large: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      fontSize: 14,
      iconSize: 14,
    },
  };

  const s = sizeStyles[size] ?? sizeStyles.medium;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.background,
          borderColor: `${config.color}40`,
          paddingHorizontal: s.paddingHorizontal,
          paddingVertical: s.paddingVertical,
        },
        style,
      ]}>
      {showIcon ? (
        <Icon
          name={iconMap[status] ?? 'ellipse-outline'}
          size={s.iconSize}
          color={config.color}
          style={styles.badgeIcon}
        />
      ) : null}
      <Text
        style={[
          styles.badgeText,
          { color: config.color, fontSize: s.fontSize },
        ]}>
        {config.label}
      </Text>
    </View>
  );
};

// ─────────────────────────────────────────
// TYPE BADGE
// For transaction types
// ─────────────────────────────────────────
export const TypeBadge = ({
  type,
  style = {},
}) => {
  const typeConfig = {
    signup_bonus: { label: 'Bonus', color: colors.cryptoGreen },
    referral_bonus: { label: 'Referral', color: colors.seafoam },
    deposit: { label: 'Deposit', color: colors.cryptoGreen },
    withdraw: { label: 'Withdraw', color: colors.statusRejected },
    refund: { label: 'Refund', color: colors.statusPending },
  };

  const config = typeConfig[type] ?? {
    label: type,
    color: colors.textMuted,
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${config.color}18`,
          borderColor: `${config.color}30`,
          paddingHorizontal: spacing.sm,
          paddingVertical: 3,
        },
        style,
      ]}>
      <Text
        style={[
          styles.badgeText,
          { color: config.color, fontSize: 11 },
        ]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.badge,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeIcon: {
    marginRight: 3,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.3,
  },
});