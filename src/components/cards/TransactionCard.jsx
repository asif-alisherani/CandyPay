// ============================================================
// CandyPay — Transaction Card (Fixed)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  spacing,
  radius,
  typography,
} from '../../theme';
import { TRANSACTION_CONFIG } from '../../constants';
import { formatUSDT, formatRelativeTime } from '../../utils';

const TransactionCard = ({
  transaction,
  onPress = null,
  style = {},
}) => {
  const {
    transaction_type,
    amount_usdt,
    created_at,
  } = transaction;

  const config = TRANSACTION_CONFIG[transaction_type] ?? {
    label: transaction_type,
    icon: 'swap-horizontal-outline',
    color: colors.textMuted,
    sign: '',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress && onPress(transaction)}
      disabled={!onPress}
      delayPressIn={100}
      style={[styles.card, style]}>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={[`${config.color}25`, `${config.color}10`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}>
          <Icon
            name={config.icon}
            size={22}
            color={config.color}
          />
        </LinearGradient>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.typeLabel} numberOfLines={1}>
          {config.label}
        </Text>
        <Text style={styles.dateText}>
          {formatRelativeTime(created_at)}
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.rightSection}>
        <Text style={[styles.amountText, { color: config.color }]}>
          {config.sign}{formatUSDT(Math.abs(amount_usdt), false)}
        </Text>
        <Text style={styles.unitText}>USDT</Text>
      </View>

      {/* Chevron */}
      {onPress && (
        <Icon
          name="chevron-forward"
          size={16}
          color={colors.textDisabled}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderCard,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.screenHorizontal,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  iconGradient: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  typeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textMuted,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: spacing.xs,
  },
  amountText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  unitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
});

export default TransactionCard;